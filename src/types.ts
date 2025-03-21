export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  closeButton?: boolean;
  progressBar?: boolean;
  className?: string;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  options: ToastOptions;
  icon?: string;
}