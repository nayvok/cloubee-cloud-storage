import { PropsWithChildren, Ref } from 'react';

import { cn } from '@/libs/utils/tw-merge';
import { TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

interface FilesWrapperProps extends PropsWithChildren {
    viewMode: TypeChangeFilesViewModeSchema['mode'];
    ref: Ref<HTMLDivElement | null>;
}

const FilesWrapper = ({ viewMode, ref, children }: FilesWrapperProps) => {
    return (
        <div
            ref={ref}
            className={cn(
                'flex h-0 w-full grow overflow-y-auto p-2 select-none',
                viewMode !== 'list'
                    ? 'flex-row flex-wrap content-start items-start justify-between gap-0'
                    : 'flex-col',
            )}
        >
            {children}
        </div>
    );
};

export default FilesWrapper;
