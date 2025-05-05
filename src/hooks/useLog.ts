import { useState } from 'react';

interface LogEntry {
  readonly turn: number;
  readonly playerName: string;
  readonly cardName: string;
  readonly cardText: string;
}

const useLog = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  const addLogEntry = (
    turn: number,
    playerName: string,
    cardName: string,
    cardText: string
  ) => {
    const entry: LogEntry = { turn, playerName, cardName, cardText };
    setLogEntries((prevEntries) => [...prevEntries, entry]);
  };

  return { logEntries, addLogEntry };
};

export default useLog;
