import { redirect } from 'next/navigation';

export default async function RegisterPage() {
    const hasAdmin = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/is-admin-exist`,
        {
            cache: 'no-store',
        },
    );

    if (!hasAdmin) {
        redirect('/');
    }

    return <div></div>;
}
