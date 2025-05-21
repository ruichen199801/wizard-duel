import { render, screen } from '@testing-library/react';
import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import { Fireball1 } from '../../model/cards';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { WizardDuelBoard } from './WizardDuelBoard';

// Mocks for all hooks
jest.mock('../../hooks/useAudioPlayer', () => ({
  useAudioPlayer: () => ({
    playAudio: jest.fn(),
    toggleAudioMute: jest.fn(),
    isAudioMuted: false,
  }),
}));

jest.mock('../../hooks/useBsTooltip', () => ({
  useBsTooltip: jest.fn(),
}));

jest.mock('../../hooks/useCardAnimation', () => ({
  useCardAnimation: () => ({
    cardAnimationData: {},
    showPlayerAnimation: false,
    showEnemyAnimation: false,
    handleShowCardAnimation: jest.fn(),
  }),
}));

jest.mock('../../hooks/useLog', () => ({
  useLog: () => ({
    logEntries: [],
    addLogEntry: jest.fn(),
  }),
}));

jest.mock('../../hooks/useMusicPlayer', () => ({
  useMusicPlayer: () => ({
    playMusic: jest.fn(),
    pauseMusic: jest.fn(),
    toggleMusic: jest.fn(),
    isMusicMuted: false,
  }),
}));

jest.mock('../../hooks/usePersistentState', () => ({
  usePersistentState: () => [true, jest.fn()],
}));

// Mocks for all components
jest.mock('../card/CardPreview', () => ({
  CardPreview: () => <div data-testid='CardPreview' />,
}));

jest.mock('../card/PlayerHand', () => ({
  PlayerHand: ({ player }: any) => (
    <div data-testid={`PlayerHand-${player.id}`} />
  ),
}));

jest.mock('../modals/GameoverModal', () => ({
  GameoverModal: () => <div data-testid='GameoverModal' />,
}));

jest.mock('../modals/HelpModal', () => ({
  HelpModal: () => <div data-testid='HelpModal' />,
}));

jest.mock('../modals/LevelEffectModal', () => ({
  LevelEffectModal: () => <div data-testid='LevelEffectModal' />,
}));

jest.mock('../modals/LogModal', () => ({
  LogModal: () => <div data-testid='LogModal' />,
}));

jest.mock('../modals/MatchupModal', () => ({
  MatchupModal: () => <div data-testid='MatchupModal' />,
}));

jest.mock('../modals/NextLevelModal', () => ({
  NextLevelModal: () => <div data-testid='NextLevelModal' />,
}));

jest.mock('../modals/SelectCardModal', () => ({
  SelectCardModal: () => <div data-testid='SelectCardModal' />,
}));

jest.mock('../modals/SelectPowerModal', () => ({
  SelectPowerModal: () => <div data-testid='SelectPowerModal' />,
}));

jest.mock('../modals/SettingsModal', () => ({
  SettingsModal: () => <div data-testid='SettingsModal' />,
}));

jest.mock('../ui/EffectStack', () => ({
  EffectStack: () => <div data-testid='EffectStack' />,
}));

jest.mock('../ui/EndTurnButton', () => ({
  EndTurnButton: ({ handleEndTurnButtonClick }: any) => (
    <button data-testid='EndTurnButton' onClick={handleEndTurnButtonClick}>
      End Turn
    </button>
  ),
  VisibleTurnPhase: {
    endTurnDisabled: 'end turn disabled',
    endTurnEnabled: 'end turn enabled',
    aiTurn: 'ai turn',
  },
}));

jest.mock('../ui/GameStatsPanel', () => ({
  GameStatsPanel: () => <div data-testid='GameStatsPanel' />,
}));

jest.mock('../ui/IconList', () => ({
  IconList: () => <div data-testid='IconList' />,
}));

jest.mock('../ui/PlayerStatsPanel', () => ({
  PlayerStatsPanel: ({ player }: any) => (
    <div data-testid={`PlayerStatsPanel-${player.id}`} />
  ),
}));

// Mock utils
jest.mock('../../ai/ai', () => ({
  AI: () => jest.fn(() => 0),
  Strategy: {
    filter: 'filter',
  },
}));

jest.mock('../../utils/assetUtils', () => ({
  click: 'click.mp3',
  victory: 'victory.mp3',
  defeat: 'defeat.mp3',
  getLocationForLevel: () => 'location.png',
  getMusicForLevel: () => 'music.mp3',
}));

jest.mock('../../utils/commonUtils', () => ({
  sleep: () => Promise.resolve(),
}));

jest.mock('../../utils/presentationUtils', () => ({
  getSelectableCardIds: () => ['0', '1'],
  resolveCardAudio: () => 'card.mp3',
}));

// Minimal props to test render
const G: WizardDuelState = {
  players: {
    0: { ...p0 },
    1: { ...p1 },
  },
  deck: [Fireball1, Fireball1, Fireball1],
  level: '1',
  globalEffects: {},
};

const baseProps: Partial<BoardProps<WizardDuelState>> = {
  G,
  ctx: {
    currentPlayer: '0',
    turn: 1,
    gameover: undefined,
    phase: 'default',
    playOrder: ['0', '1'],
    playOrderPos: 0,
    numPlayers: 2,
    activePlayers: {},
  },
  moves: {
    drawCard: jest.fn(),
    playCard: jest.fn(),
  },
};

describe('WizardDuelBoard', () => {
  it('renders all main UI components and modals', () => {
    render(<WizardDuelBoard {...(baseProps as BoardProps<WizardDuelState>)} />);

    expect(screen.getByTestId('CardPreview')).toBeInTheDocument();
    expect(screen.getByTestId('PlayerHand-0')).toBeInTheDocument();
    expect(screen.getByTestId('PlayerHand-1')).toBeInTheDocument();

    expect(screen.getByTestId('GameoverModal')).toBeInTheDocument();
    expect(screen.getByTestId('HelpModal')).toBeInTheDocument();
    expect(screen.getByTestId('LevelEffectModal')).toBeInTheDocument();
    expect(screen.getByTestId('LogModal')).toBeInTheDocument();
    expect(screen.getByTestId('MatchupModal')).toBeInTheDocument();
    expect(screen.getByTestId('NextLevelModal')).toBeInTheDocument();
    expect(screen.getByTestId('SelectCardModal')).toBeInTheDocument();
    expect(screen.getByTestId('SelectPowerModal')).toBeInTheDocument();
    expect(screen.getByTestId('SettingsModal')).toBeInTheDocument();

    expect(screen.getByTestId('EffectStack')).toBeInTheDocument();
    expect(screen.getByTestId('EndTurnButton')).toBeInTheDocument();
    expect(screen.getByTestId('GameStatsPanel')).toBeInTheDocument();
    expect(screen.getByTestId('IconList')).toBeInTheDocument();
    expect(screen.getByTestId('PlayerStatsPanel-0')).toBeInTheDocument();
    expect(screen.getByTestId('PlayerStatsPanel-1')).toBeInTheDocument();
  });
});
