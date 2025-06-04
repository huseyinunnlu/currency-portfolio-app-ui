'use client';

import { ReactNode, useEffect, useState } from 'react';
import Ticker from '@/app/(main)/_Components/Ticker';
import AppHeader from '@/components/Layout/AppHeader';
import AppSidebar from '@/components/Layout/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import '@/styles/index.css';
import { useGetDefinitions } from '@/queries';
import { useCurrencyStore } from '@/store/currencyStore';
import Spinner from '@/components/Shared/Spinner';
import socket from '@/lib/socketIo';
import { useAuthStore } from '@/store/authStore';

export default function Layout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const [ready, setReady] = useState<boolean>(false);
    const { data: response } = useGetDefinitions();
    const { setFields, setDefinitions, setCurrency } = useCurrencyStore();
    const { login } = useAuthStore();

    function initSocket() {
        if (socket.connected) {
            setReady(true);
        }
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
        if (response?.success && response.data && !ready) {
            setDefinitions(response.data.definitions || []);
            setFields(response.data.fields || []);
            initSocket();
        }
    }, [response]);

    if (!ready) {
        return <div className="w-screen h-screen flex items-center justify-center">
            <Spinner size={64} />
        </div>;
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
