import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { downloadQueryFn } from '@/libs/api/files/files-api';
import { filesStore } from '@/libs/store/files/files.store';
import { downloadBlob } from '@/libs/utils/download-blob';

export const useFileDownloader = () => {
    const t = useTranslations('files.download');
    const lastSelectedFiles = filesStore(state => state.lastSelectedFiles);

    return async () => {
        const toastId = toast.loading(t('inProgress'));

        const formattedDate = new Date()
            .toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .slice(0, 19);

        try {
            const blob = await downloadQueryFn(
                lastSelectedFiles.map(file => file.id),
            );

            if (lastSelectedFiles.length > 1) {
                downloadBlob(blob, `archive-${formattedDate}.zip`);
            } else {
                downloadBlob(blob, lastSelectedFiles[0].name);
            }

            toast.success(t('success'), { id: toastId });
        } catch {
            toast.error(t('error'), { id: toastId });
        }
    };
};
