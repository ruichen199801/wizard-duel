export enum VisibleTurnPhase {
  // The player has drawn a card but hasn't clicked to preview any yet.
  // The end-turn button shows "End Turn" and is disabled.
  endTurnDisabled = 'end turn disabled',

  // The player has previewed a card and can end their turn.
  // The end-turn button shows "End Turn" and is enabled.
  endTurnEnabled = 'end turn enabled',

  // The AI is taking its turn. Player cannot interact.
  // The end-turn button shows "Enemy Turn" and is disabled.
  aiTurn = 'ai turn',
}

interface EndTurnButtonProps {
  readonly turnPhase: VisibleTurnPhase;
  readonly handleEndTurnButtonClick: () => void;
}

export const EndTurnButton = ({
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
