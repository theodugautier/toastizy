import { Toast, ToastOptions, ToastType } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Classe singleton pour gérer l'affichage des notifications toast
 * @class Toastr
 */
export class Toastr {
  private static instance: Toastr;
  private toasts: Toast[] = [];
  private container: HTMLElement | null = null;

  /**
   * Constructeur privé pour le pattern Singleton
   * @private
   */
  private constructor() {
    this.createContainer();
  }

  /**
   * Obtient l'instance unique de Toastr
   * @returns {Toastr} L'instance unique de Toastr
   */
  public static getInstance(): Toastr {
    if (!Toastr.instance) {
      Toastr.instance = new Toastr();
    }
    return Toastr.instance;
  }

  /**
   * Récupère l'ID du dernier toast affiché
   * @returns {string | null} L'ID du dernier toast ou null si aucun toast n'est affiché
   */
  public getCurrentToastId(): string | null {
    if (this.toasts.length === 0) {
      return null;
    }
    return this.toasts[this.toasts.length - 1].id;
  }

  /**
   * Affiche un nouveau toast
   * @param {string} message - Le message à afficher
   * @param {ToastType} type - Le type de toast (info, success, warning, error)
   * @param {ToastOptions} options - Les options de configuration du toast
   */
  public show(message: string, type: ToastType = 'info', options: ToastOptions = {}): void {
    const toast: Toast = {
      id: uuidv4(),
      message,
      type,
      options: {
        duration: 3000,
        position: 'top-right',
        closeButton: true,
        progressBar: true,
        ...options
      }
    };

    this.toasts.push(toast);
    this.updateContainerPosition(toast.options.position);
    this.renderToast(toast);
  }

  /**
   * Supprime un toast spécifique
   * @param {string} id - L'ID du toast à supprimer
   */
  public remove(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.removeToast(id);
  }

  /**
   * Crée le conteneur principal des toasts
   * @private
   */
  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.className = 'toastr-container';
    document.body.appendChild(this.container);
  }

  /**
   * Met à jour la position du conteneur des toasts
   * @param {ToastOptions['position']} position - La nouvelle position
   * @private
   */
  private updateContainerPosition(position: ToastOptions['position'] = 'top-right'): void {
    if (!this.container) return;

    // Supprimer toutes les classes de position existantes
    this.container.classList.remove(
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
      'top-center',
      'bottom-center'
    );

    // Ajouter la nouvelle classe de position
    this.container.classList.add(position);
  }

  /**
   * Affiche un toast dans le DOM
   * @param {Toast} toast - L'objet toast à afficher
   * @private
   */
  private renderToast(toast: Toast): void {
    if (!this.container) return;

    const toastElement = document.createElement('div');
    toastElement.className = `toastr toastr-${toast.type} ${toast.options.className || ''}`;
    toastElement.setAttribute('data-toast-id', toast.id);
    toastElement.innerHTML = `
      <div class="toastr-content">${toast.message}</div>
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
   * Supprime un toast du DOM
   * @param {string} id - L'ID du toast à supprimer
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