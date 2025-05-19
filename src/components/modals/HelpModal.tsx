import { click } from '../../utils/assetUtils';
import { BaseModal } from './BaseModal';

interface HelpModalProps {
  readonly showHelpModal: boolean;
  readonly setShowHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
  readonly playAudio: (audio: string) => void;
}

export const HelpModal = ({
  showHelpModal,
  setShowHelpModal,
  playAudio,
}: HelpModalProps) => {
  const handleHelpClose = () => {
    setShowHelpModal(false);
    playAudio(click);
  };

  return (
    <BaseModal
      title='Game Rules'
      isOpen={showHelpModal}
      onClose={handleHelpClose}
      heightClass='h-50'
    >
      <ol>
        <li className='mb-2'>Two players alternate turns. You go first.</li>
        <li className='mb-2'>
          The deck is shared and reshuffles when it runs out.
        </li>
        <li className='mb-2'>
          You draw <b>1</b> card from deck and play <b>1</b> card each turn.
        </li>
        <li className='mb-2'>
          Click a card to preview it, then click "End Turn" to play it.
        </li>
        <li className='mb-2'>
          You win the game if your opponent's HP drops to <b>0</b>.
        </li>
        <li className='mb-2'>
          The game ends in a draw after <b>50</b> turns pass.
        </li>
        <li>
          Damage is calculated as: (card damage + your attack - opponent's
          shield) × any modifiers.
        </li>
      </ol>
    </BaseModal>
  );
};
