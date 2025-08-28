import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { IFileResponse } from '@/libs/api/files/files.types';
import { filesStore } from '@/libs/store/files/files.store';

interface UseMobileSelectionProps {
    file: IFileResponse;
    files: IFileResponse[];
    pathname?: string;
}

const useMobileSelection = ({
    file,
    files,
    pathname,
}: UseMobileSelectionProps) => {
    const router = useRouter();

    const selectedFiles = filesStore(state => state.selectedFiles);
    const addSelectedFile = filesStore(state => state.addSelectedFile);
    const removeSelectedFile = filesStore(state => state.removeSelectedFile);

    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTouchStart = () => {
        holdTimer.current = setTimeout(() => {
            if (selectedFiles.find(f => f.id === file.id)) {
                removeSelectedFile(file);
            } else {
                addSelectedFile(file);
            }
        }, 500);
    };

    const handleTouchEnd = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
    };

    const handleClick = () => {
        const fileData = files.find(f => f.id === file.id);
        if (fileData) {
            if (selectedFiles.length >= 1) {
                if (selectedFiles.find(f => f.id === file.id)) {
                    removeSelectedFile(file);
                } else {
                    addSelectedFile(file);
                }
            } else if (pathname) {
                if (fileData.isDirectory) {
                    router.push(`${pathname}/${file.name}`, {
                        scroll: false,
                    });
                } else {
                    alert(`Открываем файл: ${file?.name}`);
                }
            }
        }
    };

    return { handleTouchStart, handleTouchEnd, handleClick };
};

export default useMobileSelection;
