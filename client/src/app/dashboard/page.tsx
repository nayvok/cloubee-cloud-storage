import { redirect } from 'next/navigation';

import { APP_ROUTES } from '@/libs/constants/routes';

export default async function Page() {
    return redirect(APP_ROUTES.DASHBOARD.FILES.path);
}
