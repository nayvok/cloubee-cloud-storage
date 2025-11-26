'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { filesStore } from '@/libs/store/files/files.store';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();
    const uploadedFiles = filesStore(state => state.uploadedFiles);
    const isFileUploaderListCollapsed = filesStore(
        state => state.isFileUploaderListCollapsed,
    );

    const getSonnerOffset = () => {
        if (uploadedFiles && uploadedFiles.length >= 1) {
            if (isFileUploaderListCollapsed) {
                return '64px';
            } else {
                return '368px';
            }
        } else {
            return '8px';
        }
    };

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            offset={{
                bottom: getSonnerOffset(),
                right: '8px',
                left: '8px',
            }}
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
