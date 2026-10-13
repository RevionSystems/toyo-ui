import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * A single URL search param as state. Filters live in the URL so views are
 * shareable and survive reloads. Updates replace history to avoid one entry per keystroke.
 */
export function useQueryParam<T extends string = string>(key: string): [T | null, (value: T | null) => void] {
  const [params, setParams] = useSearchParams();
  const value = (params.get(key) as T | null) ?? null;
  const setValue = useCallback(
    (next: T | null) =>
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next === null || next === '') p.delete(key);
          else p.set(key, next);
          return p;
        },
        { replace: true },
      ),
    [key, setParams],
  );
  return [value, setValue];
}
