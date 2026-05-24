describe('Example Test Suite', () => {
  test('should return true', () => {
    expect(true).toBe(true);
  });

  test('should add numbers correctly', () => {
    const add = (a, b) => a + b;
    expect(add(2, 3)).toBe(5);
  });
});
