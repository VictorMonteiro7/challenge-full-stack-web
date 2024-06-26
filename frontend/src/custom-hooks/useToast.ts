import { toast } from 'react-toastify';

export const useToast = () => {
  const toastConfig = {
    autoClose: 3000,
    pauseOnHover: false,
    draggable: true,
  };
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        toast.success(message, toastConfig);
        break;
      case 'error':
        toast.error(message, toastConfig);
        break;
      case 'warning':
        toast.warning(message, toastConfig);
        break;
      default:
        break;
    }
  };

  return { showToast };
};
