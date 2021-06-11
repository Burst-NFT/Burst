import { useRef } from 'react';

/**
 * Simple debounce implementation. Will call the given
 * function once after the time given has passed since
 * it was last called.
 * Lifted from downshift/utils (not exposed in lib).
 * @param {Function} fn the function to call after the time
 * @param {Number} time the time to wait
 * @return {Function} the debounced function
 */
export function debounce(fn: Function, time: number): Function {
  let timeoutId: any;

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  function wrapper(...args: any) {
    cancel();
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }

  wrapper.cancel = cancel;

  return wrapper;
}

export function useDebounce(callback: (arg0: any) => any, delay: number) {
  return useRef(debounce((params: any) => callback(params), delay)).current;
}
