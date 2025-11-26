import { RotateCcw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ActionItem } from '@/libs/types/action-item.types';

interface UseTrashActionItemsProps {
    restoreAction: () => void;
    permanentDeleteAction: () => void;
}

const useTrashActionItems = ({
    restoreAction,
    permanentDeleteAction,
}: UseTrashActionItemsProps) => {
    const t = useTranslations('trash.actions');

    const trashActionItems: ActionItem[] = [
        {
            icon: RotateCcw,
            label: t('restore'),
            onClick: restoreAction,
            show: true,
        },
        {
            icon: Trash2,
            label: t('permanentDelete'),
            onClick: permanentDeleteAction,
            show: true,
        },
    ];

    return trashActionItems;
};

export default useTrashActionItems;
