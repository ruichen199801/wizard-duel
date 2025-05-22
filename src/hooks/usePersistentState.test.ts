import { act, renderHook } from '@testing-library/react';
import { usePersistentState } from './usePersistentState';

describe('usePersistentState', () => {
  const STORAGE_KEY = 'test-key';

  it('initializes state with default value if sessionStorage is empty', () => {
    const { result } = renderHook(() =>
      usePersistentState(STORAGE_KEY, 'default')
    );

    expect(result.current[0]).toBe('default');
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify('default'));
  });

  it('initializes state from sessionStorage if value exists', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify('stored-value'));

    const { result } = renderHook(() =>
      usePersistentState(STORAGE_KEY, 'default')
    );

    expect(result.current[0]).toBe('stored-value');
  });

  it('updates state and sessionStorage when setter is called', () => {
    const { result } = renderHook(() =>
      usePersistentState(STORAGE_KEY, 'default')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify('new-value')
    );
  });

  it('updates sessionStorage when state changes via function setter', () => {
    const { result } = renderHook(() => usePersistentState(STORAGE_KEY, 1));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('2');
  });
});
