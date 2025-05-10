'use client';

import { ReactNode, useEffect, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Ticker from '@/app/Components/Ticker';
import AppHeader from '@/components/Layout/AppHeader';
import AppSidebar from '@/components/Layout/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import socket from '@/lib/socketIo';
import { useGetDefinitions } from '@/queries';
import { useCurrencyStore } from '@/store/currencyStore';
import '@/styles/index.css';

function App({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState<boolean>(false);
    const { data } = useGetDefinitions();
    const { setFields, setDefinitions, setCurrency } = useCurrencyStore();

    function initSocket() {
        socket.connect();

        socket.on('connect', () => {
            setReady(true);
        });

        socket.on('currencyData', (data) => {
            if (data && data.length > 0) {
                setCurrency(data);
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }

    useEffect(() => {
        if (data?.data && !ready) {
            setDefinitions(data.data.definitions || []);
            setFields(data.data.fields || []);
            initSocket();
        }
    }, [data]);

    if (!ready) {
        return 'loading...';
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <div className="flex flex-1 flex-col mb-5 mx-4 lg:w-full lg:mx-auto lg:max-w-[800px] xl:max-w-[900px]">
                    <Ticker />
                    <Separator className="mb-4" />
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

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
    return (
        <html lang="en">
            <body>
                <QueryClientProvider client={queryClient}>
                    <App>{children}</App>
                </QueryClientProvider>
            </body>
        </html>
    );
}
