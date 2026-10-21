/**
 * @file Unit — auth-session (B2)
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSession = vi.fn();
const maybeSingle = vi.fn();
const signOut = vi.fn();

vi.mock('../../src/scripts/modules/supabase-client', () => ({
  getSupabaseClient: () => ({
    auth: {
      getSession,
      signOut,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle,
        }),
      }),
    }),
  }),
}));

describe('auth-session', () => {
  beforeEach(() => {
    getSession.mockReset();
    maybeSingle.mockReset();
    signOut.mockReset();
  });

  it('returns anonymous when no session user', async () => {
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    const { loadAuthSessionState } = await import(
      '../../src/scripts/features/auth/auth-session'
    );
    await expect(loadAuthSessionState()).resolves.toEqual({ status: 'anonymous' });
  });

  it('returns authenticated evaluator when profile role matches', async () => {
    getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    });
    maybeSingle.mockResolvedValue({
      data: { id: 'user-1', role: 'evaluator', created_at: '2026-01-01' },
      error: null,
    });
    const { loadAuthSessionState, isCurrentUserEvaluator } = await import(
      '../../src/scripts/features/auth/auth-session'
    );
    await expect(loadAuthSessionState()).resolves.toEqual({
      status: 'authenticated',
      userId: 'user-1',
      role: 'evaluator',
    });
    await expect(isCurrentUserEvaluator()).resolves.toBe(true);
  });

  it('returns error when profile missing', async () => {
    getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-2' } } },
      error: null,
    });
    maybeSingle.mockResolvedValue({ data: null, error: null });
    const { loadAuthSessionState } = await import(
      '../../src/scripts/features/auth/auth-session'
    );
    const state = await loadAuthSessionState();
    expect(state.status).toBe('error');
  });
});
