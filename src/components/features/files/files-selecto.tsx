import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Selecto from 'react-selecto';

import { IFileResponse } from '@/libs/api/files/files.types';
import { filesStore } from '@/libs/store/files/files.store';

interface FilesSelectoProps {
    files: IFileResponse[];
    pathname: string;
    containerElement: HTMLElement | null;
}

const FilesSelecto = ({
    files,
    pathname,
    containerElement,
}: FilesSelectoProps) => {
    const router = useRouter();

    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setLastSelectedFiles = filesStore(
        state => state.setLastSelectedFiles,
    );
    const addSelectedFile = filesStore(state => state.addSelectedFile);
    const removeSelectedFile = filesStore(state => state.removeSelectedFile);
    const headerActionBarRef = filesStore(state => state.headerActionBarRef);
    const setSelectoRef = filesStore(state => state.setSelectoRef);

    const selectoRef = useRef<Selecto>(null);
    const [selectStart, setSelectStart] = useState(false);

    const scrollOptions = useMemo(
        () => ({
            container: containerElement || document.body,
            throttleTime: 30,
            threshold: 0,
        }),
        [containerElement],
    );

    useEffect(() => {
        if (selectoRef.current) {
            setSelectoRef(selectoRef);
        }
    }, [selectoRef, setSelectoRef]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                !selectStart &&
                containerElement &&
                e.target instanceof Node &&
                !containerElement.contains(e.target) &&
                headerActionBarRef &&
                !headerActionBarRef.current?.contains(e.target) &&
                selectedFiles.length > 0
            ) {
                setLastSelectedFiles(selectedFiles);
                setSelectedFiles([]);
                selectoRef.current?.setSelectedTargets([]);
            }
        };

        const handleScroll = () => {
            selectoRef.current?.checkScroll();
        };

        if (containerElement) {
            containerElement.addEventListener('scroll', handleScroll);
        }
        document.addEventListener('click', handleClickOutside);

        return () => {
            if (containerElement) {
                containerElement.removeEventListener('scroll', handleScroll);
            }
            document.removeEventListener('click', handleClickOutside);
        };
    }, [
        containerElement,
        headerActionBarRef,
        selectedFiles,
        setSelectedFiles,
        selectStart,
        setLastSelectedFiles,
    ]);

    return (
        <Selecto
            key={pathname}
            ref={selectoRef}
            className="z-selecto"
            dragContainer={containerElement}
            selectableTargets={['.file-card']}
            onSelectStart={() => setSelectStart(true)}
            onSelect={e => {
                e.added.forEach(el => {
                    const fileData = files.find(f => f.id === el.id);
                    if (fileData) {
                        addSelectedFile(fileData);
                    }
                });
                e.removed.forEach(el => {
                    const fileData = files.find(f => f.id === el.id);
                    if (fileData) {
                        removeSelectedFile(fileData);
                    }
                });
            }}
            onSelectEnd={({ isDouble, selected }) => {
                setTimeout(() => {
                    setSelectStart(false);
                }, 10);

                if (isDouble && selected.length === 1) {
                    const fileId = selected[0].id;
                    const file = files.find(f => f.id === fileId);
                    setSelectedFiles([]);
                    if (file?.isDirectory) {
                        router.push(`${pathname}/${file.name}`, {
                            scroll: false,
                        });
                    } else {
                        alert(`Открываем файл: ${file?.name}`);
                    }
                }
            }}
            scrollOptions={scrollOptions}
            onScroll={e => {
                containerElement?.scrollBy(
                    e.direction[0] * 10,
                    e.direction[1] * 10,
                );
            }}
            hitRate={0}
            selectByClick={true}
            selectFromInside={true}
            continueSelect={false}
            toggleContinueSelect="ctrl"
            ratio={0}
        />
    );
};

export default FilesSelecto;
