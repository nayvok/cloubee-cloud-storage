import { AlertTriangle, Cloud } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/common/card';
import { cn } from '@/utils/tw-merge';

interface AuthWrapperProps {
    title: string;
    description: string;
    errorMessage?: string | null;
    additionalButtonLabel?: string;
    additionalButtonHref?: string;
}

const AuthWrapper = ({
    children,
    title,
    description,
    errorMessage,
    additionalButtonLabel,
    additionalButtonHref,
}: PropsWithChildren<AuthWrapperProps>) => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center text-xl font-semibold"
                >
                    <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md">
                        <Cloud className="size-5" />
                    </div>
                    Cloubee
                </a>
                <div className={cn('flex flex-col gap-6')}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-center">
                                {description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {errorMessage && (
                                <div className="mb-6 flex flex-row items-center gap-4 rounded-lg bg-red-50 p-2 dark:bg-red-950">
                                    <AlertTriangle className="text-red-600 dark:text-red-400" />
                                    <span className="text-sm text-red-600 dark:text-red-400">
                                        {errorMessage}
                                    </span>
                                </div>
                            )}
                            {children}
                        </CardContent>
                        <CardFooter>
                            {additionalButtonLabel && additionalButtonHref && (
                                <Link
                                    href={additionalButtonHref}
                                    className="m-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    {additionalButtonLabel}
                                </Link>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AuthWrapper;
