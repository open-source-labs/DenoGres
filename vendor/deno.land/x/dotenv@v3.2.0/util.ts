// deno-lint-ignore no-explicit-any
export function removeEmptyValues(
  obj: Record<string, any>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === null) return false;
      if (value === undefined) return false;
      if (value === "") return false;
      return true;
    }),
  );
}

export function difference(arrA: string[], arrB: string[]): string[] {
  return arrA.filter((a) => arrB.indexOf(a) < 0);
}
