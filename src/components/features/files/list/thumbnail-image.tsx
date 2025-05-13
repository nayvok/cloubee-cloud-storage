import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/common/skeleton';
import { useThumbnailQuery } from '@/libs/api/files/hooks/use-thumbnail-query';
import { type TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

interface ThumbnailImageProps {
    fileId: string;
    viewMode: TypeChangeFilesViewModeSchema['mode'];
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

    const { data, isLoading } = useThumbnailQuery({ fileId, size });
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            const url = URL.createObjectURL(data);
            setBlobUrl(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [data]);

    if (isLoading) {
        return <Skeleton className="size-full" />;
    }

    if (!blobUrl) return null;

    return (
        <Image
            key={blobUrl}
            src={blobUrl}
            alt="Thumbnail"
            width="0"
            height="0"
            unoptimized
            draggable={false}
            className="h-auto w-full"
        />
    );
};

export default ThumbnailImage;
