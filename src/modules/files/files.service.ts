import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as archiver from 'archiver';
import * as Busboy from 'busboy';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaService } from '@/core/prisma/prisma.service';
import { generateThumbnails } from '@/shared/utils/generate-thumbnails.utils';

import { File } from '../../../prisma/generated';

@Injectable()
export class FilesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {}

    public async getAll(
        userId: string,
        sortMode: 'byName' | 'bySize' | 'byLastChange',
        sortDirection: 'asc' | 'desc',
        idContext?: string,
    ): Promise<File[]> {
        let dirId = '';

        if (idContext) {
            const file = await this.prisma.file.findFirst({
                where: {
                    path: path.posix.join(userId, 'files', idContext),
                    isDirectory: true,
                },
            });

            if (!file || file.isDeleted) {
                throw new NotFoundException(
                    'Directory not found or is not directory',
                );
            }

            dirId = file.id;
        }

        const allItems = await this.prisma.file.findMany({
            where: {
                userId: userId,
                directoryId: dirId || null,
                isDeleted: false,
            },
        });

        const folders = this.sortByMode(
            allItems.filter(file => file.isDirectory),
            sortMode,
            sortDirection,
        );
        const files = this.sortByMode(
            allItems.filter(file => !file.isDirectory),
            sortMode,
            sortDirection,
        );

        return [...folders, ...files];
    }

    public async mkdir(
        userId: string,
        folderName: string,
        idContext?: string,
    ): Promise<{ message: string }> {
        let directory: File;

        if (idContext) {
            const file = await this.prisma.file.findFirst({
                where: {
                    path: path.posix.join(userId, 'files', idContext),
                    isDirectory: true,
                    isDeleted: false,
                },
            });

            if (!file || file.isDeleted) {
                throw new NotFoundException(
                    'Directory not found or is not directory',
                );
            }

            directory = file;
        }

        const isNotFreeName = await this.prisma.file.findFirst({
            where: {
                userId: userId,
                name: folderName,
                isDeleted: false,
                directoryId: directory ? directory.id : null,
            },
        });

        if (isNotFreeName) {
            throw new BadRequestException('NAME_ALREADY_TAKEN');
        }

        let folderPath: string;

        if (directory) {
            folderPath = path.join(
                this.config.getOrThrow<string>('STORAGE_PATH'),
                directory.path,
                folderName,
            );
        } else {
            folderPath = path.join(
                this.config.getOrThrow<string>('STORAGE_PATH'),
                userId,
                'files',
                folderName,
            );
        }

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        await this.prisma.file.create({
            data: {
                name: folderName,
                userId: userId,
                directoryId: directory ? directory.id : null,
                size: 0,
                path: directory
                    ? path.posix.join(directory.path, folderName)
                    : path.posix.join(userId, 'files', folderName),
                isDirectory: true,
            },
        });

        return { message: 'Folder created successfully.' };
    }

    public async upload(
        userId: string,
        req: Request,
        res: Response,
        idContext?: string,
    ) {
        console.log(
            `[UPLOAD] Start upload for user: ${userId}, idContext: ${idContext}`,
        );

        const busboy = Busboy({ headers: req.headers });

        let uploadDir: string;
        let directory: File;
        let directoryId: string;
        let fileName: string;
        let fileSize = 0;
        let fileReceived = false;
        let uploadError = false;
        let saveTo: string;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        const quota = user.storageQuota;
        const usedSpace = user.usedQuota;
        const remainingSpace = quota - usedSpace;

        if (idContext) {
            const file = await this.prisma.file.findFirst({
                where: {
                    path: path.posix.join(userId, 'files', idContext),
                    isDirectory: true,
                    isDeleted: false,
                },
            });

            if (!file || file.isDeleted) {
                console.log(
                    `[UPLOAD] Directory not found for idContext: ${idContext}`,
                );
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'Directory not found.',
                });
            }

            if (!file.isDirectory) {
                console.log(
                    `[UPLOAD] idContext is not a directory: ${idContext}`,
                );
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Is not a directory.',
                });
            }

            directory = file;
            directoryId = file.id;

            uploadDir = path.join(
                this.config.getOrThrow<string>('STORAGE_PATH'),
                directory.path,
            );
        } else {
            uploadDir = path.join(
                this.config.getOrThrow<string>('STORAGE_PATH'),
                userId,
                'files',
            );
        }

        if (!fs.existsSync(uploadDir)) {
            console.log(
                `[UPLOAD] Upload directory does not exist: ${uploadDir}`,
            );
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'Upload directory not found.',
            });
        }

        busboy.on('file', async (_, file, fileInfo) => {
            if (fileReceived) {
                file.resume();
                return;
            }
            fileReceived = true;

            try {
                fileName = Buffer.from(fileInfo.filename, 'binary').toString(
                    'utf8',
                );
                fileName = path.basename(fileName);

                console.log(`[UPLOAD] Receiving file: ${fileName}`);

                const isNotFreeName = await this.prisma.file.findFirst({
                    where: {
                        userId: userId,
                        name: fileName,
                        directoryId: directoryId ?? null,
                        isDeleted: false,
                    },
                });

                if (isNotFreeName) {
                    console.log(
                        `[UPLOAD] File name already taken: ${fileName}`,
                    );
                    file.resume();
                    uploadError = true;
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        message: 'The file name is already taken',
                    });
                }

                fileSize = 0;
                saveTo = path.join(uploadDir, fileName);
                const writeStream = fs.createWriteStream(saveTo);

                file.on('data', chunk => {
                    fileSize += chunk.length;
                    if (fileSize > remainingSpace) {
                        console.log(
                            `[UPLOAD] Not enough disk space for file: ${fileName}`,
                        );
                        file.resume();
                        uploadError = true;
                        writeStream.destroy();
                        fs.promises.rm(saveTo, { force: true }).catch(() => {});
                        return res.status(HttpStatus.BAD_REQUEST).json({
                            message: 'Not enough disk space available.',
                        });
                    }
                });

                file.pipe(writeStream);

                file.on('error', err => {
                    console.error(
                        `[UPLOAD] Error uploading file: ${fileName}`,
                        err,
                    );
                    writeStream.destroy();
                    uploadError = true;
                    fs.promises.rm(saveTo, { force: true }).catch(() => {});
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        message: 'Error uploading file.',
                    });
                });

                writeStream.on('error', err => {
                    uploadError = true;
                    console.error(
                        `[UPLOAD] Error writing file: ${fileName}`,
                        err,
                    );
                    fs.promises.rm(saveTo, { force: true }).catch(() => {});
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        message: 'Error writing file.',
                    });
                });

                writeStream.on('finish', async () => {
                    if (uploadError) return;
                    try {
                        const filePath = directoryId
                            ? path.posix.join(directory.path, fileName)
                            : path.posix.join(userId, 'files', fileName);

                        const dbFile = await this.prisma.file.create({
                            data: {
                                name: fileName,
                                userId: userId,
                                directoryId: directoryId ?? null,
                                size: fileSize,
                                mimeType: fileInfo.mimeType,
                                path: filePath,
                            },
                        });

                        console.log(
                            `[UPLOAD] File saved to DB: ${fileName}, id: ${dbFile.id}`,
                        );

                        const thumbnailPaths = await generateThumbnails(
                            userId,
                            dbFile.id,
                            filePath,
                            this.config,
                        );

                        if (thumbnailPaths) {
                            await this.prisma.file.update({
                                where: { id: dbFile.id },
                                data: {
                                    thumbnailLarge: thumbnailPaths[0],
                                    thumbnailMedium: thumbnailPaths[1],
                                    thumbnailSmall: thumbnailPaths[2],
                                },
                            });
                            console.log(
                                `[UPLOAD] Thumbnails generated for: ${fileName}`,
                            );
                        }

                        await this.prisma.user.update({
                            where: { id: userId },
                            data: {
                                usedQuota: usedSpace + BigInt(fileSize),
                            },
                        });
                        console.log(
                            `[UPLOAD] User quota updated for user: ${userId}`,
                        );

                        res.status(HttpStatus.OK).json({
                            message: 'File uploaded successfully.',
                        });
                    } catch (dbError) {
                        uploadError = true;
                        console.error(
                            `[UPLOAD] Database error for file: ${fileName}`,
                            dbError,
                        );
                        fs.promises.rm(saveTo, { force: true }).catch(() => {});
                        return res
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({
                                message:
                                    'Database error while saving file metadata.',
                                error: dbError,
                            });
                    }
                });
            } catch (error) {
                uploadError = true;
                console.error(
                    `[UPLOAD] Error processing file upload: ${fileName}`,
                    error,
                );
                if (saveTo)
                    fs.promises.rm(saveTo, { force: true }).catch(() => {});
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Error processing file upload.',
                    error: error,
                });
            }
        });

        busboy.on('finish', () => {
            if (!uploadError && !fileReceived) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'No file uploaded.',
                });
            }
        });

        busboy.on('error', error => {
            console.error(`[UPLOAD] Busboy error:`, error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error processing request.',
                error: error,
            });
        });

        const handleAbort = () => {
            if (!uploadError && fileReceived && saveTo) {
                uploadError = true;
                console.warn(
                    `[UPLOAD] Upload aborted by client for file: ${fileName}`,
                );
                fs.promises.rm(saveTo, { force: true }).catch(() => {});
            }
        };
        req.on('aborted', handleAbort);
        req.on('close', handleAbort);

        req.pipe(busboy);
    }

    public async getFile(
        userId: string,
        fileId: string,
        res: Response,
        filePathFunc?: (file: File) => string,
    ) {
        try {
            const file = await this.prisma.file.findUnique({
                where: { id: fileId, userId: userId },
            });

            if (!file) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'File not found',
                });
            }

            const filePath = filePathFunc
                ? filePathFunc(file)
                : path.join(
                      this.config.getOrThrow<string>('STORAGE_PATH'),
                      file.path,
                  );

            if (!fs.existsSync(filePath)) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'File not found',
                });
            }

            if (file.isDirectory) {
                await this.sendArchive(res, filePath, path.basename(filePath));
                return;
            }

            return res.sendFile(filePath);
        } catch {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
            });
        }
    }

    public async getThumbnail(
        userId: string,
        fileId: string,
        size: 'small' | 'medium' | 'large',
        res: Response,
    ) {
        return this.getFile(userId, fileId, res, file => {
            const thumbnailPath = {
                small: file.thumbnailSmall,
                medium: file.thumbnailMedium,
                large: file.thumbnailLarge,
            }[size];

            return path.join(
                this.config.getOrThrow<string>('STORAGE_PATH'),
                thumbnailPath,
            );
        });
    }

    public async rename(userId: string, fileId: string, name: string) {
        const file = await this.prisma.file
            .findUniqueOrThrow({
                where: { id: fileId, userId },
            })
            .catch(() => {
                throw new NotFoundException('NOT_FOUND');
            });

        const oldPath = path.join(
            this.config.getOrThrow<string>('STORAGE_PATH'),
            file.path,
        );

        const isNotFreeName = await this.prisma.file.findFirst({
            where: {
                name: name,
                directoryId: file.directoryId,
                userId: userId,
                NOT: { id: file.id },
            },
        });
        if (isNotFreeName) {
            throw new BadRequestException('NAME_ALREADY_TAKEN');
        }

        if (!file.isDirectory) {
            const newName = `${name}`;
            const newPath = path.posix.join(path.dirname(file.path), newName);

            await this.renamePath(
                oldPath,
                path.join(
                    this.config.getOrThrow<string>('STORAGE_PATH'),
                    newPath,
                ),
            );

            await this.prisma.file.update({
                where: { id: file.id },
                data: { name: newName, path: newPath },
            });

            return { message: 'File renamed successfully.' };
        }

        const newPath = path.posix.join(path.dirname(file.path), name);
        const nestedFiles = await this.prisma.file.findMany({
            where: { directoryId: file.id },
        });

        await this.prisma.file.update({
            where: { id: file.id },
            data: { name: name, path: newPath },
        });

        await this.updateNestedPaths(file.path, newPath, nestedFiles);
        await this.renamePath(
            oldPath,
            path.join(this.config.getOrThrow<string>('STORAGE_PATH'), newPath),
        );

        return { message: 'Directory renamed successfully.' };
    }

    public async softDelete(userId: string, fileIds: string[]) {
        try {
            await this.prisma.$transaction([
                this.prisma.file.updateMany({
                    where: {
                        id: { in: fileIds },
                        userId: userId,
                    },
                    data: {
                        isDeleted: true,
                    },
                }),
            ]);

            return {
                message: 'File moved to trash successfully',
            };
        } catch {
            throw new NotFoundException('Error moving files to trash');
        }
    }

    public async getTrashFiles(userId: string) {
        return this.prisma.file.findMany({
            where: {
                userId: userId,
                isDeleted: true,
            },
        });
    }

    public async restoreFile(userId: string, fileId: string) {
        const file = await this.prisma.file.findUniqueOrThrow({
            where: { id: fileId },
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        if (!file.isDeleted) {
            throw new BadRequestException('File is not in trash');
        }

        const isNotFreeName = await this.prisma.file.findFirst({
            where: {
                userId: userId,
                name: file.name,
                directoryId: file.directoryId,
                isDeleted: false,
            },
        });

        if (isNotFreeName) {
            throw new BadRequestException('Name already exists.');
        }

        await this.prisma.file.update({
            where: { id: fileId, userId: userId, isDeleted: true },
            data: { isDeleted: false },
        });

        return { message: 'File restored successfully' };
    }

    public async permanentDelete(userId: string, fileIds: string[]) {
        try {
            const files = await this.prisma.file.findMany({
                where: {
                    id: {
                        in: fileIds,
                    },
                    userId,
                    isDeleted: true,
                },
            });

            const allUserFiles = await this.prisma.file.findMany({
                where: { userId },
            });

            for (const file of files) {
                const filePath = path.join(
                    this.config.getOrThrow<string>('STORAGE_PATH'),
                    file.path,
                );

                if (!file.isDirectory) {
                    if (
                        file.thumbnailSmall &&
                        file.thumbnailMedium &&
                        file.thumbnailLarge
                    ) {
                        await this.deleteFile(filePath, {
                            small: file.thumbnailSmall,
                            medium: file.thumbnailMedium,
                            large: file.thumbnailLarge,
                        });
                    } else {
                        await this.deleteFile(filePath);
                    }

                    await this.prisma.file.delete({ where: { id: file.id } });
                } else {
                    const nestedFileIds = await this.getNestedFiles(
                        file.id,
                        allUserFiles,
                    );

                    nestedFileIds.push(file.id);

                    await this.deleteDirectory(filePath, nestedFileIds);

                    await this.prisma.file.deleteMany({
                        where: { id: { in: nestedFileIds } },
                    });
                }
            }

            return { message: 'Deleting successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    private readonly nameCollator = new Intl.Collator(undefined, {
        sensitivity: 'base',
    });

    private sortByMode(
        files: File[],
        mode: 'byName' | 'bySize' | 'byLastChange',
        direction: 'asc' | 'desc',
    ) {
        const items = [...files];
        const directionMultiplier = direction === 'asc' ? 1 : -1;

        if (mode === 'byName') {
            return items.sort(
                (a, b) =>
                    directionMultiplier *
                    this.nameCollator.compare(a.name, b.name),
            );
        }
        if (mode === 'bySize') {
            return items.sort(
                (a, b) =>
                    directionMultiplier *
                    (a.size === b.size ? 0 : a.size > b.size ? 1 : -1),
            );
        }
        if (mode === 'byLastChange') {
            return items.sort(
                (a, b) =>
                    directionMultiplier *
                    (a.updatedAt.getTime() - b.updatedAt.getTime()),
            );
        }
        throw new Error(`Unknown sort mode: ${mode}`);
    }

    private async sendArchive(
        res: Response,
        filePath: string,
        filename: string,
    ) {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}.zip"`,
        );

        const archive = archiver('zip', { zlib: { level: 1 } });

        archive.on('error', () => {
            res.status(500).send('Ошибка создания архива');
        });

        archive.pipe(res);

        archive.directory(filePath, false);

        await archive.finalize();
    }

    private async renamePath(oldPath: string, newPath: string) {
        try {
            await fs.promises.rename(oldPath, newPath);
        } catch {
            throw new InternalServerErrorException('Error renaming path');
        }
    }

    private async updateNestedPaths(
        oldBasePath: string,
        newBasePath: string,
        files: File[],
    ) {
        for (const file of files) {
            const newFilePath = path.posix.join(
                newBasePath,
                path.posix.relative(oldBasePath, file.path),
            );

            await this.prisma.file.update({
                where: { id: file.id },
                data: { path: newFilePath },
            });

            if (file.isDirectory) {
                const nestedFiles = await this.prisma.file.findMany({
                    where: { directoryId: file.id },
                });
                await this.updateNestedPaths(
                    file.path,
                    newFilePath,
                    nestedFiles,
                );
            }
        }
    }

    private async deleteFile(
        filePath: string,
        thumbnails?: {
            small: string;
            medium: string;
            large: string;
        },
    ) {
        try {
            await fs.promises.rm(filePath);

            if (thumbnails) {
                await Promise.all([
                    fs.promises.rm(
                        path.join(
                            this.config.getOrThrow<string>('STORAGE_PATH'),
                            thumbnails.small,
                        ),
                        { force: true },
                    ),
                    fs.promises.rm(
                        path.join(
                            this.config.getOrThrow<string>('STORAGE_PATH'),
                            thumbnails.medium,
                        ),
                        { force: true },
                    ),
                    fs.promises.rm(
                        path.join(
                            this.config.getOrThrow<string>('STORAGE_PATH'),
                            thumbnails.large,
                        ),
                        { force: true },
                    ),
                ]);
            }
        } catch {
            throw new InternalServerErrorException('Error deleting file');
        }
    }

    private async deleteDirectory(dirPath: string, fileIds: string[]) {
        try {
            await fs.promises.rm(dirPath, { recursive: true });

            const filesWithThumbnails = await this.prisma.file.findMany({
                where: {
                    id: { in: fileIds },
                },
            });

            const thumbnailPaths = filesWithThumbnails.flatMap(file =>
                [
                    file.thumbnailSmall,
                    file.thumbnailMedium,
                    file.thumbnailLarge,
                ].filter(Boolean),
            );

            if (thumbnailPaths) {
                await Promise.all(
                    thumbnailPaths.map(thumbnail =>
                        fs.promises.rm(
                            path.join(
                                this.config.getOrThrow<string>('STORAGE_PATH'),
                                thumbnail,
                            ),
                            { force: true },
                        ),
                    ),
                );
            }
        } catch {
            throw new InternalServerErrorException('Error deleting directory');
        }
    }

    private async getNestedFiles(
        dirId: string,
        allFiles: File[],
    ): Promise<string[]> {
        const nestedFiles = allFiles.filter(file => file.directoryId === dirId);
        const fileIds: string[] = nestedFiles.map(file => file.id);

        for (const file of nestedFiles) {
            if (file.isDirectory) {
                const nestedIds = await this.getNestedFiles(file.id, allFiles);
                fileIds.push(...nestedIds);
            }
        }

        return fileIds;
    }
}
