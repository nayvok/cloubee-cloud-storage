import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { MkdirDto } from '@/modules/files/dto/mkdir.dto';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';

import { FilesService } from './files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('mkdir')
    @ApiBearerAuth()
    mkdir(@UserId() userId: string, @Body() dto: MkdirDto) {
        return this.filesService.mkdir(userId, dto.folderName, dto.idContext);
    }

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiQuery({ name: 'idContext', required: false })
    @ApiQuery({ name: 'fileName', required: false })
    @ApiQuery({ name: 'fileSize', required: false })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiBearerAuth()
    upload(
        @UserId() userId: string,
        @Req() req: Request,
        @Res() res: Response,
        @Query('idContext') idContext?: string,
        @Query('fileName') fileName?: string,
        @Query('fileSize') fileSize?: string,
    ) {
        return this.filesService.upload(
            userId,
            req,
            res,
            idContext,
            fileName,
            Number(fileSize),
        );
    }

    @Post('rename')
    @ApiBearerAuth()
    rename(
        @UserId() userId: string,
        @Body('fileId') fileId: string,
        @Body('newName') newName: string,
    ) {
        return this.filesService.rename(userId, fileId, newName);
    }

    @Post('/file/download')
    @ApiBearerAuth()
    getFile(
        @UserId() userId: string,
        @Body('fileIds') fileIds: string[],
        @Res() res: Response,
    ) {
        return this.filesService.getFile(userId, fileIds, res);
    }

    @Get('/thumbnail/:fileId/:size')
    @ApiParam({
        name: 'size',
        enum: ['small', 'medium', 'large'], // Допустимые значения
        example: 'medium',
    })
    @ApiBearerAuth()
    getThumbnail(
        @UserId() userId: string,
        @Param('fileId') fileId: string,
        @Param('size') size: 'small' | 'medium' | 'large',
        @Res() res: Response,
    ) {
        return this.filesService.getThumbnail(userId, fileId, size, res);
    }

    @Get('trash')
    @ApiBearerAuth()
    getTrash(@UserId() userId: string) {
        return this.filesService.getTrashFiles(userId);
    }

    @Post('trash/soft')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fileIds: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of file IDs to soft delete',
                },
            },
            required: ['fileIds'],
        },
    })
    @ApiBearerAuth()
    softDelete(@UserId() userId: string, @Body('fileIds') fileIds: string[]) {
        return this.filesService.softDelete(userId, fileIds);
    }

    @Post('trash/restore')
    @ApiBearerAuth()
    restoreFile(@UserId() userId: string, @Body('fileId') fileId: string) {
        return this.filesService.restoreFile(userId, fileId);
    }

    @Post('trash/permanent')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fileIds: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of file IDs to permanent delete',
                },
            },
            required: ['fileIds'],
        },
    })
    @ApiBearerAuth()
    permanentDelete(
        @UserId() userId: string,
        @Body('fileIds') fileIds: string[],
    ) {
        return this.filesService.permanentDelete(userId, fileIds);
    }

    @Get(':idContext(*)?')
    @ApiParam({ name: 'idContext', required: false })
    @ApiQuery({
        name: 'sortMode',
        required: true,
        enum: ['byName', 'bySize', 'byLastChange'],
    })
    @ApiQuery({
        name: 'sortDirection',
        required: true,
        enum: ['asc', 'desc'],
    })
    @ApiBearerAuth()
    getFiles(
        @UserId() userId: string,
        @Query('sortMode') sortMode: 'byName' | 'bySize' | 'byLastChange',
        @Query('sortDirection') sortDirection: 'asc' | 'desc',
        @Param('idContext') idContext?: string,
    ) {
        return this.filesService.getAll(
            userId,
            sortMode,
            sortDirection,
            idContext,
        );
    }
}
