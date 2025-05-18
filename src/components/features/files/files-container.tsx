'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Selection from '@/components/features/controls/selection';
import FilesCard from '@/components/features/files/files-card';
import FilesPlaceholder from '@/components/features/files/files-placeholder';
import FilesWrapper from '@/components/ui/elements/files/wrapper/files-wrapper';
import GridGhostItems from '@/components/ui/elements/files/wrapper/grid-ghost-items';
import PageLoader from '@/components/ui/elements/page-loader';
import { useFilesQuery } from '@/libs/api/files/hooks/use-files-query';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';

const FilesContainer = () => {
    const pathname = usePathname();
    const [containerElement, setContainerElement] =
        useState<HTMLDivElement | null>(null);

    const filesViewMode = filesPersistStore(state => state.filesViewMode);

    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const filesSortDirection = filesPersistStore(
        state => state.filesSortDirection,
    );

    const { data, isPending } = useFilesQuery({
        sortMode: filesSortMode,
        sortDirection: filesSortDirection,
        idContext: decodeURIComponent(
            pathname.split('/').filter(Boolean).slice(2).join('/'),
        ),
    });

    return (
        <>
            {data && data.length > 0 && containerElement && (
                <Selection
                    files={data}
                    pathname={pathname}
                    containerElement={containerElement}
                />
            )}

            <FilesWrapper ref={setContainerElement} viewMode={filesViewMode}>
                {isPending ? (
                    <PageLoader />
                ) : (
                    <>
                        {data && data.length > 0 ? (
                            <>
                                {data.map(file => (
                                    <FilesCard
                                        key={file.id}
                                        file={file}
                                        viewMode={filesViewMode}
                                    />
                                ))}

                                <GridGhostItems viewMode={filesViewMode} />
                            </>
                        ) : (
                            <FilesPlaceholder />
                        )}
                    </>
                )}
            </FilesWrapper>
        </>
    );
};

export default FilesContainer;
