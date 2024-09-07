import { cn } from '../../../dist';

describe('function cn', () => {
  test('merge les classes correctement', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  test('gère les valeurs falsy', () => {
    expect(cn('class1', null, undefined, false, '')).toBe('class1');
  });

  test('gère plusieurs classes conditionnelles', () => {
    expect(cn('class1', { class2: true, class3: false, class4: true })).toBe('class1 class2 class4');
  });

  test('gère les tableaux imbriqués', () => {
    expect(cn('class1', ['class2', ['class3', 'class4']])).toBe('class1 class2 class3 class4');
  });

  test('gère les combinaisons complexes', () => {
    expect(cn('class1', { class2: true }, ['class3', { class4: false, class5: true }])).toBe(
      'class1 class2 class3 class5',
    );
  });

  test('gère les entrées vides', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn([], {})).toBe('');
  });
});
