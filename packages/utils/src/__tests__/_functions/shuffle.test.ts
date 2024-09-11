import { shuffle } from '../../../dist';

describe('shuffle', () => {
  test('shuffles an array without changing its length', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);
    expect(shuffled).toHaveLength(original.length);
    expect(shuffled).toEqual(expect.arrayContaining(original));
  });

  test('does not modify the original array', () => {
    const original = [1, 2, 3, 4, 5];
    shuffle(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  test('returns a new array', () => {
    const original = [1, 2, 3];
    const shuffled = shuffle(original);
    expect(shuffled).not.toBe(original);
  });

  test('handles empty arrays', () => {
    const empty: number[] = [];
    expect(shuffle(empty)).toEqual([]);
  });

  test('handles arrays with one element', () => {
    const oneElement = [1];
    expect(shuffle(oneElement)).toEqual([1]);
  });

  test('shuffles arrays with duplicate elements', () => {
    const withDuplicates = [1, 2, 2, 3, 3, 3];
    const shuffled = shuffle(withDuplicates);
    expect(shuffled).toHaveLength(withDuplicates.length);
    expect(shuffled).toEqual(expect.arrayContaining(withDuplicates));
  });

  test('produces different permutations over multiple shuffles', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffles = new Set();
    for (let i = 0; i < 100; i++) {
      shuffles.add(JSON.stringify(shuffle(original)));
    }
    // It's extremely unlikely to get less than 50 unique permutations in 100 shuffles
    expect(shuffles.size).toBeGreaterThan(50);
  });
});
