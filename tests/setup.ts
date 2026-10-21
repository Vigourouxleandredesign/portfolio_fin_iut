/**
 * @file Vitest setup — shared DOM polyfills for unit/feature tests
 */
import { vi } from 'vitest';

class MockIntersectionObserver {
  observe(): void {
    /* no-op */
  }

  unobserve(): void {
    /* no-op */
  }

  disconnect(): void {
    /* no-op */
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
