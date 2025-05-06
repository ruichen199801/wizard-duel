import { useEffect, useState } from 'react';

/**
 * Custom hook to manage state and sync it with sessionStorage.
 * This can be used to track setting changes except for audio and music, which are handled in their own hooks.
 */
const usePersistentState = <T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const savedValue = sessionStorage.getItem(key);
    return savedValue ? (JSON.parse(savedValue) as T) : defaultValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
};

export default usePersistentState;
