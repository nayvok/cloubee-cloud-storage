'use client';

import { useState } from 'react';

import Selection from '@/components/features/controls/selection';
import TrashCard from '@/components/features/trash/trash-card';
import TrashPlaceholder from '@/components/features/trash/trash-placeholder';
import FileItemsWrapper from '@/components/ui/elements/files/wrapper/file-items-wrapper';
import GridGhostItems from '@/components/ui/elements/files/wrapper/grid-ghost-items';
import PageLoader from '@/components/ui/elements/page-loader';
import { useTrashQuery } from '@/libs/api/files/hooks/use-trash-query';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';

const TrashContainer = () => {
    const { data, isPending } = useTrashQuery();
    const filesViewMode = filesPersistStore(state => state.filesViewMode);
    const [containerElement, setContainerElement] =
        useState<HTMLDivElement | null>(null);

    return (
        <>
            {data && data.length > 0 && containerElement && (
                <Selection files={data} containerElement={containerElement} />
            )}

            <FileItemsWrapper
                ref={setContainerElement}
                viewMode={filesViewMode}
            >
                {isPending ? (
                    <PageLoader />
                ) : (
                    <>
                        {data && data.length > 0 ? (
                            <>
                                {data.map(file => (
                                    <TrashCard
                                        key={file.id}
                                        file={file}
                                        viewMode={filesViewMode}
                                    />
                                ))}

                                <GridGhostItems viewMode={filesViewMode} />
                            </>
                        ) : (
                            <TrashPlaceholder />
                        )}
                    </>
                )}
            </FileItemsWrapper>
        </>
    );
};

export default TrashContainer;
