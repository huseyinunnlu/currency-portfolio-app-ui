'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
import { useLoginUser } from '@/queries/auth';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

// Define the form schema with zod
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Please enter your password'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { mutateAsync, isPending } = useLoginUser();
    const { login } = useAuthStore();

    // Initialize the form with react-hook-form and zod validation
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@admin.com',
            password: 'Test12..',
        },
    });

    // Form submission handler
    const onSubmit = async (data: LoginFormValues) => {
        const response = await mutateAsync(data);
        if (response.success && response.data?.token) {
            login(response.data.token);
            toast.success('Logged in successfully');
            router.push('/');
        } else {
            toast.error(response.message || 'Failed to login');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Login to your account</h1>
                <p className="mt-2 text-muted-foreground">
                    Enter your credentials below to login
                </p>
            </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Log in'
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Create an account
                </Link>
            </div>
        </div>
    );
}
