import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';

import FilesSortDirectionToggle from '@/components/features/controls/files-sort-direction-toggle';
import FilesSortModeToggle from '@/components/features/controls/files-sort-mode-toggle';
import FilesViewModeToggle from '@/components/features/controls/files-view-mode-toggle';
import { Button } from '@/components/ui/common/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/common/drawer';
import { Separator } from '@/components/ui/common/separator';

const FilesHeaderPanel = () => {
    const t = useTranslations('files.headerPanel');

    return (
        <>
            <div className="mx-4 flex gap-2 max-[576px]:hidden">
                <FilesSortDirectionToggle isMobile={false} />

                <FilesSortModeToggle isMobile={false} />

                <FilesViewModeToggle isMobile={false} />
            </div>

            <div className="mx-4 hidden gap-2 max-[576px]:flex">
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

                        <Separator />

                        <div className="flex flex-col gap-4 p-4">
                            <div className="text-muted-foreground uppercase">
                                {t('sort')}
                            </div>
                            <FilesSortModeToggle isMobile={true} />
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-4 p-4">
                            <FilesSortDirectionToggle isMobile={true} />
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    );
};

export default FilesHeaderPanel;
