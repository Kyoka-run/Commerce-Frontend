import '@testing-library/jest-dom';
import { vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});

globalThis.vi = vi;