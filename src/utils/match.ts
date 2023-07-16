export function match<
  TValue extends string | number = string,
  TReturnValue = unknown,
>(
  value: TValue,
  lookup: Record<TValue, TReturnValue | ((...args: any[]) => TReturnValue)>,
  ...args: any[]
): TReturnValue {
  if (value in lookup) {
    const returnValue = lookup[value];
    return typeof returnValue === 'function'
      ? returnValue(...args)
      : returnValue;
  }

  throw new Error('Something happened');
}
