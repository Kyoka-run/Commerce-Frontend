import { describe, it, expect } from 'vitest';
import truncateText from './truncateText';

describe('truncateText Utility', () => {
  it('returns the original text if it is shorter than the limit', () => {
    const shortText = 'This is a short text';
    expect(truncateText(shortText, 90)).toBe(shortText);
  });
  
  it('truncates text that is longer than the limit', () => {
    const longText = 'This is a very long text that needs to be truncated because it exceeds the character limit';
    const truncated = truncateText(longText, 20);
    
    expect(truncated).toBe('This is a very long ...');
    expect(truncated.length).toBe(23); // 20 chars + '...'
  });
  
  it('uses the default limit of 90 characters if not specified', () => {
    const longText = 'A'.repeat(100);
    const truncated = truncateText(longText);
    
    expect(truncated.length).toBe(93); // 90 chars + '...'
    expect(truncated).toBe('A'.repeat(90) + '...');
  });
  
  it('handles null or undefined text', () => {
    expect(truncateText(null)).toBe(null);
    expect(truncateText(undefined)).toBe(undefined);
  });
  
  it('handles empty string', () => {
    expect(truncateText('')).toBe('');
  });
  
  it('handles exact length text', () => {
    const exactText = 'A'.repeat(90);
    expect(truncateText(exactText)).toBe(exactText);
  });
  
  it('handles text that is exactly one character longer than the limit', () => {
    const text = 'A'.repeat(91);
    expect(truncateText(text)).toBe('A'.repeat(90) + '...');
  });
});