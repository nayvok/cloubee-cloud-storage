import { format } from 'date-fns';
import { CheckCircle, Download, Info, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/common/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu';
import { useIsMobile } from '@/libs/hooks/use-mobile';
import { filesStore } from '@/libs/store/files/files.store';
import { convertBytes } from '@/libs/utils/convert-bytes';
import { cn } from '@/libs/utils/tw-merge';

const HeaderActionBar = () => {
    const isMobile = useIsMobile();

    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setHeaderActionBarRef = filesStore(
        state => state.setHeaderActionBarRef,
    );

    const actionBarRef = useRef<HTMLDivElement | null>(null);
    const [showHeaderElement, setShowHeaderElement] = useState(false);

    useEffect(() => {
        if (actionBarRef.current) {
            setHeaderActionBarRef(actionBarRef);
        }
    }, [actionBarRef, setHeaderActionBarRef]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (selectedFiles.length > 0) {
            timeoutId = setTimeout(() => {
                setShowHeaderElement(true);
            }, 250);
        } else {
            setShowHeaderElement(false);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [selectedFiles]);

    return (
        <div
            ref={actionBarRef}
            className={cn(
                'fixed right-0 z-1 h-16 w-full p-2 pl-[calc(var(--sidebar-width)+(var(--spacing)*2))]',
                'group-has-data-[collapsible=icon]/sidebar-wrapper:pl-[calc(var(--sidebar-width-icon)+(--spacing(4))+(var(--spacing)*2))]',
                'transition-all duration-200 ease-linear',
                showHeaderElement ? 'top-0' : '-top-full delay-300',
                isMobile && 'pl-2 duration-0',
            )}
        >
            <div
                className={cn(
                    'bg-background absolute top-0 left-0 h-4 w-full transition-all duration-300 ease-in-out',
                    showHeaderElement
                        ? 'translate-y-0 opacity-100 delay-100'
                        : '-translate-y-full opacity-0',
                )}
            />
            <div
                className={cn(
                    'bg-sidebar flex size-full items-center justify-between rounded-lg border p-2 text-sm shadow-sm',
                    'transition-all duration-300 ease-in-out',
                    showHeaderElement
                        ? 'translate-y-0 opacity-100 delay-100'
                        : '-translate-y-full opacity-0',
                )}
            >
                {selectedFiles && selectedFiles.length !== 0 && (
                    <>
                        <div className="inline-flex items-center gap-2">
                            {selectedFiles.length > 1 ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedFiles([])}
                                    >
                                        <CheckCircle />
                                    </Button>
                                    <span>Выбрано: {selectedFiles.length}</span>
                                </>
                            ) : (
                                <>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Info />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            side="bottom"
                                            align="start"
                                            sideOffset={4}
                                            className="flex flex-col p-2 text-sm"
                                        >
                                            <div>
                                                <span>Имя:</span>{' '}
                                                <span className="font-medium">
                                                    {selectedFiles[0].name}
                                                </span>
                                            </div>
                                            <span>
                                                <span>Размер:</span>{' '}
                                                <span className="font-medium">
                                                    {convertBytes(
                                                        Number(
                                                            selectedFiles[0]
                                                                .size,
                                                        ),
                                                    )}
                                                </span>
                                            </span>
                                            <span>
                                                <span>Изменён:</span>{' '}
                                                <span className="font-medium">
                                                    {format(
                                                        new Date(
                                                            selectedFiles[0].updatedAt,
                                                        ),
                                                        'dd.MM.yyyy',
                                                    )}{' '}
                                                    {format(
                                                        new Date(
                                                            selectedFiles[0].updatedAt,
                                                        ),
                                                        'HH:mm',
                                                    )}
                                                </span>
                                            </span>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <span>{selectedFiles[0].name}</span>
                                </>
                            )}
                        </div>
                        <div className="flex">
                            <Button variant="ghost">
                                <Download />
                                Скачать
                            </Button>
                            <Button variant="ghost">
                                <Trash2 />
                                Удалить
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedFiles([])}
                            >
                                <X />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HeaderActionBar;
