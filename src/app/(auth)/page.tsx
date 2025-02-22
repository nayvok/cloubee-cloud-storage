import { redirect } from 'next/navigation';

import SignInForm from '@/components/features/auth/forms/sign-in-form';

export default async function SignInPage() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/is-admin-exist`,
        {
            cache: 'no-store',
        },
    );

    const data = await response.json();

    if (!data) {
        redirect('/register');
    }

    return <SignInForm />;
}
