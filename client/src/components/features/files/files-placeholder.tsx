import { Files } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FilesPlaceholder = () => {
    const t = useTranslations('files.placeholder');

    return (
        <div className="text-sidebar-foreground/80 flex size-full flex-col items-center justify-center gap-2">
            <Files className="size-16" strokeWidth={1} />
            <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg">{t('title')}</h3>
                <span>{t('description')}</span>
            </div>
        </div>
    );
};

export default FilesPlaceholder;
