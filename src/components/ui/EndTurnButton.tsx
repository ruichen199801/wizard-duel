import { VisibleTurnPhase } from '../../utils/constants';

interface EndTurnButtonProps {
  readonly turnPhase: VisibleTurnPhase;
  readonly handleEndTurnButtonClick: () => void;
}

const EndTurnButton = ({
  turnPhase,
  handleEndTurnButtonClick,
}: EndTurnButtonProps) => {
  const buttonStyles: Record<VisibleTurnPhase, string> = {
    [VisibleTurnPhase.endTurnDisabled]: 'btn-secondary',
    [VisibleTurnPhase.endTurnEnabled]: 'btn-dark',
    [VisibleTurnPhase.aiTurn]: 'btn-secondary',
  };

  return (
    <div className='d-flex justify-content-end m-2'>
      <button
        className={`btn btn-lg ${buttonStyles[turnPhase]}`}
        onClick={handleEndTurnButtonClick}
        disabled={turnPhase !== VisibleTurnPhase.endTurnEnabled}
      >
        {turnPhase === VisibleTurnPhase.aiTurn ? 'Enemy Turn' : 'End Turn'}
      </button>
    </div>
  );
};

export default EndTurnButton;
