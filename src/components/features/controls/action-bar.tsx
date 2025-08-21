import { format } from 'date-fns';
import { CheckCircle, Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/common/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu';
import { useIsMobile } from '@/libs/hooks/use-mobile';
import { filesStore } from '@/libs/store/files/files.store';
import { ActionItem } from '@/libs/types/action-item.types';
import { convertBytes } from '@/libs/utils/convert-bytes';
import { cn } from '@/libs/utils/tw-merge';

interface ActionBarProps {
    actionItems: ActionItem[];
}

const ActionBar = ({ actionItems }: ActionBarProps) => {
    const t = useTranslations('layouts.header.actionBar');

    const isMobile = useIsMobile();

    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setLastSelectedFiles = filesStore(
        state => state.setLastSelectedFiles,
    );
    const setHeaderActionBarRef = filesStore(
        state => state.setHeaderActionBarRef,
    );
    const selectoRef = filesStore(state => state.selectoRef);

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
                    'bg-sidebar flex size-full items-center justify-between gap-2 rounded-lg border p-2 text-sm shadow-sm',
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
                                        onClick={() => {
                                            selectoRef.current?.setSelectedTargets(
                                                [],
                                            );
                                            setLastSelectedFiles(selectedFiles);
                                            setSelectedFiles([]);
                                        }}
                                    >
                                        <CheckCircle />
                                    </Button>
                                    <span>
                                        {`${t('info.selectedCount')} ${selectedFiles.length}`}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0"
                                            >
                                                <Info />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            side="bottom"
                                            align="start"
                                            sideOffset={4}
                                            className="flex max-w-[500px] flex-col p-2 text-sm"
                                        >
                                            <div>
                                                <span>{t('info.name')}</span>{' '}
                                                <span className="font-medium">
                                                    {selectedFiles[0].name}
                                                </span>
                                            </div>
                                            <span>
                                                <span>{t('info.size')}</span>{' '}
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
                                                <span>
                                                    {t('info.modified')}
                                                </span>{' '}
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

                                    <span className="line-clamp-1">
                                        {selectedFiles[0].name}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex">
                            {actionItems.map(item => (
                                <Button
                                    variant="ghost"
                                    key={item.label}
                                    onClick={item.onClick}
                                >
                                    <item.icon />
                                    {item.label}
                                </Button>
                            ))}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    selectoRef.current?.setSelectedTargets([]);
                                    setLastSelectedFiles(selectedFiles);
                                    setSelectedFiles([]);
                                }}
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

export default ActionBar;
