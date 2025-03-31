'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

const QueryProvider = ({ children }: { children: ReactNode }) => {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    staleTime: 5 * 60 * 1000,
                },
            },
        }),
    );

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default QueryProvider;
