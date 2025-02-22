import { redirect } from 'next/navigation';

import RegisterForm from '@/components/features/auth/forms/register-form';

export default async function RegisterPage() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/is-admin-exist`,
        {
            cache: 'no-store',
        },
    );

    const data = await response.json();

    if (data) {
        redirect('/');
    }

    return <RegisterForm />;
}
