'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';

import Selection from '@/components/features/controls/selection';
import FilesCard from '@/components/features/files/files-card';
import FilesPlaceholder from '@/components/features/files/files-placeholder';
import FilesUploaderDropzone from '@/components/features/files/files-uploader-dropzone';
import CircleCenteredLoader from '@/components/ui/elements/circle-centered-loader';
import FileItemsWrapper from '@/components/ui/elements/files/wrapper/file-items-wrapper';
import GridGhostItems from '@/components/ui/elements/files/wrapper/grid-ghost-items';
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

    const dir = pathname.split('/').filter(Boolean).slice(2).join('/');

    const { data, isPending } = useFilesQuery({
        sortMode: filesSortMode,
        sortDirection: filesSortDirection,
        idContext: decodeURIComponent(dir),
    });

    return (
        <>
            {data && data.length > 0 && containerElement && !isMobile && (
                <Selection
                    files={data}
                    pathname={pathname}
                    containerElement={containerElement}
                />
            )}
            <FileItemsWrapper
                ref={setContainerElement}
                viewMode={filesViewMode}
            >
                {isPending ? (
                    <CircleCenteredLoader />
                ) : (
                    <>
                        {data && data.length > 0 ? (
                            <>
                                {data.map(file => (
                                    <FilesCard
                                        key={file.id}
                                        file={file}
                                        viewMode={filesViewMode}
                                        files={data}
                                        pathname={pathname}
                                    />
                                ))}

                                <GridGhostItems viewMode={filesViewMode} />
                            </>
                        ) : (
                            <FilesPlaceholder />
                        )}
                    </>
                )}
                <FilesUploaderDropzone dir={dir} />
            </FileItemsWrapper>
        </>
    );
};

export default FilesContainer;
