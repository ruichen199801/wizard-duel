import { fireEvent, render, screen } from '@testing-library/react';
import { EndTurnButton, VisibleTurnPhase } from './EndTurnButton';

describe('EndTurnButton', () => {
  const handleClick = jest.fn();

  it('renders "End Turn" disabled when phase is endTurnDisabled', () => {
    render(
      <EndTurnButton
        turnPhase={VisibleTurnPhase.endTurnDisabled}
        handleEndTurnButtonClick={handleClick}
      />
    );

    const button = screen.getByTestId('end-turn-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn-secondary');
  });

  it('renders "End Turn" enabled when phase is endTurnEnabled', () => {
    render(
      <EndTurnButton
        turnPhase={VisibleTurnPhase.endTurnEnabled}
        handleEndTurnButtonClick={handleClick}
      />
    );

    const button = screen.getByTestId('end-turn-button');
    expect(button).toBeEnabled();
    expect(button).toHaveClass('btn-dark');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders "Enemy Turn" disabled when phase is aiTurn', () => {
    render(
      <EndTurnButton
        turnPhase={VisibleTurnPhase.aiTurn}
        handleEndTurnButtonClick={handleClick}
      />
    );

    const button = screen.getByTestId('end-turn-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn-secondary');
  });
});
