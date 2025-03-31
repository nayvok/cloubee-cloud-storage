import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useThumbnailQuery } from '@/libs/api/files/hooks/use-thumbnail-query';
import { TypeChangeFilesViewModSchema } from '@/schemas/files/change-files-view-mode.schema';

interface ThumbnailImageProps {
    fileId: string;
    viewMode: TypeChangeFilesViewModSchema['mode'];
}

const ThumbnailImage = ({ fileId, viewMode }: ThumbnailImageProps) => {
    let size: 'small' | 'medium' | 'large';

    switch (viewMode) {
        case 'tile':
            size = 'medium';
            break;
        case 'largeTile':
            size = 'large';
            break;
        case 'list':
            size = 'small';
    }

    const { data, isLoading } = useThumbnailQuery({ fileId, size: size });
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            const url = URL.createObjectURL(data);
            setBlobUrl(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="h-[120px] w-[120px] animate-pulse bg-gray-200">
                Loading...
            </div>
        );
    }

    if (!blobUrl) return null;

    return (
        <Image
            key={blobUrl}
            src={blobUrl}
            alt="Thumbnail"
            width="0"
            height="0"
            className="h-auto w-full"
            unoptimized
        />
    );
};

export default ThumbnailImage;
