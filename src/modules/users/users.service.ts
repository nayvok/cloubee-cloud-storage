import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { PrismaService } from '@/core/prisma/prisma.service';

import { Role } from '../../../prisma/generated';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {}

    public async findAll() {
        const users = await this.prisma.user.findMany();

        const roleOrder = {
            ADMIN: 0,
            USER: 1,
        };

        return users.sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
    }

    public async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            omit: {
                password: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new Error(`User with ID-${id} not found`);
        }

        return user;
    }

    public async updateCurrentUser(
        id: string,
        name?: string,
        password?: string,
    ) {
        if (!name && !password) {
            throw new InternalServerErrorException('No changes provided');
        }

        try {
            const updateData: any = {};

            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            if (name) {
                updateData.name = name;
            }

            await this.prisma.user.update({
                where: { id },
                data: updateData,
            });

            return { message: 'User updated successfully.' };
        } catch {
            throw new InternalServerErrorException('Error during update');
        }
    }

    public async updateUserByAdmin(id: string, storageQuota?: number) {
        if (!storageQuota) {
            throw new InternalServerErrorException('No changes provided');
        }

        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (user.usedQuota >= storageQuota) {
            throw new ConflictException('QUOTA_CONFLICT');
        }

        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    ...(storageQuota && { storageQuota }),
                },
            });

            await this.prisma.user.updateMany({
                where: { role: 'ADMIN' },
                data: {
                    storageQuota: {
                        increment:
                            Number(user.storageQuota) - Number(storageQuota),
                    },
                },
            });

            return { message: 'User updated successfully.', updatedUser };
        } catch {
            throw new InternalServerErrorException('Error during update');
        }
    }

    public async deleteUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new NotFoundException('NOT_FOUND');
        }

        if (user.role === Role.ADMIN) {
            throw new ConflictException('CANNOT_DELETE_ADMIN');
        }

        const userFolder = path.join(
            this.config.getOrThrow<string>('STORAGE_PATH'),
            user.id,
        );

        if (fs.existsSync(userFolder)) {
            await fs.promises.rm(userFolder, { recursive: true, force: true });
        }

        await this.prisma.file.deleteMany({
            where: {
                userId: user.id,
            },
        });

        await this.prisma.user.updateMany({
            where: { role: 'ADMIN' },
            data: {
                storageQuota: {
                    increment: user.storageQuota,
                },
            },
        });

        await this.prisma.user.delete({
            where: { id: user.id },
        });
    }
}
