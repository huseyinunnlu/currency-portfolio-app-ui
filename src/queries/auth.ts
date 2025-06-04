import { useMutation } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/apiClient';
import { User } from '@/store/authStore';
import { getCookie } from '@/lib/utils';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
}


/**
 * Register a new user
 */
export const registerUser = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  return await apiClient.post<AuthResponse, RegisterData>('/auth/register', data);
};

/**
 * Login a user
 */
export const loginUser = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  return await apiClient.post<AuthResponse, LoginData>('/auth/login', data);
};

/**
 * Verify a JWT token
 */
export const verifyToken = async (token: string): Promise<ApiResponse<{user: User}>> => {
  return await apiClient.post<{user: User}, { token: string }>('/auth/verify-token', { token });
};

/**
 * Hook for user registration
 */
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

/**
 * Hook for user login
 */
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
