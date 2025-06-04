import apiClient, { ApiResponse } from "@/lib/apiClient"
import { getCookie } from "@/lib/utils";
import { User } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query"


export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}


export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string; email?: string }): Promise<ApiResponse<{
      user: User,
      token: string
    }>> => {
      return apiClient.put('/auth/update-profile', data, {
        headers: {
          Authorization: `Bearer ${getCookie('auth_token')}`
        }
      })
    }
  })
}   

/**
 * Change user password
 */
export const changePassword = async (data: ChangePasswordData): Promise<ApiResponse<unknown>> => {
  return await apiClient.post<unknown, ChangePasswordData>('/auth/change-password', data, {
    headers: {
      Authorization: `Bearer ${getCookie('auth_token')}`
    }
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
}; 