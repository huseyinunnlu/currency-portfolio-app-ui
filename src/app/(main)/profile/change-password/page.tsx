'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useChangePassword } from '@/queries/profile';

// Define the form schema with zod
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters')
        .max(100, 'New password must be less than 100 characters'),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { mutateAsync, isPending } = useChangePassword();

    // Initialize the form with react-hook-form and zod validation
    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    // Form submission handler
    const onSubmit = async (data: ChangePasswordFormValues) => {
        try {
            const response = await mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (response.success) {
                toast.success('Password changed successfully');
                form.reset();
            } else {
                toast.error(response.message || 'Failed to change password');
            }
        } catch (error) {
            toast.error('An error occurred while changing your password');
            console.error(error);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
                <p className="mt-2 text-muted-foreground">
                    Update your password to keep your account secure
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            placeholder="Enter your current password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-muted-foreground"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="Enter your new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-muted-foreground"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm your new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-muted-foreground"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating Password...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
