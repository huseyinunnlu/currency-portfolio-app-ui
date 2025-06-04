import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errorCode?: number;
}

export interface PaginatedResponse<T> {
    total: number;
    data: T;
    offset: number;
    limit: number;
}

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.initializeInterceptors();
    }

    private initializeInterceptors() {
        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                // Handle errors here (logging, etc.)
                return Promise.reject(error);
            }
        );
    }

    // Generic GET method
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiResponse<T>;
            }

            // Fallback error response
            throw {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                errorCode: 500000,
            };
        }
    }

    // Generic POST method
    async post<T, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.client.post(
                url,
                data,
                config
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiResponse<T>;
            }

            throw {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                errorCode: 500000,
            };
        }
    }

    // Generic PUT method
    async put<T, D = unknown>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.client.put(
                url,
                data,
                config
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiResponse<T>;
            }

            throw {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                errorCode: 500000,
            };
        }
    }

    // Generic DELETE method
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error.response.data as ApiResponse<T>;
            }

            throw {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                errorCode: 500000,
            };
        }
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
