/**
 * @file Supabase browser client
 * @module modules/supabase-client
 * @description Singleton client with PKCE flow for SPA. Anon key only — never service_role.
 * @see {@link ../../../docs/SUPABASE.md}
 * @see {@link https://supabase.com/docs/guides/auth/sessions/pkce-flow}
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { SupabaseEnv } from './supabase-client.types';

let client: SupabaseClient | null = null;

/**
 * Reads and validates Vite Supabase environment variables.
 * @returns Config object or null if missing
 */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

/**
 * Returns true when Supabase env vars are present.
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

/**
 * Returns the shared Supabase client (PKCE). Throws if env is missing.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) {
    return client;
  }

  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    );
  }

  client = createClient(env.url, env.anonKey, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

/**
 * Resets the cached client (tests / teardown).
 */
export function resetSupabaseClient(): void {
  client = null;
}
