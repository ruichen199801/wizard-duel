import { PlayerID } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import { useEffect, useState } from 'react';

import { AI, Strategy } from '@ai';
import { Card, CardId, DrawMode, WizardDuelState } from '@core/models';
import {
  StatefulCacheKey,
  useAudioPlayer,
  useBsTooltip,
  useCardAnimation,
  useLog,
  useMusicPlayer,
  usePersistentState,
} from '@hooks';
import {
  click,
  defeat,
  getLocationForLevel,
  getMusicForLevel,
  getSelectableCardIds,
  resolveCardAudio,
  sleep,
  victory,
} from '@utils';

import { CardPreview, PlayerHand } from '@components/card';
import {
  GameoverModal,
  HelpModal,
  LevelEffectModal,
  LogModal,
  MatchupModal,
  NextLevelModal,
  SelectCardModal,
  SelectPowerModal,
  SettingsModal,
} from '@components/modals';
import {
  EffectStack,
  EndTurnButton,
  GameStatsPanel,
  IconList,
  PlayerStatsPanel,
  VisibleTurnPhase,
} from '@components/ui';

export const PAUSE_INTERVAL = 1200;

export interface WizardDuelProps extends BoardProps<WizardDuelState> {}

/**
 * @group Components
 */
export const WizardDuelBoard = ({
  ctx,
  G,
  moves,
  events,
  reset,
}: WizardDuelProps) => {
  // Initialize Bootstrap tooltips
  useBsTooltip();

  const [selectedCardToPlay, setSelectedCardToPlay] = useState<
    Card | undefined
  >();
  const [playerSelectedIndexToPlay, setPlayerSelectedIndexToPlay] = useState<
    number | undefined
  >();
  const [turnPhase, setTurnPhase] = useState(VisibleTurnPhase.endTurnDisabled);
  const [winner, setWinner] = useState<PlayerID | undefined>();

  const [showGameoverModal, setShowGameoverModal] = useState(false);
  const [showNextLevelModal, setShowNextLevelModal] = useState(false);
  const [showSelectPowerModal, setShowSelectPowerModal] = useState(false);
  const [showLevelEffectModal, setShowLevelEffectModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMatchupModal, setShowMatchupModal] = useState(true);

  const [showSelectCardModal, setShowSelectCardModal] = useState(false);
  const [selectableCardIdsToDraw, setSelectableCardIdsToDraw] = useState<
    CardId[]
  >([]);

  const [aiStrategy, setAiStrategy] = usePersistentState(
    StatefulCacheKey.aiStrategy,
    Strategy.filter
  );
  const [showGameStats, setShowGameStats] = usePersistentState(
    StatefulCacheKey.showGameStats,
    true
  );
  const [showEffectStack, setShowEffectStack] = usePersistentState(
    StatefulCacheKey.showEffectStack,
    true
  );

  const [visibleCurrentTurn, setVisibleCurrentTurn] = useState(0);

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
  } = useCardAnimation(G, ctx);

  const playCardAudio = (card: Card) => {
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

      setSelectedCardToPlay(undefined);
      setPlayerSelectedIndexToPlay(undefined);
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
      setSelectableCardIdsToDraw(getSelectableCardIds(G));
      setShowSelectCardModal(true);
    } else {
      moves.drawCard();
    }

    if (ctx.turn > 1 && ctx.currentPlayer === '0') {
      setTurnPhase(VisibleTurnPhase.endTurnDisabled);
    }
  };

  const handleSelectCard = (cardId: CardId) => {
    setShowSelectCardModal(false);
    setSelectableCardIdsToDraw([]);
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

      addLogEntry({
        turn: ctx.turn,
        playerName: G.players[1].name,
        cardName: aiSelectedCard.name,
        cardText: aiSelectedCard.text,
      });
    }
  };

  const handleShowGameoverModal = async () => {
    if (ctx.gameover) {
      // Add a delay so that the modal does not pop up immediately after the end move
      await sleep(PAUSE_INTERVAL);
      if (ctx.gameover.winner) {
        setWinner(ctx.gameover.winner);
      }
      setShowGameoverModal(true);
      pauseMusic();
      playAudio(ctx.gameover.winner === '0' ? victory : defeat);
    }
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

  const handleCardClick = (index: number) => {
    if (turnPhase !== VisibleTurnPhase.aiTurn) {
      setSelectedCardToPlay(G.players[0].hand[index]);
      setPlayerSelectedIndexToPlay(index);
      playAudio(click);

      setTurnPhase(VisibleTurnPhase.endTurnEnabled);
    }
  };

  const handleEndTurnButtonClick = () => {
    if (turnPhase === VisibleTurnPhase.endTurnEnabled) {
      if (playerSelectedIndexToPlay !== undefined && selectedCardToPlay) {
        moves.playCard(playerSelectedIndexToPlay);

        playCardAudio(selectedCardToPlay);
        handleShowCardAnimation(selectedCardToPlay);

        addLogEntry({
          turn: ctx.turn,
          playerName: G.players[0].name,
          cardName: G.players[0].hand[playerSelectedIndexToPlay].name,
          cardText: G.players[0].hand[playerSelectedIndexToPlay].text,
        });
      }

      setTurnPhase(VisibleTurnPhase.aiTurn);
    }
  };

  return (
    <div
      className='container-fluid vh-100 d-flex flex-column p-2 bg-board'
      style={
        {
          '--bg-image': `url(/${getLocationForLevel(G.level)})`,
        } as React.CSSProperties
      }
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
            showEnemyHand={G.globalEffects?.showEnemyHand ?? false}
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
            showEnemyHand={G.globalEffects?.showEnemyHand ?? false}
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
        cardIdList={selectableCardIdsToDraw}
        handleSelectCard={handleSelectCard}
        showSelectCardModal={showSelectCardModal}
      />
    </div>
  );
};
