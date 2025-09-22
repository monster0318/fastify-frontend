import { useCallback } from 'react';
import { toastService } from '@/lib/toast';

export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    toastService.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toastService.error(message);
  }, []);

  const showWarning = useCallback((message: string) => {
    toastService.warning(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toastService.info(message);
  }, []);

  const clearAll = useCallback(() => {
    toastService.clear();
  }, []);

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    clear: clearAll,
  };
};
