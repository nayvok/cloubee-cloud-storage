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
        fileName?: string,
        fileSizeClient?: number,
    ) {
        console.log(
            `[UPLOAD] Start upload for user: ${userId}, idContext: ${idContext}`,
        );

        // Проверки перед инициализацией Busboy
        let uploadDir: string;
        let directory: File;
        let directoryId: string;

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

        const isNotFreeName = await this.prisma.file.findFirst({
            where: {
                userId: userId,
                name: fileName,
                directoryId: directoryId ?? null,
                isDeleted: false,
            },
        });

        if (isNotFreeName) {
            console.log(`[UPLOAD] File name already taken: ${fileName}`);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'NAME_ALREADY_TAKEN',
            });
        }

        if (fileSizeClient > Number(remainingSpace)) {
            console.log(`[UPLOAD] Not enough disk space for file: ${fileName}`);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'NOT_ENOUGH_DISK_SPACE',
            });
        }

        const busboy = Busboy({ headers: req.headers });
        let fileSize = 0;
        let fileReceived = false;
        let uploadError = false;
        let saveTo: string;

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

                fileSize = 0;
                saveTo = path.join(uploadDir, fileName);
                const writeStream = fs.createWriteStream(saveTo);

                file.on('data', chunk => {
                    fileSize += chunk.length;
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

        const handleAbort = (text: string) => {
            if (!uploadError && fileReceived && saveTo) {
                uploadError = true;
                console.warn(
                    `[UPLOAD] Upload ${text} by client for file: ${fileName}`,
                );
                fs.promises.rm(saveTo, { force: true }).catch(() => {});
            }
        };
        req.on('aborted', () => handleAbort('aborted'));

        req.pipe(busboy);
    }

    public async getFile(
        userId: string,
        fileIds: string[],
        res: Response,
        filePathFunc?: (file: File) => string,
    ) {
        try {
            if (fileIds.length === 1) {
                const file = await this.prisma.file.findUnique({
                    where: { id: fileIds[0], userId: userId },
                });

                const filePath = filePathFunc
                    ? filePathFunc(file)
                    : path.join(
                          this.config.getOrThrow<string>('STORAGE_PATH'),
                          file.path,
                      );

                if (file.isDirectory) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        message: 'File is directory',
                    });
                }

                return res.sendFile(filePath);
            } else {
                const files = await this.prisma.file.findMany({
                    where: {
                        id: {
                            in: fileIds,
                        },
                        userId: userId,
                    },
                });

                const haveDirs = files.every(file => Boolean(file.isDirectory));

                if (haveDirs) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        message: 'File is directory',
                    });
                }

                return this.sendArchive(res, files);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                error: error,
            });
        }
    }

    public async getThumbnail(
        userId: string,
        fileId: string,
        size: 'small' | 'medium' | 'large',
        res: Response,
    ) {
        return this.getFile(userId, [fileId], res, file => {
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

    public async restoreFiles(userId: string, fileIds: string[]) {
        const files = await this.prisma.file.findMany({
            where: {
                id: { in: fileIds },
                userId: userId,
                isDeleted: true,
            },
        });

        const missingFileIds = fileIds.filter(
            id => !files.some(file => file.id === id),
        );

        const results = await Promise.all(
            files.map(async file => {
                const nameConflict = await this.prisma.file.findFirst({
                    where: {
                        userId: userId,
                        name: file.name,
                        directoryId: file.directoryId,
                        isDeleted: false,
                    },
                });

                return {
                    file,
                    hasConflict: !!nameConflict,
                };
            }),
        );

        const filesToRestore = results.filter(r => !r.hasConflict);
        const conflictedFiles = results.filter(r => r.hasConflict);

        if (filesToRestore.length > 0) {
            await this.prisma.file.updateMany({
                where: {
                    id: { in: filesToRestore.map(f => f.file.id) },
                },
                data: { isDeleted: false },
            });
        }

        return {
            success: true,
            restored: filesToRestore.map(f => ({
                id: f.file.id,
                name: f.file.name,
            })),
            errors: [
                ...conflictedFiles.map(f => ({
                    fileId: f.file.id,
                    code: 'NAME_CONFLICT',
                    message: `File "${f.file.name}" already exists in target directory`,
                })),
                ...missingFileIds.map(id => ({
                    fileId: id,
                    code: 'NOT_FOUND',
                    message: 'File not found in trash',
                })),
            ],
        };
    }

    public async permanentDelete(
        userId: string,
        fileIds: string[],
        deleteAll: boolean = false,
    ) {
        try {
            let files: File[];

            if (deleteAll) {
                files = await this.prisma.file.findMany({
                    where: {
                        userId,
                        isDeleted: true,
                    },
                });
            } else {
                files = await this.prisma.file.findMany({
                    where: {
                        id: {
                            in: fileIds,
                        },
                        userId,
                        isDeleted: true,
                    },
                });
            }

            if (files.length === 0) {
                return { message: 'No files to delete' };
            }

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

                    await this.prisma.user.update({
                        where: { id: userId },
                        data: {
                            usedQuota: {
                                decrement: file.size,
                            },
                        },
                    });

                    await this.prisma.file.delete({ where: { id: file.id } });
                } else {
                    const nestedFileIds = await this.getNestedFiles(
                        file.id,
                        allUserFiles,
                    );

                    nestedFileIds.push(file.id);

                    await this.deleteDirectory(filePath, nestedFileIds);

                    const files = await this.prisma.file.findMany({
                        where: { id: { in: nestedFileIds } },
                    });

                    const filesSize = files
                        .map(file => file.size)
                        .reduce((a, b) => {
                            return a + b;
                        }, BigInt(0));

                    await this.prisma.user.update({
                        where: { id: userId },
                        data: {
                            usedQuota: {
                                decrement: filesSize,
                            },
                        },
                    });

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

    private async sendArchive(res: Response, files: File[]) {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="archive.zip"`,
        );

        const archive = archiver('zip', { zlib: { level: 1 } });

        archive.on('error', () => {
            res.status(500).send('ERROR_CREATE_ARCHIVE');
        });

        archive.pipe(res);

        for (const file of files) {
            const filePath = path.join(
                this.config.getOrThrow<string>('STORAGE_PATH'),
                file.path,
            );

            archive.file(filePath, { name: file.name });
        }

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

            const files = await this.prisma.file.findMany({
                where: {
                    id: { in: fileIds },
                },
            });

            const thumbnailPaths = files.flatMap(file =>
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
