import { describe, it, expect, vi } from 'vitest';
import { formatPrice, formatPriceCalculation } from './formatPrice';

describe('Price Formatting Utilities', () => {
  describe('formatPrice function', () => {
    it('formats numbers as USD currency', () => {
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(1000)).toBe('$1,000.00');
    });
    
    it('handles zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });
    
    it('handles negative numbers', () => {
      expect(formatPrice(-50)).toBe('-$50.00');
    });
    
    it('handles decimal precision', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
      expect(formatPrice(10.55)).toBe('$10.55');
      expect(formatPrice(10.555)).toBe('$10.56'); // Rounds to nearest cent
    });
    
    it('handles large numbers with proper formatting', () => {
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });
  });
  
  describe('formatPriceCalculation function', () => {
    it('calculates the correct total', () => {
      expect(formatPriceCalculation(2, 10)).toBe('20.00');
      expect(formatPriceCalculation(3, 5.5)).toBe('16.50');
    });
    
    it('handles zero quantity or price', () => {
      expect(formatPriceCalculation(0, 10)).toBe('0.00');
      expect(formatPriceCalculation(5, 0)).toBe('0.00');
    });
    
    it('handles decimal precision', () => {
      expect(formatPriceCalculation(2, 10.555)).toBe('21.11'); // Rounds to nearest cent
    });
    
    it('handles string inputs by converting them to numbers', () => {
      expect(formatPriceCalculation('2', '10')).toBe('20.00');
      expect(formatPriceCalculation('3', '5.5')).toBe('16.50');
    });
    
    it('handles negative numbers', () => {
      expect(formatPriceCalculation(-2, 10)).toBe('-20.00');
      expect(formatPriceCalculation(2, -10)).toBe('-20.00');
    });
    
    it('returns formatted string with exactly 2 decimal places', () => {
      const result = formatPriceCalculation(1, 1);
      expect(result).toBe('1.00');
      expect(result.split('.')[1].length).toBe(2);
    });
  });
});