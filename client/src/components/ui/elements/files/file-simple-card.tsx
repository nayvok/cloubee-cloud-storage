import { ComponentProps } from 'react';

import { Card, CardContent } from '@/components/ui/common/card';
import ThumbnailImage from '@/components/ui/elements/files/file-thumbnail';
import { IFileResponse } from '@/libs/api/files/files.types';
import { getFileIcon } from '@/libs/utils/get-file-icon';
import { cn } from '@/libs/utils/tw-merge';

type FileSimpleCardProps = {
    file: IFileResponse;
} & ComponentProps<'div'>;

const FileSimpleCard = ({ file, ...props }: FileSimpleCardProps) => {
    const FileIcon = getFileIcon(file.mimeType, file.name, file.isDirectory);

    return (
        <Card
            {...props}
            className={cn(
                'h-[56px] border-0 bg-transparent shadow-none select-none',
                file.isDirectory
                    ? 'hover:bg-sidebar-accent cursor-pointer'
                    : 'cursor-initial pointer-events-none opacity-30',
            )}
        >
            <CardContent
                className={cn(
                    'flex flex-row items-center justify-start px-[16px] py-[8px]',
                )}
            >
                <div
                    className={cn(
                        'flex shrink-0 justify-center overflow-hidden',
                        'h-[40px] w-[40px] items-center',
                    )}
                >
                    {file.thumbnailLarge ? (
                        <ThumbnailImage fileId={file.id} viewMode="list" />
                    ) : (
                        <div className={cn('size-full')}>
                            <FileIcon strokeWidth={0.5} className="size-full" />
                        </div>
                    )}
                </div>
                <div className="flex w-0 grow flex-col justify-between gap-0.5 pl-5 text-xs max-[425px]:pl-3">
                    <span
                        title={file.name}
                        className="w-full overflow-hidden text-left text-sm overflow-ellipsis whitespace-nowrap"
                    >
                        {file.name}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FileSimpleCard;
