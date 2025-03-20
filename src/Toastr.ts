import { Toast, ToastOptions, ToastType } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Singleton class to manage toast notifications display
 * @class Toastr
 */
export class Toastr {
  private static instance: Toastr;
  private toasts: Toast[] = [];
  private container: HTMLElement | null = null;

  /**
   * Private constructor for Singleton pattern
   * @private
   */
  private constructor() {
    this.createContainer();
  }

  /**
   * Gets the unique instance of Toastr
   * @returns {Toastr} The unique instance of Toastr
   */
  public static getInstance(): Toastr {
    if (!Toastr.instance) {
      Toastr.instance = new Toastr();
    }
    return Toastr.instance;
  }

  /**
   * Gets the ID of the last displayed toast
   * @returns {string | null} The ID of the last toast or null if no toast is displayed
   */
  public getCurrentToastId(): string | null {
    if (this.toasts.length === 0) {
      return null;
    }
    return this.toasts[this.toasts.length - 1].id;
  }

  /**
   * Displays a new toast
   * @param {Omit<Toast, 'id' | 'options'>} toastParams - The toast parameters (title, description, icon, type)
   * @param {ToastOptions} options - The toast configuration options
   */
  public show(toastParams: Omit<Toast, 'id' | 'options'>, options: ToastOptions = {}): void {
    const toast: Toast = {
      id: uuidv4(),
      ...toastParams,
      options: {
        duration: 3000,
        position: 'top-right',
        closeButton: true,
        progressBar: true,
        ...options,
      },
    };

    this.toasts.push(toast);
    this.updateContainerPosition(toast.options.position);
    this.renderToast(toast);
  }

  /**
   * Removes a specific toast
   * @param {string} id - The ID of the toast to remove
   */
  public remove(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.removeToast(id);
  }

  /**
   * Creates the main toast container
   * @private
   */
  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.className = 'toastr-container';
    document.body.appendChild(this.container);
  }

  /**
   * Updates the position of the toast container
   * @param {ToastOptions['position']} position - The new position
   * @private
   */
  private updateContainerPosition(position: ToastOptions['position'] = 'top-right'): void {
    if (!this.container) return;

    // Remove all existing position classes
    this.container.classList.remove(
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
      'top-center',
      'bottom-center',
    );

    // Add the new position class
    this.container.classList.add(position);
  }

  /**
   * Displays a toast in the DOM
   * @param {Toast} toast - The toast object to display
   * @private
   */
  private renderToast(toast: Toast): void {
    if (!this.container) return;

    const toastElement = document.createElement('div');
    toastElement.className = `toastr toastr-${toast.type} ${toast.options.className || ''}`;
    toastElement.setAttribute('data-toast-id', toast.id);
    toastElement.innerHTML = `
      <div class="toastr-content">
        <p class="toastr-title">
          ${toast.icon ? `<i class="${toast.icon}"></i>` : ''}
          ${toast.title}
        </p>
        ${toast.description ? `<p class="toastr-description">${toast.description}</p>` : ''}
      </div>
      ${toast.options.closeButton ? '<button class="toastr-close">&times;</button>' : ''}
      ${toast.options.progressBar ? '<div class="toastr-progress"></div>' : ''}
    `;

    this.container.appendChild(toastElement);

    if (toast.options.duration) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.options.duration);
    }

    const closeButton = toastElement.querySelector('.toastr-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.removeToast(toast.id);
      });
    }
  }

  /**
   * Removes a toast from the DOM
   * @param {string} id - The ID of the toast to remove
   * @private
   */
  private removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    const toastElement = this.container?.querySelector(`[data-toast-id="${id}"]`);
    if (toastElement) {
      toastElement.remove();
    }
  }
}