import { useEffect, useState } from 'react';

import useAudioPlayer from '../../hooks/useAudioPlayer';
import useBsTooltip from '../../hooks/useBsTooltip';
import useCardAnimation from '../../hooks/useCardAnimation';
import useLog from '../../hooks/useLog';
import useMusicPlayer from '../../hooks/useMusicPlayer';
import usePersistentState from '../../hooks/usePersistentState';

import { AI, Strategy } from '../../ai/ai';
import { DrawMode } from '../../core/level/level';
import {
  click,
  defeat,
  getLocationForLevel,
  getMusicForLevel,
  victory,
} from '../../utils/assetUtils';
import { sleep } from '../../utils/commonUtils';
import {
  getSelectableCardIds,
  resolveCardAudio,
} from '../../utils/presentationUtils';

import CardPreview from '../card/CardPreview';
import PlayerHand from '../card/PlayerHand';
import GameoverModal from '../modals/GameoverModal';
import HelpModal from '../modals/HelpModal';
import LevelEffectModal from '../modals/LevelEffectModal';
import LogModal from '../modals/LogModal';
import MatchupModal from '../modals/MatchupModal';
import NextLevelModal from '../modals/NextLevelModal';
import SelectCardModal from '../modals/SelectCardModal';
import SelectPowerModal from '../modals/SelectPowerModal';
import SettingsModal from '../modals/SettingsModal';
import EffectStack from '../ui/EffectStack';
import EndTurnButton, { VisibleTurnPhase } from '../ui/EndTurnButton';
import GameStatsPanel from '../ui/GameStatsPanel';
import IconList from '../ui/IconList';
import PlayerStatsPanel from '../ui/PlayerStatsPanel';

export const PAUSE_INTERVAL = 1200;

const WizardDuelBoard = ({ ctx, G, moves, events, reset }) => {
  // Initialize Bootstrap tooltips
  useBsTooltip();

  const [selectedCardToPlay, setSelectedCardToPlay] = useState(null);
  const [playerSelectedIndexToPlay, setPlayerSelectedIndexToPlay] =
    useState(null);
  const [turnPhase, setTurnPhase] = useState(VisibleTurnPhase.endTurnDisabled);
  const [winner, setWinner] = useState(null);
  const [showGameoverModal, setShowGameoverModal] = useState(false);
  const [showNextLevelModal, setShowNextLevelModal] = useState(false);
  const [showSelectPowerModal, setShowSelectPowerModal] = useState(false);
  const [showLevelEffectModal, setShowLevelEffectModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMatchupModal, setShowMatchupModal] = useState(true);

  const [showSelectCardModal, setShowSelectCardModal] = useState(false);
  const [selectableCardsToDraw, setSelectableCardsToDraw] = useState([]);

  const [aiStrategy, setAiStrategy] = usePersistentState(
    'aiStrategy',
    Strategy.filter
  );
  const [showGameStats, setShowGameStats] = usePersistentState(
    'showGameStats',
    true
  );
  const [showEffectStack, setShowEffectStack] = usePersistentState(
    'showEffectStack',
    true
  );

  const { logEntries, addLogEntry } = useLog();
  const { playAudio, toggleAudioMute, isAudioMuted } = useAudioPlayer();
  const { playMusic, pauseMusic, toggleMusic, isMusicMuted } = useMusicPlayer(
    getMusicForLevel(G.level)
  );
  const {
    cardAnimationData,
    showPlayerAnimation,
    showEnemyAnimation,
    handleShowCardAnimation,
  } = useCardAnimation(ctx, G);
  const [visibleCurrentTurn, setVisibleCurrentTurn] = useState(0);

  const playCardAudio = (card) => {
    playAudio(resolveCardAudio(card, G, ctx));
  };

  const handleDrawCard = async () => {
    if (ctx.gameover) {
      return;
    }

    if (ctx.turn > 1) {
      await sleep(PAUSE_INTERVAL); // Preview card duration

      // Turn 2 does not have draw phase, hence displaying updated turn number immediately
      if (ctx.turn === 2) {
        setVisibleCurrentTurn((prevTurn) => prevTurn + 1);
      }

      setSelectedCardToPlay(null);
      setPlayerSelectedIndexToPlay(null);
      await sleep(PAUSE_INTERVAL); // Interval between preview and draw
    }

    // Delay displaying updated turn number until when a card is drawn
    if (ctx.turn !== 2) {
      setVisibleCurrentTurn((prevTurn) => prevTurn + 1);
    }

    if (
      ctx.turn > 1 &&
      ctx.currentPlayer === '0' &&
      G.globalEffects.drawMode === DrawMode.select
    ) {
      setSelectableCardsToDraw(getSelectableCardIds(G));
      setShowSelectCardModal(true);
    } else {
      moves.drawCard();
    }

    if (ctx.turn > 1 && ctx.currentPlayer === '0') {
      setTurnPhase(VisibleTurnPhase.endTurnDisabled);
    }
  };

  const handleSelectCard = (cardId) => {
    setShowSelectCardModal(false);
    setSelectableCardsToDraw([]);
    moves.drawCard(cardId);
  };

  const handleAiPlayCard = async () => {
    if (ctx.gameover) {
      return;
    }

    if (ctx.currentPlayer === '1' && G.players[1].hand.length === 5) {
      // Interval between draw and play
      if (ctx.turn === 2) {
        await sleep(PAUSE_INTERVAL * 2); // x2 since AI does not draw in first turn
      } else {
        await sleep(PAUSE_INTERVAL);
      }

      const aiSelectedIndex = AI(aiStrategy)(G, ctx);
      const aiSelectedCard = G.players[1].hand[aiSelectedIndex];
      setSelectedCardToPlay(aiSelectedCard);

      moves.playCard(aiSelectedIndex);
      playCardAudio(aiSelectedCard);

      handleShowCardAnimation(aiSelectedCard);

      addLogEntry(
        ctx.turn,
        G.players[1].name,
        aiSelectedCard.name,
        aiSelectedCard.text
      );
    }
  };

  const handleShowGameoverModal = async () => {
    if (ctx.gameover) {
      // Add a delay so that the modal does not pop up immediately after the end move
      await sleep(PAUSE_INTERVAL);
      if (ctx.gameover.winner !== null) {
        setWinner(ctx.gameover.winner);
      }
      setShowGameoverModal(true);
      pauseMusic();
      playAudio(ctx.gameover.winner === '0' ? victory : defeat);
    }
    // Not needed if game restart is implemented via a full page reload
    // else {
    //   setShowGameoverModal(false);
    // }
  };

  useEffect(() => {
    handleDrawCard();
  }, [ctx.currentPlayer, ctx.gameover]);

  useEffect(() => {
    handleAiPlayCard();
  }, [ctx.currentPlayer, G.players[1].hand, ctx.gameover]);

  useEffect(() => {
    handleShowGameoverModal();
  }, [ctx.gameover]);

  const handleCardClick = async (index) => {
    if (turnPhase !== VisibleTurnPhase.aiTurn) {
      setSelectedCardToPlay(G.players[0].hand[index]);
      setPlayerSelectedIndexToPlay(index);
      playAudio(click);

      setTurnPhase(VisibleTurnPhase.endTurnEnabled);
    }
  };

  const handleEndTurnButtonClick = () => {
    if (turnPhase === VisibleTurnPhase.endTurnEnabled) {
      moves.playCard(playerSelectedIndexToPlay);
      playCardAudio(selectedCardToPlay);

      handleShowCardAnimation(selectedCardToPlay);

      addLogEntry(
        ctx.turn,
        G.players[0].name,
        G.players[0].hand[playerSelectedIndexToPlay].name,
        G.players[0].hand[playerSelectedIndexToPlay].text
      );

      setTurnPhase(VisibleTurnPhase.aiTurn);
    }
  };

  return (
    <div
      className='container-fluid vh-100 d-flex flex-column p-2 bg-board'
      style={{ '--bg-image': `url(/${getLocationForLevel(G.level)})` }}
    >
      <div className='row'>
        <div className='col-3'>
          <PlayerStatsPanel
            player={G.players[1]}
            level={G.level}
            showCardAnimation={showEnemyAnimation}
            cardAnimationData={cardAnimationData}
          />
        </div>

        <div className='col-6'>
          <PlayerHand
            player={G.players[1]}
            showEnemyHand={G.globalEffects.showEnemyHand}
          />
        </div>

        <div className='col-3'>
          <IconList
            setShowLevelEffectModal={setShowLevelEffectModal}
            setShowLogModal={setShowLogModal}
            setShowSettingsModal={setShowSettingsModal}
            setShowHelpModal={setShowHelpModal}
            playAudio={playAudio}
          />
        </div>
      </div>

      <div className='row flex-grow-1'>
        <div className='col-3'>
          <EffectStack
            opponentEffects={G.players[1].effects}
            playerEffects={G.players[0].effects}
            showEffectStack={showEffectStack}
          />
        </div>

        <div className='col-6'>
          <CardPreview selectedCard={selectedCardToPlay} />
        </div>

        <div className='col-3 d-flex flex-column align-items-end justify-content-center'>
          <GameStatsPanel
            G={G}
            visibleTurn={visibleCurrentTurn}
            showGameStats={showGameStats}
          />
        </div>
      </div>

      <div className='row align-items-end'>
        <div className='col-3'>
          <PlayerStatsPanel
            player={G.players[0]}
            showCardAnimation={showPlayerAnimation}
            cardAnimationData={cardAnimationData}
          />
        </div>

        <div className='col-6'>
          <PlayerHand
            player={G.players[0]}
            showEnemyHand={G.globalEffects.showEnemyHand}
            handleCardClick={handleCardClick}
          />
        </div>

        <div className='col-3'>
          <EndTurnButton
            turnPhase={turnPhase}
            handleEndTurnButtonClick={handleEndTurnButtonClick}
          />
        </div>
      </div>

      {/* Components rendered when the game starts */}
      <MatchupModal
        showMatchupModal={showMatchupModal}
        setShowMatchupModal={setShowMatchupModal}
        playMusic={playMusic}
        level={G.level}
      />

      {/* Components rendered on demand */}
      <GameoverModal
        showGameoverModal={showGameoverModal}
        setShowGameoverModal={setShowGameoverModal}
        setShowNextLevelModal={setShowNextLevelModal}
        setShowSelectPowerModal={setShowSelectPowerModal}
        winner={winner}
        playAudio={playAudio}
        level={G.level}
      />
      <NextLevelModal showNextLevelModal={showNextLevelModal} level={G.level} />
      <SelectPowerModal
        showSelectPowerModal={showSelectPowerModal}
        playAudio={playAudio}
      />
      <LevelEffectModal
        showLevelEffectModal={showLevelEffectModal}
        setShowLevelEffectModal={setShowLevelEffectModal}
        playAudio={playAudio}
        level={G.level}
      />
      <LogModal
        showLogModal={showLogModal}
        setShowLogModal={setShowLogModal}
        logEntries={logEntries}
        playAudio={playAudio}
      />
      <SettingsModal
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
        playAudio={playAudio}
        toggleAudioMute={toggleAudioMute}
        isAudioMuted={isAudioMuted}
        toggleMusic={toggleMusic}
        isMusicMuted={isMusicMuted}
        showGameStats={showGameStats}
        setShowGameStats={setShowGameStats}
        showEffectStack={showEffectStack}
        setShowEffectStack={setShowEffectStack}
        aiStrategy={aiStrategy}
        setAiStrategy={setAiStrategy}
      />
      <HelpModal
        showHelpModal={showHelpModal}
        setShowHelpModal={setShowHelpModal}
        playAudio={playAudio}
      />
      <SelectCardModal
        cardIdList={selectableCardsToDraw}
        handleSelectCard={handleSelectCard}
        showSelectCardModal={showSelectCardModal}
      />
    </div>
  );
};

export default WizardDuelBoard;
