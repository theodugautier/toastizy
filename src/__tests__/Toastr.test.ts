import { Toastr } from '../Toastr';

describe('Toastr', () => {
  let toastr: Toastr;

  beforeEach(() => {
    // Reset singleton instance
    (Toastr as any).instance = null;
    toastr = Toastr.getInstance();
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
    // Reset singleton instance
    (Toastr as any).instance = null;
  });

  it('should create a singleton instance', () => {
    const instance1 = Toastr.getInstance();
    const instance2 = Toastr.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should create container element', () => {
    const container = document.querySelector('.toastr-container');
    expect(container).toBeTruthy();
  });

  it('should show a toast message', () => {
    toastr.show('Test message', 'success');
    const toast = document.querySelector('.toastr');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Test message');
  });

  it('should remove a toast by id', () => {
    toastr.show('Test message');
    const toast = document.querySelector('.toastr');
    const toastId = toast?.getAttribute('data-toast-id');

    expect(toast).toBeTruthy();
    expect(toastId).toBeTruthy();

    toastr.remove(toastId!);
    const removedToast = document.querySelector('.toastr');
    expect(removedToast).toBeFalsy();
  });

  it('should remove multiple toasts', () => {
    toastr.show('Message 1');
    toastr.show('Message 2');

    const toasts = document.querySelectorAll('.toastr');
    expect(toasts.length).toBe(2);

    const firstToastId = toasts[0].getAttribute('data-toast-id');
    toastr.remove(firstToastId!);

    const remainingToasts = document.querySelectorAll('.toastr');
    expect(remainingToasts.length).toBe(1);
  });
});