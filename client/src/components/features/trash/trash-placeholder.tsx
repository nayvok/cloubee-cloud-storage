import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const TrashPlaceholder = () => {
    const t = useTranslations('trash');

    return (
        <div className="text-sidebar-foreground/80 flex size-full flex-col items-center justify-center gap-2">
            <Trash2 className="size-16" strokeWidth={1} />
            <span>{t('placeholder')}</span>
        </div>
    );
};

export default TrashPlaceholder;
