import { Toastr } from '../Toastr';

interface ToastrWithInstance extends Toastr {
  instance: Toastr | null;
}

describe('Toastr', () => {
  let toastr: Toastr;

  beforeEach(() => {
    // Reset singleton instance
    (Toastr as unknown as ToastrWithInstance).instance = null;
    toastr = Toastr.getInstance();
    // Reset timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
    // Reset singleton instance
    (Toastr as unknown as ToastrWithInstance).instance = null;
    // Restore timers
    jest.useRealTimers();
  });

  it('should create a singleton instance', () => {
    const instance1 = Toastr.getInstance();
    const instance2 = Toastr.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should create container element', () => {
    const container = document.querySelector('.toastizy-container');
    expect(container).toBeTruthy();
  });

  it('should show a toast message', () => {
    toastr.show({ title: 'Test title', description: 'Test description', type: 'success' });
    const toast = document.querySelector('.toastizy');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Test title');
    expect(toast?.textContent).toContain('Test description');
  });

  it('should add hide class before removing toast', () => {
    toastr.show({ title: 'Test title', type: 'success' });
    const toast = document.querySelector('.toastizy');
    const toastId = toast?.getAttribute('data-toast-id');

    expect(toast).toBeTruthy();
    expect(toastId).toBeTruthy();

    toastr.remove(toastId!);

    // Vérifier que la classe hide est ajoutée
    expect(toast?.classList.contains('toastizy-hide')).toBeTruthy();

    // Avancer le temps de 300ms (durée de l'animation)
    jest.advanceTimersByTime(300);

    // Vérifier que le toast est supprimé
    const removedToast = document.querySelector('.toastizy');
    expect(removedToast).toBeFalsy();
  });

  it('should remove multiple toasts with animation', () => {
    toastr.show({ title: 'Message 1', type: 'success' });
    toastr.show({ title: 'Message 2', type: 'success' });

    const toasts = document.querySelectorAll('.toastizy');
    expect(toasts.length).toBe(2);

    const firstToastId = toasts[0].getAttribute('data-toast-id');
    toastr.remove(firstToastId!);

    // Vérifier que la classe hide est ajoutée au premier toast
    expect(toasts[0].classList.contains('toastizy-hide')).toBeTruthy();

    // Avancer le temps de 300ms
    jest.advanceTimersByTime(300);

    const remainingToasts = document.querySelectorAll('.toastizy');
    expect(remainingToasts.length).toBe(1);
  });

  it('should auto-remove toast after duration', () => {
    toastr.show({ title: 'Auto remove', type: 'success' }, { duration: 2000 });
    const toast = document.querySelector('.toastizy');
    expect(toast).toBeTruthy();

    // Avancer le temps de 2000ms (durée du toast)
    jest.advanceTimersByTime(2000);

    // Vérifier que la classe hide est ajoutée
    expect(toast?.classList.contains('toastizy-hide')).toBeTruthy();

    // Avancer le temps de 300ms (durée de l'animation)
    jest.advanceTimersByTime(300);

    const removedToast = document.querySelector('.toastizy');
    expect(removedToast).toBeFalsy();
  });

  describe('getCurrentToastId', () => {
    it('should return null when no toasts are active', () => {
      expect(toastr.getCurrentToastId()).toBeNull();
    });

    it('should return the ID of the last toast', () => {
      toastr.show({ title: 'Toast 1', type: 'success' });
      toastr.show({ title: 'Toast 2', type: 'info' });

      const lastToastId = toastr.getCurrentToastId();
      const lastToast = document.querySelector(`[data-toast-id="${lastToastId}"]`);

      expect(lastToastId).toBeTruthy();
      expect(lastToast?.textContent).toContain('Toast 2');
    });
  });

  describe('hasActiveToasts', () => {
    it('should return false when no toasts are active', () => {
      expect(toastr.hasActiveToasts()).toBe(false);
    });

    it('should return true when toasts are active', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      expect(toastr.hasActiveToasts()).toBe(true);
    });

    it('should return false after all toasts are removed', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      const toastId = toastr.getCurrentToastId();

      toastr.remove(toastId!);
      jest.advanceTimersByTime(300);

      expect(toastr.hasActiveToasts()).toBe(false);
    });
  });

  describe('getActiveToastsCount', () => {
    it('should return 0 when no toasts are active', () => {
      expect(toastr.getActiveToastsCount()).toBe(0);
    });

    it('should return correct count when toasts are active', () => {
      toastr.show({ title: 'Toast 1', type: 'success' });
      expect(toastr.getActiveToastsCount()).toBe(1);

      toastr.show({ title: 'Toast 2', type: 'info' });
      expect(toastr.getActiveToastsCount()).toBe(2);

      toastr.show({ title: 'Toast 3', type: 'warning' });
      expect(toastr.getActiveToastsCount()).toBe(3);
    });

    it('should decrease count when toasts are removed', () => {
      toastr.show({ title: 'Toast 1', type: 'success' });
      toastr.show({ title: 'Toast 2', type: 'info' });

      expect(toastr.getActiveToastsCount()).toBe(2);

      const toastId = toastr.getCurrentToastId();
      toastr.remove(toastId!);
      jest.advanceTimersByTime(300);

      expect(toastr.getActiveToastsCount()).toBe(1);
    });
  });

  describe('Container visibility', () => {
    it('should hide container when no toasts are active', () => {
      const container = document.querySelector('.toastizy-container') as HTMLElement;
      expect(container.style.display).toBe('none');
    });

    it('should show container when toasts are added', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      const container = document.querySelector('.toastizy-container') as HTMLElement;
      expect(container.style.display).toBe('block');
    });

    it('should hide container after all toasts are removed', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      const container = document.querySelector('.toastizy-container') as HTMLElement;
      const toastId = toastr.getCurrentToastId();

      toastr.remove(toastId!);
      jest.advanceTimersByTime(300);

      expect(container.style.display).toBe('none');
    });

    it('should update container visibility when updateContainerVisibility is called', () => {
      const container = document.querySelector('.toastizy-container') as HTMLElement;
      expect(container.style.display).toBe('none');

      toastr.show({ title: 'Test toast', type: 'success' });
      toastr.updateContainerVisibility();
      expect(container.style.display).toBe('block');
    });
  });

  describe('Toast positioning', () => {
    it('should set default position to top-right', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      const container = document.querySelector('.toastizy-container');
      expect(container?.classList.contains('top-right')).toBeTruthy();
    });

    it('should set custom position', () => {
      toastr.show({ title: 'Test toast', type: 'success' }, { position: 'bottom-left' });
      const container = document.querySelector('.toastizy-container');
      expect(container?.classList.contains('bottom-left')).toBeTruthy();
    });

    it('should change position when new toast with different position is added', () => {
      toastr.show({ title: 'Test toast 1', type: 'success' }, { position: 'top-left' });
      const container = document.querySelector('.toastizy-container');
      expect(container?.classList.contains('top-left')).toBeTruthy();

      toastr.show({ title: 'Test toast 2', type: 'info' }, { position: 'bottom-right' });
      expect(container?.classList.contains('bottom-right')).toBeTruthy();
      expect(container?.classList.contains('top-left')).toBeFalsy();
    });
  });

  describe('Toast types and styling', () => {
    it('should apply correct CSS class for different toast types', () => {
      toastr.show({ title: 'Success toast', type: 'success' });
      toastr.show({ title: 'Error toast', type: 'error' });
      toastr.show({ title: 'Warning toast', type: 'warning' });
      toastr.show({ title: 'Info toast', type: 'info' });

      const successToast = document.querySelector('.toastizy-success');
      const errorToast = document.querySelector('.toastizy-error');
      const warningToast = document.querySelector('.toastizy-warning');
      const infoToast = document.querySelector('.toastizy-info');

      expect(successToast).toBeTruthy();
      expect(errorToast).toBeTruthy();
      expect(warningToast).toBeTruthy();
      expect(infoToast).toBeTruthy();
    });

    it('should apply custom className', () => {
      toastr.show({ title: 'Custom toast', type: 'success' }, { className: 'custom-class' });
      const toast = document.querySelector('.toastizy');
      expect(toast?.classList.contains('custom-class')).toBeTruthy();
    });
  });

  describe('Toast icons', () => {
    it('should display icon when provided', () => {
      toastr.show({ title: 'Toast with icon', type: 'success', icon: 'fas fa-check' });
      const toast = document.querySelector('.toastizy');
      expect(toast?.innerHTML).toContain('<i class="fas fa-check"></i>');
    });

    it('should not display icon when not provided', () => {
      toastr.show({ title: 'Toast without icon', type: 'success' });
      const toast = document.querySelector('.toastizy');
      expect(toast?.innerHTML).not.toContain('<i class=');
    });
  });

  describe('Toast description', () => {
    it('should display description when provided', () => {
      toastr.show({
        title: 'Toast with description',
        description: 'This is a test description',
        type: 'success',
      });
      const toast = document.querySelector('.toastizy');
      expect(toast?.innerHTML).toContain('This is a test description');
      expect(toast?.querySelector('.toastizy-description')).toBeTruthy();
    });

    it('should not display description when not provided', () => {
      toastr.show({ title: 'Toast without description', type: 'success' });
      const toast = document.querySelector('.toastizy');
      expect(toast?.querySelector('.toastizy-description')).toBeFalsy();
    });
  });

  describe('Close button', () => {
    it('should display close button by default', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      const closeButton = document.querySelector('.toastizy-close');
      expect(closeButton).toBeTruthy();
    });

    it('should not display close button when disabled', () => {
      toastr.show({ title: 'Test toast', type: 'success' }, { closeButton: false });
      const closeButton = document.querySelector('.toastizy-close');
      expect(closeButton).toBeFalsy();
    });

    it('should remove toast when close button is clicked', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      const closeButton = document.querySelector('.toastizy-close') as HTMLElement;
      const toast = document.querySelector('.toastizy');

      closeButton.click();

      expect(toast?.classList.contains('toastizy-hide')).toBeTruthy();

      jest.advanceTimersByTime(300);
      const removedToast = document.querySelector('.toastizy');
      expect(removedToast).toBeFalsy();
    });
  });

  describe('Progress bar', () => {
    it('should display progress bar by default', () => {
      toastr.show({ title: 'Test toast', type: 'success' });
      const progressBar = document.querySelector('.toastizy-progress');
      expect(progressBar).toBeTruthy();
    });

    it('should not display progress bar when disabled', () => {
      toastr.show({ title: 'Test toast', type: 'success' }, { progressBar: false });
      const progressBar = document.querySelector('.toastizy-progress');
      expect(progressBar).toBeFalsy();
    });
  });

  describe('Duration behavior', () => {
    it('should not auto-remove toast when duration is 0', () => {
      toastr.show({ title: 'Persistent toast', type: 'success' }, { duration: 0 });
      const toast = document.querySelector('.toastizy');

      jest.advanceTimersByTime(5000);

      expect(toast?.classList.contains('toastizy-hide')).toBeFalsy();
      expect(document.querySelector('.toastizy')).toBeTruthy();
    });

    it('should use default duration when not specified', () => {
      toastr.show({ title: 'Default duration toast', type: 'success' });
      const toast = document.querySelector('.toastizy');

      jest.advanceTimersByTime(3000);

      expect(toast?.classList.contains('toastizy-hide')).toBeTruthy();
    });
  });

  describe('Error handling', () => {
    it('should handle removing non-existent toast gracefully', () => {
      expect(() => {
        toastr.remove('non-existent-id');
      }).not.toThrow();
    });

    it('should handle empty container gracefully', () => {
      // Supprimer le conteneur pour tester la robustesse
      const container = document.querySelector('.toastizy-container');
      container?.remove();

      expect(() => {
        toastr.show({ title: 'Test toast', type: 'success' });
      }).not.toThrow();
    });
  });

  describe('Multiple toasts management', () => {
    it('should handle multiple toasts correctly', () => {
      toastr.show({ title: 'Toast 1', type: 'success' });
      toastr.show({ title: 'Toast 2', type: 'error' });
      toastr.show({ title: 'Toast 3', type: 'warning' });

      const toasts = document.querySelectorAll('.toastizy');
      expect(toasts.length).toBe(3);
      expect(toastr.getActiveToastsCount()).toBe(3);
    });

    it('should remove specific toast from multiple toasts', () => {
      toastr.show({ title: 'Toast 1', type: 'success' });
      toastr.show({ title: 'Toast 2', type: 'error' });
      toastr.show({ title: 'Toast 3', type: 'warning' });

      const toasts = document.querySelectorAll('.toastizy');
      const middleToastId = toasts[1].getAttribute('data-toast-id');

      toastr.remove(middleToastId!);
      jest.advanceTimersByTime(300);

      const remainingToasts = document.querySelectorAll('.toastizy');
      expect(remainingToasts.length).toBe(2);
      expect(toastr.getActiveToastsCount()).toBe(2);
    });
  });
});
