import { useTranslations } from 'next-intl';
import { Fragment, ReactNode } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/common/breadcrumb';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/common/dialog';
import CircleCenteredLoader from '@/components/ui/elements/circle-centered-loader';
import FileSimpleCard from '@/components/ui/elements/files/file-simple-card';
import { IFileResponse } from '@/libs/api/files/files.types';

interface FileExplorerModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    isLoading: boolean;
    files: IFileResponse[] | undefined;
    actionsRender: ReactNode;
    idContext: string;
    setIdContext: (isContext: string) => void;
}

const FilesExplorerModal = ({
    isOpen,
    onClose,
    title,
    description,
    isLoading,
    files,
    actionsRender,
    idContext,
    setIdContext,
}: FileExplorerModalProps) => {
    const t = useTranslations('files.explorer_dialog');
    const breadcrumbs = idContext.split('/');

    const renderBreadcrumb = (breadcrumb: string, index: number) => {
        if (index === 0) {
            if (breadcrumbs.length === 1) {
                return <BreadcrumbPage>{t('files')}</BreadcrumbPage>;
            }

            return (
                <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => setIdContext('')}
                >
                    {t('files')}
                </BreadcrumbLink>
            );
        } else {
            if (index === breadcrumbs.length - 1) {
                return <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>;
            }

            return (
                <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() =>
                        setIdContext(breadcrumbs.slice(0, index + 1).join('/'))
                    }
                >
                    {breadcrumb}
                </BreadcrumbLink>
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <Fragment key={`${breadcrumb}-${index}`}>
                                <BreadcrumbItem>
                                    {renderBreadcrumb(breadcrumb, index)}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && (
                                    <BreadcrumbSeparator />
                                )}
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="h-[300px] overflow-y-auto">
                    {isLoading ? (
                        <CircleCenteredLoader />
                    ) : (
                        <>
                            {files?.length === 0 ? (
                                <div className="text-sidebar-foreground/80 flex size-full items-center justify-center">
                                    Пустая папка
                                </div>
                            ) : (
                                <>
                                    {files?.map(file => (
                                        <FileSimpleCard
                                            key={file.id}
                                            file={file}
                                            onDoubleClick={() => {
                                                setIdContext(
                                                    idContext + '/' + file.name,
                                                );
                                            }}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>{actionsRender}</DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FilesExplorerModal;
