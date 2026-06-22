/**
 * @file Evaluator app shell — auth gates and view switching
 * @module features/evaluator
 * @description Routes between login, dashboard, access denied, and config missing states.
 * @see {@link ../../../../docs/SECURITY.md}
 */

import { initLoginForm } from '../auth/login-form';
import {
  loadAuthSessionState,
  signOut,
  type AuthSessionState,
} from '../auth/auth-session';
import { isSupabaseConfigured, getSupabaseClient } from '../../modules/supabase-client';
import { initEvaluatorDashboard } from './evaluator-dashboard';

type ViewId = 'missing' | 'login' | 'denied' | 'dashboard';

/**
 * Mounts the full evaluator experience on `[data-evaluator-app]`.
 * @param root - App shell element
 * @returns Teardown function
 */
export function initEvaluatorApp(root: HTMLElement): () => void {
  const views = {
    missing: root.querySelector<HTMLElement>('[data-view-missing]'),
    login: root.querySelector<HTMLElement>('[data-view-login]'),
    denied: root.querySelector<HTMLElement>('[data-view-denied]'),
    dashboard: root.querySelector<HTMLElement>('[data-view-dashboard]'),
  };

  const loginPanel = root.querySelector<HTMLElement>('[data-auth-login]');
  const dashboardPanel = root.querySelector<HTMLElement>('[data-evaluator-dashboard]');

  if (
    !views.missing ||
    !views.login ||
    !views.denied ||
    !views.dashboard ||
    !loginPanel ||
    !dashboardPanel
  ) {
    console.warn('[evaluator-app] Missing shell elements');
    return () => undefined;
  }

  let teardownLogin: (() => void) | undefined;
  let teardownDashboard: (() => void) | undefined;
  let cancelled = false;

  const showView = (id: ViewId): void => {
    const map: Record<ViewId, HTMLElement> = {
      missing: views.missing!,
      login: views.login!,
      denied: views.denied!,
      dashboard: views.dashboard!,
    };

    for (const key of Object.keys(map) as ViewId[]) {
      map[key].hidden = key !== id;
    }
  };

  const teardownActiveFeatures = (): void => {
    teardownLogin?.();
    teardownLogin = undefined;
    teardownDashboard?.();
    teardownDashboard = undefined;
  };

  const applyAuthState = async (): Promise<void> => {
    if (cancelled) return;

    teardownActiveFeatures();

    if (!isSupabaseConfigured()) {
      showView('missing');
      return;
    }

    const state: AuthSessionState = await loadAuthSessionState();
    if (cancelled) return;

    if (state.status === 'error') {
      showView('login');
      teardownLogin = initLoginForm(loginPanel, () => {
        void applyAuthState();
      });
      const errorEl = loginPanel.querySelector<HTMLElement>('[data-auth-error]');
      if (errorEl) {
        errorEl.textContent = state.message;
        errorEl.hidden = false;
      }
      return;
    }

    if (state.status === 'anonymous') {
      showView('login');
      teardownLogin = initLoginForm(loginPanel, () => {
        void applyAuthState();
      });
      return;
    }

    if (state.role !== 'evaluator') {
      showView('denied');
      return;
    }

    showView('dashboard');
    teardownDashboard = initEvaluatorDashboard(dashboardPanel);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
    } catch (err) {
      console.error('[evaluator-app] signOut', err);
    }
    await applyAuthState();
  };

  const supabase = isSupabaseConfigured() ? getSupabaseClient() : null;

  const onLogoutClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (
      target.matches('[data-auth-logout], [data-auth-logout-denied]') ||
      target.closest('[data-auth-logout], [data-auth-logout-denied]')
    ) {
      void handleLogout();
    }
  };

  root.addEventListener('click', onLogoutClick);

  const authSubscription = supabase?.auth.onAuthStateChange(() => {
    void applyAuthState();
  });

  void applyAuthState();

  return () => {
    cancelled = true;
    root.removeEventListener('click', onLogoutClick);
    authSubscription?.data.subscription.unsubscribe();
    teardownActiveFeatures();
  };
}
