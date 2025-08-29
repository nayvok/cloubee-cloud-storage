import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/common/popover';
import CircleCenteredLoader from '@/components/ui/elements/circle-centered-loader';
import BigPictureWrapper, {
    BigPictureGroupableButton,
} from '@/components/ui/elements/files/wrapper/big-picture-wrapper';
import { downloadQueryFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/constants/query-keys';
import { filesStore } from '@/libs/store/files/files.store';
import { convertBytes } from '@/libs/utils/convert-bytes';
import { getFileIcon } from '@/libs/utils/get-file-icon';

interface FilesBigPictureProps {
    files: IFileResponse[] | undefined;
}

const BigPictureImage = ({ fileId }: { fileId: string }) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    const { data, isPending } = useQuery({
        queryKey: [QUERY_KEYS.FULL_IMAGE, fileId],
        queryFn: () => downloadQueryFn([fileId]),
    });

    useEffect(() => {
        if (data) {
            const url = URL.createObjectURL(data);
            setBlobUrl(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [data]);

    return (
        <>
            {isPending ? (
                <CircleCenteredLoader />
            ) : (
                <>
                    {blobUrl && (
                        <Image
                            key={blobUrl}
                            src={blobUrl}
                            alt="Thumbnail"
                            width="0"
                            height="0"
                            unoptimized
                            draggable={false}
                            className="absolute m-auto size-full object-contain select-none"
                        />
                    )}
                </>
            )}
        </>
    );
};

const BigPictureFile = ({ file }: { file: IFileResponse }) => {
    const FileIcon = getFileIcon(file.mimeType, file.name, file.isDirectory);

    return (
        <div className="absolute top-0 left-0 flex size-full flex-col items-center justify-center gap-4 select-none">
            <div className="size-[145px]">
                <FileIcon strokeWidth={0.9} className="size-full" />
            </div>
            <span
                title={file.name}
                className="text-md text-center font-medium text-wrap break-words select-none"
            >
                {file.name}
            </span>
        </div>
    );
};

const FilesBigPicture = ({ files }: FilesBigPictureProps) => {
    const t = useTranslations('files.big_picture');

    const setIsOpenBigPicture = filesStore(state => state.setIsOpenBigPicture);
    const openedFile = filesStore(state => state.openedFile);
    const setOpenedFile = filesStore(state => state.setOpenedFile);

    const isImage = openedFile?.mimeType?.includes('image');

    const lastIndex = files ? files.length - 1 : 0;
    const currentIndex = files?.findIndex(i => i.id === openedFile?.id);

    const handleOnPrev = () => {
        if (currentIndex && currentIndex !== -1 && files) {
            const prevFile = files[currentIndex - 1];
            setOpenedFile(prevFile);
        }
    };

    const handleOnNext = () => {
        if (currentIndex !== -1 && files && currentIndex !== undefined) {
            const nextFile = files[currentIndex + 1];
            setOpenedFile(nextFile);
        }
    };

    return (
        <BigPictureWrapper
            onPrev={handleOnPrev}
            onNext={handleOnNext}
            onPrevDisabled={currentIndex === 0}
            onNextDisabled={currentIndex === lastIndex}
            onOpenChange={setIsOpenBigPicture}
            groupableButtons={
                <Popover>
                    <PopoverTrigger asChild>
                        <BigPictureGroupableButton>
                            <Info />
                        </BigPictureGroupableButton>
                    </PopoverTrigger>
                    <PopoverContent
                        side="bottom"
                        align="end"
                        className="z-[300] flex w-[320px] flex-col p-2 text-sm"
                    >
                        <div className="max-w-full overflow-hidden break-words">
                            <span>{t('info.name')}</span>{' '}
                            <span className="font-medium">
                                {openedFile?.name}
                            </span>
                        </div>
                        <div>
                            <span>{t('info.size')}</span>{' '}
                            <span className="font-medium">
                                {convertBytes(Number(openedFile?.size))}
                            </span>
                        </div>
                        <div>
                            <span>{t('info.modified')}</span>{' '}
                            <span className="font-medium">
                                {format(
                                    new Date(openedFile!.updatedAt),
                                    'dd.MM.yyyy',
                                )}{' '}
                                {format(
                                    new Date(openedFile!.updatedAt),
                                    'HH:mm',
                                )}
                            </span>
                        </div>
                    </PopoverContent>
                </Popover>
            }
        >
            {isImage ? (
                <BigPictureImage fileId={openedFile!.id} />
            ) : (
                <BigPictureFile file={openedFile!} />
            )}
        </BigPictureWrapper>
    );
};

export default FilesBigPicture;
