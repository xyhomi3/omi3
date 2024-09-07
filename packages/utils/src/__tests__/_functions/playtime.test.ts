import { playtime } from '../../../dist';

describe('playtime', () => {
  test('formats play time correctly for various inputs', () => {
    const testCases = [
      { input: 0, expected: '0:00' },
      { input: 30, expected: '0:30' },
      { input: 60, expected: '1:00' },
      { input: 90, expected: '1:30' },
      { input: 3661, expected: '61:01' },
      { input: 7200, expected: '120:00' },
      { input: 3599, expected: '59:59' },
      { input: 3600, expected: '60:00' },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(playtime(input)).toBe(expected);
    });
  });

  test('handles floating point numbers', () => {
    expect(playtime(30.5)).toBe('0:30');
    expect(playtime(59.9)).toBe('0:59');
  });

  test('handles negative numbers by treating them as 0', () => {
    expect(playtime(-30)).toBe('0:00');
    expect(playtime(-90)).toBe('0:00');
  });

  test('handles very large numbers', () => {
    expect(playtime(1e10)).toBe('166666666:40');
  });
});
