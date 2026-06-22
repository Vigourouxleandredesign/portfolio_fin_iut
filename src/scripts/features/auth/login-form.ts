/**
 * @file Auth login form
 * @module features/auth
 * @description Email/password sign-in for evaluators. No sign-up UI (accounts created in Supabase Dashboard).
 * @see {@link ../../../../docs/SUPABASE.md}
 */

import { getSupabaseClient } from '../../modules/supabase-client';

/**
 * Callback when login succeeds.
 */
export type LoginSuccessHandler = () => void;

/**
 * Mounts the login form on `[data-auth-login]`.
 * @param root - Container with form fields
 * @param onSuccess - Called after successful sign-in
 * @returns Teardown function
 */
export function initLoginForm(
  root: HTMLElement,
  onSuccess: LoginSuccessHandler,
): () => void {
  const form = root.querySelector<HTMLFormElement>('[data-auth-login-form]');
  const emailInput = root.querySelector<HTMLInputElement>('[data-auth-email]');
  const passwordInput = root.querySelector<HTMLInputElement>('[data-auth-password]');
  const errorEl = root.querySelector<HTMLElement>('[data-auth-error]');
  const submitBtn = root.querySelector<HTMLButtonElement>('[data-auth-submit]');

  if (!form || !emailInput || !passwordInput || !errorEl || !submitBtn) {
    console.warn('[auth] Missing login form elements');
    return () => undefined;
  }

  const setError = (message: string): void => {
    errorEl.textContent = message;
    errorEl.hidden = message.length === 0;
  };

  const onSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    setError('');
    submitBtn.disabled = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      setError('Email et mot de passe requis.');
      submitBtn.disabled = false;
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError('Identifiants invalides ou compte non confirmé.');
        submitBtn.disabled = false;
        return;
      }

      passwordInput.value = '';
      onSuccess();
    } catch {
      setError('Connexion impossible. Vérifiez la configuration Supabase.');
      submitBtn.disabled = false;
    }
  };

  form.addEventListener('submit', onSubmit);

  return () => {
    form.removeEventListener('submit', onSubmit);
  };
}
