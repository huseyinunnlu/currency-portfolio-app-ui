'use client'
import { ReactNode, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const profileTabs = [
    {
        value: 'overview',
        label: 'Overview',
        href: '/profile',
    },
    {
        value: 'change-password',
        label: 'Change Password',
        href: '/profile/change-password',
    },
]

export default function Layout({ children }: { children: ReactNode }) {
    const { user } = useAuthStore()
    const pathname = usePathname()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<string>(
        profileTabs.find(tab => tab.href === pathname)?.value || profileTabs[0].value
    )
    return (
        <div className="flex flex-col gap-y-4 w-full">
            <Card>
                <CardContent className='flex items-center justify-center flex-col'>
                    <Avatar className='size-20 border-2 border-primary'>
                        <AvatarImage src={user?.profilePic} />
                    </Avatar>
                    <h3 className='text-2xl font-semibold mt-2'>{user?.firstName} {user?.lastName}</h3>
                </CardContent>
            </Card>
            <Tabs
                className="w-full border-b-[1px] border-b-gray-200"
                value={activeTab}
                onValueChange={(value) => {
                    setActiveTab(value);
                    router.push(profileTabs.find(tab => tab.value === value)?.href || '/profile');
                }}
            >
                <TabsList variant="line">
                    {profileTabs.map((tab) => (
                        <TabsTrigger
                            variant='line'
                            key={tab.value}
                            value={tab.value}
                            className="w-auto h-full"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className=" w-full mx-auto max-w-full md:max-w-3/4 mt-4">
                {children}
            </div>
        </div>
    )
}
