'use client';

import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles/index.css';
import { Toaster } from 'sonner';
import { getCookie } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const { login } = useAuthStore();

    useEffect(() => {
        const token = getCookie('auth_token')
        if (token) {
            login(token)
        }
    }, [])

    return (
        <html lang="en">
            <body>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
                <Toaster />
            </body>
        </html >
    );
}
