'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/common/button';
import { Progress } from '@/components/ui/common/progress';
import { filesStore } from '@/libs/store/files/files.store';
import { convertBytes } from '@/libs/utils/convert-bytes';
import { getFileIcon } from '@/libs/utils/get-file-icon';
import { cn } from '@/libs/utils/tw-merge';

export interface IUploadedFile {
    fileName: string;
    fileSize: number;
    fileLoaded: number;
    fileTotal: number;
    fileOnCancel: () => void;
    isUploaded: boolean;
    isNameError: boolean;
    isSpaceError: boolean;
}

const FileUploaderList = () => {
    const t = useTranslations('files.uploader');

    const uploadedFiles = filesStore(state => state.uploadedFiles);
    const removeUploadedFile = filesStore(state => state.removeUploadedFile);
    const clearUploadedFiles = filesStore(state => state.clearUploadedFiles);
    const collapsed = filesStore(state => state.isFileUploaderListCollapsed);
    const setCollapsed = filesStore(
        state => state.setIsFileUploaderListCollapsed,
    );

    return (
        <>
            {uploadedFiles && uploadedFiles.length >= 1 && (
                <div className="fixed right-0 bottom-0 z-20 pr-2">
                    <div className="bg-background w-[460px] overflow-hidden rounded-t-lg border border-b-0 shadow-lg">
                        <div className="inline-flex h-[56px] w-full items-center justify-between border-b-1 p-2">
                            <span>{t('listTitle')}</span>
                            <div className="inline-flex items-center">
                                <Button variant="ghost" onClick={setCollapsed}>
                                    {collapsed
                                        ? t('listCollapsedTrue')
                                        : t('listCollapsedFalse')}
                                </Button>

                                {uploadedFiles.every(
                                    file => file.isUploaded,
                                ) && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => clearUploadedFiles()}
                                    >
                                        <X />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div
                            className={cn(
                                'h-[304px] w-full overflow-hidden overflow-y-auto',
                                collapsed && 'h-0 overflow-hidden',
                            )}
                        >
                            {uploadedFiles.map(uploadedFile => {
                                const FileIcon = getFileIcon(
                                    null,
                                    uploadedFile.fileName,
                                    false,
                                );

                                return (
                                    <div
                                        key={uploadedFile.fileName}
                                        className="flex items-center gap-2 p-2 transition-all"
                                    >
                                        <div className="relative size-[36px]">
                                            <FileIcon
                                                className="size-full"
                                                strokeWidth={1}
                                            />

                                            {uploadedFile.isUploaded && (
                                                <span className="bg-gree absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full bg-green-600 p-px">
                                                    <Check className="size-full" />
                                                </span>
                                            )}

                                            {(uploadedFile.isNameError ||
                                                uploadedFile.isSpaceError) && (
                                                <span className="bg-gree absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full bg-red-600 p-px">
                                                    <X className="size-full" />
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 shrink-0 overflow-hidden pr-[10px]">
                                            <p className="text-foreground overflow-hidden text-sm text-nowrap overflow-ellipsis">
                                                {uploadedFile.fileName}
                                            </p>
                                            <p className="text-muted-foreground overflow-hidden text-xs overflow-ellipsis">
                                                {convertBytes(
                                                    uploadedFile.fileSize,
                                                )}
                                            </p>
                                        </div>

                                        {(uploadedFile.isNameError ||
                                            uploadedFile.isSpaceError) && (
                                            <>
                                                <span className="text-sm text-red-500">
                                                    {uploadedFile.isNameError &&
                                                        t('isNameError')}
                                                    {uploadedFile.isSpaceError &&
                                                        t('isSpaceError')}
                                                </span>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="shrink-0"
                                                    onClick={() => {
                                                        removeUploadedFile({
                                                            fileName:
                                                                uploadedFile.fileName,
                                                        });
                                                    }}
                                                >
                                                    <X />
                                                </Button>
                                            </>
                                        )}

                                        {!uploadedFile.isUploaded &&
                                            (!uploadedFile.isNameError ||
                                                !uploadedFile.isSpaceError) && (
                                                <>
                                                    <Progress
                                                        value={Math.round(
                                                            (uploadedFile.fileLoaded /
                                                                uploadedFile.fileTotal) *
                                                                100,
                                                        )}
                                                        className="max-w-[140px] shrink-0"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="shrink-0"
                                                        onClick={() => {
                                                            uploadedFile.fileOnCancel();
                                                        }}
                                                    >
                                                        <X />
                                                    </Button>
                                                </>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FileUploaderList;
