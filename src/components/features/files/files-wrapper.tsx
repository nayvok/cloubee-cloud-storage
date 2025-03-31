'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import FilesSelecto from '@/components/features/files/files-selecto';
import FileCard from '@/components/features/files/list/file-card';
import { useFilesQuery } from '@/libs/api/files/hooks/use-files-query';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';
import { cn } from '@/libs/utils/tw-merge';

const FilesWrapper = () => {
    const pathname = usePathname();
    const [containerElement, setContainerElement] =
        useState<HTMLDivElement | null>(null);
    const filesViewMode = filesPersistStore(state => state.filesViewMode);

    const { data } = useFilesQuery({
        idContext: decodeURIComponent(
            pathname.split('/').filter(Boolean).slice(2).join('/'),
        ),
    });

    return (
        <>
            {data && data.length > 0 && containerElement && (
                <FilesSelecto
                    files={data}
                    pathname={pathname}
                    containerElement={containerElement}
                />
            )}

            <div
                ref={setContainerElement}
                className={cn(
                    'flex h-0 w-full grow overflow-y-auto p-2 select-none',
                    filesViewMode !== 'list'
                        ? 'flex-row flex-wrap content-start items-start justify-between gap-0'
                        : 'flex-col',
                )}
            >
                {data &&
                    data.length > 0 &&
                    data.map(file => (
                        <FileCard
                            key={file.id}
                            file={file}
                            viewMode={filesViewMode}
                        />
                    ))}

                {filesViewMode !== 'list' &&
                    Array.from({ length: 15 }).map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                'h-0',
                                filesViewMode === 'largeTile'
                                    ? 'w-[144px]'
                                    : filesViewMode === 'tile'
                                      ? 'w-[104px]'
                                      : '',
                            )}
                        ></div>
                    ))}
            </div>
        </>
    );
};

export default FilesWrapper;
