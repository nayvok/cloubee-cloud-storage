'use client';

import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/common/button';
import { APP_ROUTES } from '@/libs/constants/routes';

interface ErrorPageProps {
    page: 'not-found' | 'service-unavailable';
}

const ErrorPage = ({ page }: ErrorPageProps) => {
    const t = useTranslations('errors_page');
    const router = useRouter();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <h1 className="text-primary block text-7xl font-bold sm:text-9xl">
                {page === 'not-found' ? '400' : '500'}
            </h1>
            <p className="text-muted-foreground mt-3">{t('description')}</p>

            <Button
                variant="secondary"
                size="lg"
                className="mt-5"
                onClick={() => router.push(APP_ROUTES.DASHBOARD.FILES.path)}
            >
                <ChevronLeft />
                {t('go_to_home')}
            </Button>
        </main>
    );
};

export default ErrorPage;
