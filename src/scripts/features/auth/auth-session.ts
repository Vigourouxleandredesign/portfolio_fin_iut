/**
 * @file Auth session — profile and role helpers
 * @module features/auth
 * @description Fetches session and profile from Supabase. UI checks only — RLS enforces access.
 * @see {@link ../../../../docs/SECURITY.md}
 */

import { getSupabaseClient } from '../../modules/supabase-client';
import type { AppRole, Profile } from '../../modules/supabase-client.types';

/**
 * Result of an authenticated session with profile.
 */
export type AuthSessionState =
  | { status: 'anonymous' }
  | { status: 'authenticated'; userId: string; role: AppRole }
  | { status: 'error'; message: string };

/**
 * Loads the current session and user profile role from the database.
 */
export async function loadAuthSessionState(): Promise<AuthSessionState> {
  const supabase = getSupabaseClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    return { status: 'error', message: sessionError.message };
  }

  const session = sessionData.session;
  if (!session?.user) {
    return { status: 'anonymous' };
  }

  const profile = await fetchProfile(session.user.id);
  if (!profile) {
    return {
      status: 'error',
      message: 'Profile not found. Contact the site administrator.',
    };
  }

  return {
    status: 'authenticated',
    userId: session.user.id,
    role: profile.role,
  };
}

/**
 * Fetches a profile row for the given user id.
 * @param userId - auth.users id
 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[auth] fetchProfile', error.message);
    return null;
  }

  return data as Profile | null;
}

/**
 * Returns true when the current user has the evaluator role (UI gate only).
 */
export async function isCurrentUserEvaluator(): Promise<boolean> {
  const state = await loadAuthSessionState();
  return state.status === 'authenticated' && state.role === 'evaluator';
}

/**
 * Signs out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
