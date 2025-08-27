import { EllipsisVertical, Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import FilesViewModeToggle from '@/components/features/controls/files-view-mode-toggle';
import EmptyTrashForm from '@/components/features/trash/forms/empty-trash-form';
import { Button } from '@/components/ui/common/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/common/drawer';

const TrashHeaderPanel = () => {
    const t = useTranslations('trash.headerPanel');

    const [isEmptyTrashFormOpen, setIsEmptyTrashFormOpen] = useState(false);

    return (
        <div className="mx-4 flex gap-2">
            <Button
                variant="outline"
                className="max-[576px]:hidden"
                onClick={() => setIsEmptyTrashFormOpen(true)}
            >
                <Flame />
                {t('clear')}
            </Button>

            <Button
                variant="ghost"
                className="!hidden max-[576px]:!flex"
                onClick={() => setIsEmptyTrashFormOpen(true)}
            >
                <Flame />
            </Button>

            <div className="max-[576px]:hidden">
                <FilesViewModeToggle isMobile={false} />
            </div>

            <div>
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="ghost">
                            <EllipsisVertical />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className="sr-only">
                            <DrawerTitle />
                            <DrawerDescription />
                        </DrawerHeader>

                        <div className="flex flex-col gap-4 p-4">
                            <div className="text-muted-foreground uppercase">
                                {t('view')}
                            </div>
                            <FilesViewModeToggle isMobile={true} />
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>

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
