'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useAuthStore } from '@/store/authStore'
import { useUpdateProfile } from '@/queries/profile'
import { toast } from 'sonner'
import { getCookie } from '@/lib/utils'
interface EditModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    editDataKey: string
}

interface NameEditFormTypes {
    firstName: string
    lastName: string
}

interface EmailEditFormTypes {
    email: string
}

const editFormTextsByKey: Record<string, { title: string, description: string }> = {
    name: {
        title: 'Edit first and last name',
        description: 'Enter your first and last name',
    },
    email: {
        title: 'Edit email',
        description: 'Enter your email',
    },
}

const renderEditForm = (editDataKey: string, setOpen: (open: boolean) => void) => {
    switch (editDataKey) {
        case 'name':
            return <NameEditForm setOpen={setOpen} />
        case 'email':
            return <EmailEditForm setOpen={setOpen} />
        default:
            return null
    }
}

function NameEditForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const { user, login } = useAuthStore()
    const updateProfileMutation = useUpdateProfile()
    const form = useForm<NameEditFormTypes>({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || ''
        },
        resolver: zodResolver(
            z.object({
                firstName: z.string().min(2, "First name must be at least 2 characters").max(255, "First name must be less than 255 characters"),
                lastName: z.string().min(2, "Last name must be at least 2 characters").max(255, "Last name must be less than 255 characters")
            })
        ),
    });

    const submit = async (data: NameEditFormTypes) => {
        try {
            const response = await updateProfileMutation.mutateAsync({
                firstName: data.firstName,
                lastName: data.lastName
            })

            if (response.success) {
                toast.success('Profile updated successfully')
                login(response.data?.token || "")
                setOpen(false)
            } else {
                toast.error(response.message || 'Failed to update profile')
            }
        } catch (error) {
            toast.error('An error occurred while updating your profile')
            console.error(error)
        }
    }

    return (
        <Form {...form}>

            <form className="space-y-4" id="edit-form" onSubmit={form.handleSubmit(submit)}>
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

function EmailEditForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const { user, login } = useAuthStore()
    const updateProfileMutation = useUpdateProfile()
    const form = useForm<EmailEditFormTypes>({
        defaultValues: {
            email: user?.email || '',
        },
        resolver: zodResolver(
            z.object({
                email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
            })
        ),
    });

    const submit = async (data: EmailEditFormTypes) => {
        try {
            const response = await updateProfileMutation.mutateAsync({
                email: data.email
            })

            if (response.success) {
                toast.success('Profile updated successfully')
                login(response.data?.token || "")
                setOpen(false)
            } else {
                toast.error(response.message || 'Failed to update profile')
            }
        } catch (error) {
            toast.error('An error occurred while updating your profile')
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" id="edit-form" onSubmit={form.handleSubmit(submit)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email address" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default function EditModal({ open, setOpen, editDataKey }: EditModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editFormTextsByKey[editDataKey].title}</DialogTitle>
                    <DialogDescription>
                        {editFormTextsByKey[editDataKey].description}
                    </DialogDescription>
                </DialogHeader>
                {renderEditForm(editDataKey, setOpen)}
                <DialogFooter>
                    <Button form="edit-form" type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

