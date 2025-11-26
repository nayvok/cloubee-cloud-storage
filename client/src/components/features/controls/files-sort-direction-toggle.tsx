import { ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/common/button';
import { Label } from '@/components/ui/common/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/common/radio-group';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';
import { cn } from '@/libs/utils/tw-merge';

interface FilesSortDirectionToggleProps {
    isMobile: boolean;
}

const FilesSortDirectionToggle = ({
    isMobile,
}: FilesSortDirectionToggleProps) => {
    const t = useTranslations('files.filesSortDirectionToggle');

    const filesSortDirection = filesPersistStore(
        state => state.filesSortDirection,
    );

    const setFilesSortDirection = filesPersistStore(
        state => state.setFilesSortDirection,
    );

    if (isMobile) {
        return (
            <RadioGroup
                value={filesSortDirection}
                onValueChange={setFilesSortDirection}
            >
                <div
                    className={cn(
                        'flex items-center gap-3',
                        filesSortDirection !== 'asc' && 'text-muted-foreground',
                    )}
                >
                    <RadioGroupItem value="asc" id="r1" />
                    <Label htmlFor="r1">{t('asc')}</Label>
                </div>
                <div
                    className={cn(
                        'flex items-center gap-3',
                        filesSortDirection !== 'desc' &&
                            'text-muted-foreground',
                    )}
                >
                    <RadioGroupItem value="desc" id="r2" />
                    <Label htmlFor="r2">{t('desc')}</Label>
                </div>
            </RadioGroup>
        );
    }

    return (
        <Button variant="outline" size="icon" onClick={setFilesSortDirection}>
            <ListFilter
                strokeWidth={3}
                className={cn(
                    'text-foreground h-[1.2rem] w-[1.2rem] scale-100 rotate-180 transition-all',
                    filesSortDirection === 'desc' && 'scale-0',
                )}
            />
            <ListFilter
                strokeWidth={3}
                className={cn(
                    'absolute h-[1.2rem] w-[1.2rem] scale-100 transition-all',
                    filesSortDirection === 'asc' && 'scale-0',
                )}
            />
        </Button>
    );
};

export default FilesSortDirectionToggle;
