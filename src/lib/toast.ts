import { toast, ToastOptions } from 'react-toastify';
import { AxiosError } from 'axios';

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  error?: string;
}

export type ApiError = AxiosError;

class ToastService {
  private defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Success notifications
  success(message: string, options?: ToastOptions) {
    toast.success(message, { ...this.defaultOptions, ...options });
  }

  // Error notifications
  error(message: string, options?: ToastOptions) {
    toast.error(message, { ...this.defaultOptions, ...options });
  }

  // Warning notifications
  warning(message: string, options?: ToastOptions) {
    toast.warning(message, { ...this.defaultOptions, ...options });
  }

  // Info notifications
  info(message: string, options?: ToastOptions) {
    toast.info(message, { ...this.defaultOptions, ...options });
  }

  // Handle API responses
  handleApiResponse(response: ApiResponse, successMessage?: string) {
    if (response.success !== false) {
      const message = successMessage || response.message || 'Operation completed successfully';
      this.success(message);
    } else {
      const message = response.error || response.message || 'An error occurred';
      this.error(message);
    }
  }

  // Handle API errors
  handleApiError(error: ApiError, defaultMessage?: string) {
    let message = defaultMessage || 'An error occurred';
    
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as Record<string, unknown>;
      if (typeof data.message === 'string') {
        message = data.message;
      } else if (typeof data.error === 'string') {
        message = data.error;
      } else if (Array.isArray(data.errors)) {
        message = data.errors.join(', ');
      }
    } else if (error.message) {
      message = error.message;
    }

    // Handle specific HTTP status codes
    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          message = 'Authentication required. Please log in again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 422:
          if (error.response.data && typeof error.response.data === 'object') {
            const data = error.response.data as Record<string, unknown>;
            message = typeof data.message === 'string' ? data.message : 'Validation error occurred.';
          } else {
            message = 'Validation error occurred.';
          }
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          // Keep the original message for other status codes
          break;
      }
    }

    this.error(message);
  }

  // Handle file upload responses
  handleFileUploadResponse(response: ApiResponse, fileName?: string) {
    if (response.success !== false) {
      const message = fileName 
        ? `File "${fileName}" uploaded successfully`
        : 'File uploaded successfully';
      this.success(message);
    } else {
      const message = response.error || 'File upload failed';
      this.error(message);
    }
  }

  // Handle authentication responses
  handleAuthResponse(response: ApiResponse, isLogin: boolean = true) {
    if (response.success !== false) {
      const message = isLogin ? 'Login successful!' : 'Registration successful!';
      this.success(message);
    } else {
      const message = response.error || (isLogin ? 'Login failed' : 'Registration failed');
      this.error(message);
    }
  }

  // Handle KYC verification
  handleKycResponse(response: ApiResponse) {
    if (response.success !== false) {
      this.success('KYC verification completed successfully!');
    } else {
      this.error(response.error || 'KYC verification failed');
    }
  }

  // Clear all toasts
  clear() {
    toast.dismiss();
  }
}

// Export singleton instance
export const toastService = new ToastService();

// Export individual methods for convenience
export const {
  success,
  error,
  warning,
  info,
  handleApiResponse,
  handleApiError,
  handleFileUploadResponse,
  handleAuthResponse,
  handleKycResponse,
  clear,
} = toastService;
