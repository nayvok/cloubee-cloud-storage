import { Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import FilesViewModeToggle from '@/components/features/controls/files-view-mode-toggle';
import EmptyTrashForm from '@/components/features/trash/forms/empty-trash-form';
import { Button } from '@/components/ui/common/button';

const TrashHeaderPanel = () => {
    const t = useTranslations('trash.headerPanel');

    const [isEmptyTrashFormOpen, setIsEmptyTrashFormOpen] = useState(false);

    return (
        <div className="mx-4 flex gap-2">
            <Button
                variant="outline"
                onClick={() => setIsEmptyTrashFormOpen(true)}
            >
                <Flame />
                {t('clear')}
            </Button>

            <FilesViewModeToggle />

            {isEmptyTrashFormOpen && (
                <EmptyTrashForm
                    isOpen={isEmptyTrashFormOpen}
                    onClose={() => setIsEmptyTrashFormOpen(false)}
                    deleteAll={true}
                />
            )}
        </div>
    );
};

export default TrashHeaderPanel;
