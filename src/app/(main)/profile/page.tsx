'use client'
import { Button } from '@/components/ui/button'
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/ui/tooltip'
import { useAuthStore } from '@/store/authStore'
import { PencilIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import EditModal from './_Components/EditModal'


export default function Profile() {
    const { user } = useAuthStore()
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false)
    const [selectedEditKey, setSelectedEditKey] = useState<string>('name')

    const profileDataList = useMemo(() => {
        return [
            {
                key: 'name',
                label: 'Full Name',
                value: `${user?.firstName} ${user?.lastName}`,
            },
            {
                key: 'email',
                label: 'Email',
                value: user?.email,
            }
        ]
    }, [user])

    const handleEdit = (key: string) => {
        setSelectedEditKey(key)
        setEditModalVisible(true)
    }
    return (
        <>
            <ul className='flex flex-col'>
                {profileDataList.map((item) => (
                    <li key={item.key} className='flex items-center gap-4 first:border-t-[1px] border-b-[1px] border-gray-200 py-4'>
                        <h3 className='font-bold'>{item.label}: </h3>
                        <p>{item.value}</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant='outline' size='icon' className="ml-auto" onClick={() => handleEdit(item.key)}>
                                        <PencilIcon className='size-4' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                ))}
            </ul>
            <EditModal open={editModalVisible} setOpen={setEditModalVisible} editDataKey={selectedEditKey} />
        </>
    )
}
