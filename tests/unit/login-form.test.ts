/**
 * @file Unit — login-form (B3)
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const signInWithPassword = vi.fn();

vi.mock('../../src/scripts/modules/supabase-client', () => ({
  getSupabaseClient: () => ({
    auth: { signInWithPassword },
  }),
}));

import { initLoginForm } from '../../src/scripts/features/auth/login-form';

function mountLoginDom(): HTMLElement {
  document.body.innerHTML = `
    <div data-auth-login>
      <form data-auth-login-form>
        <input data-auth-email type="email" />
        <input data-auth-password type="password" />
        <p data-auth-error hidden></p>
        <button data-auth-submit type="submit">OK</button>
      </form>
    </div>
  `;
  return document.querySelector('[data-auth-login]')!;
}

describe('login-form', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    document.body.innerHTML = '';
  });

  it('shows error when email or password empty', async () => {
    const root = mountLoginDom();
    const onSuccess = vi.fn();
    initLoginForm(root, onSuccess);
    const form = root.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();
    const errorEl = root.querySelector<HTMLElement>('[data-auth-error]')!;
    expect(errorEl.hidden).toBe(false);
    expect(errorEl.textContent).toMatch(/requis/i);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('calls onSuccess after valid sign-in', async () => {
    const root = mountLoginDom();
    const onSuccess = vi.fn();
    initLoginForm(root, onSuccess);
    root.querySelector<HTMLInputElement>('[data-auth-email]')!.value = 'a@b.c';
    root.querySelector<HTMLInputElement>('[data-auth-password]')!.value = 'secret';
    signInWithPassword.mockResolvedValue({ error: null });
    const form = root.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
