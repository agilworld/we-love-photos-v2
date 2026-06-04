import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunks2Arr(arr: any[], size: number) {
  if (size < 0) throw new Error('size must be positive integer');

  const res = arr.reduce((acc: any, _: any, i: number) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);

  return res;
}

export const uniqueBy = (x: any, f: any) =>
  Object.values(x.reduce((a: any, b: any) => ((a[f(b)] = b), a), {}));