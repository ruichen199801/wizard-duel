import { act, renderHook } from '@testing-library/react';
import { LogEntry, useLog } from './useLog';

describe('useLog', () => {
  it('adds a log entry', () => {
    const { result } = renderHook(() => useLog());

    const newEntry: LogEntry = {
      turn: 1,
      playerName: 'Player',
      cardName: 'Fireball',
      cardText: 'Damage 3',
    };

    act(() => {
      result.current.addLogEntry(newEntry);
    });

    expect(result.current.logEntries).toHaveLength(1);
    expect(result.current.logEntries[0]).toEqual(newEntry);
  });
});
