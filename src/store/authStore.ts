import { create } from 'zustand';
import { setCookie, getCookie, removeCookie, decodeToken } from '@/lib/utils';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePic: string;
    iat: number;
    exp: number;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, redirectTo?: string) => void;
    logout: (redirectTo?: string) => void;
    checkAuth: () => boolean;
}

const AUTH_TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthState>((set, get) => ({
    token: typeof window !== 'undefined' ? getCookie(AUTH_TOKEN_KEY) : null,
    user: null,
    isAuthenticated: false,
    
    login: (token: string) => {
        try {
            // Decode token to get user information
            const decoded = decodeToken(token);
            if (!decoded) {
                throw new Error('Invalid token');
            }
            
            // Save token to cookie (365 days expiration)
            setCookie(AUTH_TOKEN_KEY, token, 365);
            
            // Update store state
            set({ 
                token,
                user: decoded,
                isAuthenticated: true 
            });
        } catch (error) {
            get().logout();
        }
    },
    
    logout: () => {
        // Remove token from cookie
        removeCookie(AUTH_TOKEN_KEY);
        
        // Clear store state
        set({ 
            token: null, 
            user: null, 
            isAuthenticated: false 
        });

        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },    
    checkAuth: () => {
        const { token } = get();
        
        if (!token) {
            return false;
        }
        
        try {
            const decoded = decodeToken(token);
            
            if (!decoded) {
                get().logout();
                return false;
            }
            
            return true;
        } catch (error) {
            get().logout();
            return false;
        }
    }
}));

