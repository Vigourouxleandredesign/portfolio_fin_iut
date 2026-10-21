/**
 * @file Unit — supabase-client env helpers (B1)
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('supabase-client', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('returns null env and is not configured when vars missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    const mod = await import('../../src/scripts/modules/supabase-client');
    mod.resetSupabaseClient();
    expect(mod.getSupabaseEnv()).toBeNull();
    expect(mod.isSupabaseConfigured()).toBe(false);
  });

  it('reads trimmed env when present', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', ' https://example.supabase.co ');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', ' anon-test-key ');
    const mod = await import('../../src/scripts/modules/supabase-client');
    mod.resetSupabaseClient();
    expect(mod.getSupabaseEnv()).toEqual({
      url: 'https://example.supabase.co',
      anonKey: 'anon-test-key',
    });
    expect(mod.isSupabaseConfigured()).toBe(true);
  });

  it('getSupabaseClient throws when env missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    const mod = await import('../../src/scripts/modules/supabase-client');
    mod.resetSupabaseClient();
    expect(() => mod.getSupabaseClient()).toThrow(/not configured/i);
  });
});
