import { seek } from '../../../dist';

describe('seek function', () => {
  test('should create handlers that call the provided function with the first value of the array', () => {
    const mockHandler = jest.fn();
    const handlers = seek(mockHandler);

    // Test onValueChange
    handlers.onValueChange([42, 10, 20]);
    expect(mockHandler).toHaveBeenCalledWith(42);

    // Test onValueCommit
    handlers.onValueCommit([99, 30, 40]);
    expect(mockHandler).toHaveBeenCalledWith(99);

    // Vérifier que le handler a été appelé deux fois au total
    expect(mockHandler).toHaveBeenCalledTimes(2);
  });

  test('should handle single-element arrays', () => {
    const mockHandler = jest.fn();
    const handlers = seek(mockHandler);

    handlers.onValueChange([5]);
    expect(mockHandler).toHaveBeenCalledWith(5);

    handlers.onValueCommit([10]);
    expect(mockHandler).toHaveBeenCalledWith(10);
  });

  test('should not call handler for empty arrays', () => {
    const mockHandler = jest.fn();
    const handlers = seek(mockHandler);

    handlers.onValueChange([]);
    handlers.onValueCommit([]);

    expect(mockHandler).not.toHaveBeenCalled();
  });
});
