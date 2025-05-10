import { useState } from 'react';

export interface LogEntry {
  readonly turn: number;
  readonly playerName: string;
  readonly cardName: string;
  readonly cardText: string;
}

export const useLog = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  const addLogEntry = (entry: LogEntry) => {
    setLogEntries((prevEntries) => [...prevEntries, entry]);
  };

  return { logEntries, addLogEntry };
};
