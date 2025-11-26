import { useEffect, useRef, useState } from 'react';

import { useFileUploader } from '@/libs/hooks/use-file-uploader';

interface FilesDropzoneUploadProps {
    dir: string;
}

const FilesUploaderDropzone = ({ dir }: FilesDropzoneUploadProps) => {
    const uploadFiles = useFileUploader();

    const [isDrag, setIsDrag] = useState(false);

    const dragCounter = useRef(0);

    useEffect(() => {
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
        };

        const handleDragEnter = (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current++;
            setIsDrag(true);
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current--;
            if (dragCounter.current === 0) {
                setIsDrag(false);
            }
        };

        const handleDrop = async (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current = 0;
            setIsDrag(false);

            if (e.dataTransfer?.files) {
                const files = [...e.dataTransfer.files];
                await uploadFiles({ dir, files });
            }
        };

        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('drop', handleDrop);
        };
    }, [uploadFiles, dir]);

    return (
        <>
            {isDrag && (
                <div className="absolute top-0 left-0 size-full p-2">
                    <div className="bg-primary/20 border-primary size-full rounded-lg border-2 border-dashed" />
                </div>
            )}
        </>
    );
};

export default FilesUploaderDropzone;
