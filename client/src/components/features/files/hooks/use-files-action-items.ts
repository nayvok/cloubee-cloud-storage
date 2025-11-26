import { Download, PencilLine, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ActionItem } from '@/libs/types/action-item.types';

interface UseFilesActionItemsProps {
    downloadAction: () => void;
    renameAction: () => void;
    deleteAction: () => void;
    isMultiple: boolean;
    isHaveDir: boolean;
}

const useFilesActionItems = ({
    downloadAction,
    renameAction,
    deleteAction,
    isMultiple,
    isHaveDir,
}: UseFilesActionItemsProps) => {
    const t = useTranslations('files.actions');

    const filesActionItems: ActionItem[] = [
        {
            icon: Download,
            label: t('download'),
            onClick: downloadAction,
            show: !isHaveDir,
        },
        {
            icon: PencilLine,
            label: t('rename'),
            onClick: renameAction,
            show: !isMultiple,
        },
        {
            icon: Trash2,
            label: t('delete'),
            onClick: deleteAction,
            show: true,
        },
    ];

    return filesActionItems.filter(item => item.show);
};

export default useFilesActionItems;
