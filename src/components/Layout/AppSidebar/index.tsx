'use client';

import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import SidebarUser from '@/components/Layout/AppSidebar/Components/SidebarUser';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

function Logo() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-14">
                    <Link href="/" className="flex justify-center">
                        <span className="text-base font-semibold">
                            Currency Portfolio
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export default function AppSidebar() {
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>content</SidebarContent>
            <SidebarFooter>
                <SidebarUser />
            </SidebarFooter>
        </Sidebar>
    );
}
