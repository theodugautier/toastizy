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
});