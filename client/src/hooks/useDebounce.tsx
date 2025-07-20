import { useRef, useCallback } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function with cancel method
 */
export function useDebounce<T>(
  callback: (arg: T) => void,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (arg: T) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(arg);
      }, delay);
    },
    [callback, delay]
  );

  // Cleanup function to cancel pending timeouts
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    debouncedFn: debouncedCallback,
    cancel
  };
}
