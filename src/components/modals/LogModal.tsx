import { LogEntry } from '../../hooks/useLog';
import { click } from '../../utils/assetUtils';
import { Modal } from './Modal';

interface LogModalProps {
  readonly showLogModal: boolean;
  readonly setShowLogModal: React.Dispatch<React.SetStateAction<boolean>>;
  readonly logEntries: LogEntry[];
  readonly playAudio: (audio: string) => void;
}

export const LogModal = ({
  showLogModal,
  setShowLogModal,
  logEntries,
  playAudio,
}: LogModalProps) => {
  const handleLogClose = () => {
    setShowLogModal(false);
    playAudio(click);
  };

  return (
    <Modal
      title='Battle Log'
      isOpen={showLogModal}
      onClose={handleLogClose}
      heightClass='h-50'
    >
      <ul className='list-group list-group-flush'>
        {logEntries.map((entry, index) => (
          <li key={index} className='list-group-item bg-modal'>
            Turn {entry.turn}: <b>{entry.playerName}</b> played{' '}
            <b>{entry.cardName}</b>: {entry.cardText}
          </li>
        ))}
      </ul>
    </Modal>
  );
};
