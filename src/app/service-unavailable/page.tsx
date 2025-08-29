import ErrorPage from '@/components/errors/error-page';

export default async function Page() {
    return <ErrorPage page="service-unavailable" />;
}
