import { describe, expect, it } from 'vitest';
import { resolveTarget } from '../interactive.js';

describe('resolveTarget', () => {
  it('keeps HTTPS URLs unchanged', () => {
    expect(resolveTarget('https://example.com')).toEqual({
      type: 'url',
      path: 'https://example.com',
    });
  });

  it('normalizes a bare domain to HTTPS', () => {
    expect(resolveTarget('example.com')).toEqual({
      type: 'url',
      path: 'https://example.com',
    });
  });

  it('throws actionable guidance for relative paths without --dir', () => {
    expect(() => resolveTarget('./dist')).toThrowError(/--dir/);
  });

  it('throws actionable guidance for absolute paths without --dir', () => {
    expect(() => resolveTarget('/tmp/site')).toThrowError(/--dir/);
  });

  it('resolves paths as directory when --dir is set', () => {
    expect(resolveTarget('./dist', true)).toEqual({
      type: 'directory',
      path: './dist',
    });
  });
});
