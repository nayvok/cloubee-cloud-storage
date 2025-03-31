import { format } from 'date-fns';
import { Download, PencilLine, Trash2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/common/card';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/common/context-menu';
import { IFileResponse } from '@/libs/api/files/files.types';
import { useIsMobile } from '@/libs/hooks/use-mobile';
import { filesStore } from '@/libs/store/files/files.store';
import { convertBytes } from '@/libs/utils/convert-bytes';
import { getFileIcon } from '@/libs/utils/get-file-icon';
import { cn } from '@/libs/utils/tw-merge';
import { TypeChangeFilesViewModSchema } from '@/schemas/files/change-files-view-mode';

import ThumbnailImage from './thumbnail-image';

interface FileCardProps {
    file: IFileResponse;
    viewMode: TypeChangeFilesViewModSchema['mode'];
}

const FileCard = ({ file, viewMode }: FileCardProps) => {
    const isMobile = useIsMobile();
    const selectedFiles = filesStore(state => state.selectedFiles);

    const FileIcon = getFileIcon(file.mimeType, file.name, file.isDirectory);

    return (
        <ContextMenu>
            <ContextMenuTrigger
                id={file.id}
                className={cn(
                    '[&[data-state=open]_>_div]:bg-sidebar-accent file-card mb-1',
                    viewMode === 'largeTile'
                        ? 'h-[180px] w-[144px]'
                        : viewMode === 'tile'
                          ? 'h-[144px] w-[104px]'
                          : 'h-[64px]',
                )}
            >
                <Card
                    className={cn(
                        'hover:bg-sidebar-accent cursor-pointer border-0 bg-transparent shadow-none select-none',
                        Boolean(selectedFiles?.find(f => f.id === file.id)) &&
                            'bg-sidebar-accent',
                        viewMode === 'largeTile'
                            ? 'h-[180px] w-[144px]'
                            : viewMode === 'tile'
                              ? 'h-[144px] w-[104px]'
                              : 'h-[64px]',
                    )}
                >
                    <CardContent
                        className={cn(
                            'flex p-[12px]',
                            viewMode === 'largeTile'
                                ? 'h-[180px] w-[144px] flex-col justify-between'
                                : viewMode === 'tile'
                                  ? 'h-[144px] w-[104px] flex-col justify-between'
                                  : 'flex-row items-center justify-start max-[425px]:px-[6px]',
                        )}
                    >
                        <div
                            className={cn(
                                'flex shrink-0 justify-center',
                                viewMode === 'largeTile'
                                    ? 'h-[115px] w-full items-end'
                                    : viewMode === 'tile'
                                      ? 'h-[80px] w-full items-end'
                                      : 'h-[40px] w-[40px] items-center',
                            )}
                        >
                            {file.thumbnailLarge ? (
                                <ThumbnailImage
                                    fileId={file.id}
                                    viewMode={viewMode}
                                />
                            ) : (
                                <div
                                    className={cn(
                                        viewMode === 'largeTile'
                                            ? 'size-[100px]'
                                            : viewMode === 'tile'
                                              ? 'size-[64px]'
                                              : 'size-full',
                                    )}
                                >
                                    <FileIcon
                                        strokeWidth={0.5}
                                        className="size-full"
                                    />
                                </div>
                            )}
                        </div>
                        {viewMode === 'list' ? (
                            isMobile ? (
                                <div className="flex w-0 grow flex-col justify-between gap-0.5 pl-5 text-xs max-[425px]:pl-3">
                                    <span
                                        title={file.name}
                                        className="w-full overflow-hidden text-left text-sm overflow-ellipsis whitespace-nowrap"
                                    >
                                        {file.name}
                                    </span>
                                    <div className="text-muted-foreground inline-flex gap-1.5">
                                        <span>
                                            {format(
                                                new Date(file.updatedAt),
                                                'dd.MM.yyyy',
                                            )}
                                        </span>
                                        <span>
                                            {format(
                                                new Date(file.updatedAt),
                                                'HH:mm',
                                            )}
                                        </span>
                                        <span>
                                            {Number(file.size) !== 0 &&
                                                convertBytes(Number(file.size))}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="inline-flex shrink-0 grow overflow-hidden pl-5 text-xs">
                                    <span className="w-0 grow basis-0 overflow-hidden text-left overflow-ellipsis whitespace-nowrap">
                                        {file.name}
                                    </span>
                                    <span className="text-muted-foreground ml-5 basis-[75px] text-right lg:basis-[100px]">
                                        {format(
                                            new Date(file.updatedAt),
                                            'dd.MM.yyyy',
                                        )}
                                    </span>
                                    <span className="text-muted-foreground basis-[75px] text-right lg:basis-[100px]">
                                        {format(
                                            new Date(file.updatedAt),
                                            'HH:mm',
                                        )}
                                    </span>
                                    <span className="text-muted-foreground basis-[75px] text-right lg:basis-[100px]">
                                        {Number(file.size) !== 0 &&
                                            convertBytes(Number(file.size))}
                                    </span>
                                </div>
                            )
                        ) : (
                            <div className="flex h-[31px] w-full items-start justify-center overflow-hidden">
                                <span
                                    title={file.name}
                                    className="line-clamp-2 text-center text-xs break-words"
                                >
                                    {file.name}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
                {selectedFiles.length > 1 ? (
                    <>
                        <ContextMenuItem>
                            <Download />
                            Скачать
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Trash2 />
                            Удалить
                        </ContextMenuItem>
                    </>
                ) : (
                    <>
                        <ContextMenuItem>
                            <Download />
                            Скачать
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <PencilLine />
                            Переименовать
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Trash2 />
                            Удалить
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default FileCard;
