import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedCallback } from './useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the callback once with the latest arguments after the delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 400));

    act(() => {
      result.current.run('i');
      result.current.run('ip');
      result.current.run('iph');
    });
    vi.advanceTimersByTime(399);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('iph');
  });

  it('flushes immediately and can be cancelled', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 400));

    act(() => result.current.run('now'));
    act(() => result.current.flush());
    expect(callback).toHaveBeenCalledWith('now');

    act(() => result.current.run('never'));
    act(() => result.current.cancel());
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('always invokes the latest callback and cancels on unmount', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, 100),
      { initialProps: { callback: first } },
    );

    act(() => result.current.run());
    rerender({ callback: second });
    vi.advanceTimersByTime(100);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    act(() => result.current.run());
    unmount();
    vi.advanceTimersByTime(100);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
