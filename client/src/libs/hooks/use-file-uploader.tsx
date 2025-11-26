import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useUploadMutation } from '@/libs/api/files/hooks/use-upload-mutation';
import { filesStore } from '@/libs/store/files/files.store';

export const useFileUploader = () => {
    const { mutateAsync } = useUploadMutation();
    const tUploading = useTranslations('files.uploader');

    const setUploadedFile = filesStore(state => state.setUploadedFile);
    const removeUploadedFile = filesStore(state => state.removeUploadedFile);

    return async ({ dir, files }: { dir: string; files: File[] }) => {
        if (files) {
            for (const file of files) {
                setUploadedFile({
                    fileName: file.name,
                    fileSize: file.size,
                    fileLoaded: 0,
                    fileTotal: file.size,
                    isUploaded: false,
                    isNameError: false,
                    isSpaceError: false,
                    fileOnCancel: () => {},
                });
            }

            for (const file of files) {
                const controller = new AbortController();

                try {
                    await mutateAsync({
                        file: file,
                        idContext: dir,
                        onUploadProgress: progressEvent => {
                            setUploadedFile({
                                fileName: file.name,
                                fileSize: file.size,
                                fileLoaded: progressEvent.loaded,
                                fileTotal: progressEvent.total || file.size,
                                isUploaded: false,
                                isNameError: false,
                                isSpaceError: false,
                                fileOnCancel: () => {
                                    controller.abort();
                                },
                            });
                        },
                        abortController: controller,
                    });

                    setUploadedFile({
                        fileName: file.name,
                        fileSize: file.size,
                        fileLoaded: 100,
                        fileTotal: file.size,
                        isUploaded: true,
                        isNameError: false,
                        isSpaceError: false,
                        fileOnCancel: () => {},
                    });
                } catch (error: unknown) {
                    if ((error as Error).message === 'NAME_ALREADY_TAKEN') {
                        setUploadedFile({
                            fileName: file.name,
                            fileSize: file.size,
                            fileLoaded: 100,
                            fileTotal: file.size,
                            isUploaded: true,
                            isNameError: true,
                            isSpaceError: false,
                            fileOnCancel: () => {},
                        });
                    } else if (
                        (error as Error).message === 'NOT_ENOUGH_DISK_SPACE'
                    ) {
                        setUploadedFile({
                            fileName: file.name,
                            fileSize: file.size,
                            fileLoaded: 100,
                            fileTotal: file.size,
                            isUploaded: true,
                            isNameError: false,
                            isSpaceError: true,
                            fileOnCancel: () => {},
                        });
                    } else {
                        const response = (error as AxiosError).response;
                        removeUploadedFile({
                            fileName: file.name,
                        });
                        if (response?.data) {
                            toast.error(
                                `${tUploading('fileUploadingError')} ${file.name}`,
                            );
                        }
                    }
                }
            }
        }
    };
};
