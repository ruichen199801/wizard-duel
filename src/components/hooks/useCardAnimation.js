import { useState } from 'react';
import { AnimationTarget } from '../utils/constants';
import {
  getAnimationTargetForCard,
  getAnimationDataForCard,
} from '../utils/assetPaths';
import { sleep } from '../utils/commonUtils';
import { CardKeyword } from '../../data/cards';
import { EffectType } from '../../data/cardEffects';

const useCardAnimation = (ctx, G) => {
  const [showPlayerAnimation, setShowPlayerAnimation] = useState(false);
  const [showEnemyAnimation, setShowEnemyAnimation] = useState(false);
  const [cardAnimationData, setCardAnimationData] = useState({});

  const handleShowCardAnimation = async (card) => {
    const animationTarget = getAnimationTargetForCard(card.id);
    const animationData = getAnimationDataForCard(card.id);

    if (animationTarget == null || animationData == null) {
      return;
    }

    let shouldPlayAnimation = animateCardOnPlay(card, animationTarget);
    if (!shouldPlayAnimation) {
      return;
    }

    setCardAnimationData(animationData);

    await sleep(animationData.timeout);

    setShowPlayerAnimation(false);
    setShowEnemyAnimation(false);
    setCardAnimationData({});
  };

  /**
   * Manages card animation state changes when a card is played.
   *
   * Special rules to validate:
   *  - Do not play animation when:
   *     1. current player is frozen.
   *     2. current player's attack is scheduled to miss.
   *     3. effects will be cleared this turn, and current player is playing a card to change effect.
   *
   * Otherwise, play animation based on animationTarget value.
   */
  const animateCardOnPlay = (card, animationTarget) => {
    const hasFreezeEffect = G.players[ctx.currentPlayer].effects.some(
      (e) => e.type === EffectType.freeze
    );
    const hasDamageKeyword = card.keywords.includes(CardKeyword.damage);
    const hasEffectKeyward = card.keywords.includes(CardKeyword.effect);
    const shouldMiss = G.globalEffects.shouldMiss?.[ctx.turn - 1];
    const shouldClearEffects =
      G.globalEffects.shouldClearEffects?.[ctx.turn - 1];

    if (
      (hasEffectKeyward && shouldClearEffects) ||
      hasFreezeEffect ||
      (hasDamageKeyword && shouldMiss)
    ) {
      return false;
    }

    if (ctx.currentPlayer === '0') {
      setShowPlayerAnimation(
        animationTarget === AnimationTarget.self ||
          animationTarget === AnimationTarget.both
      );
      setShowEnemyAnimation(
        animationTarget === AnimationTarget.enemy ||
          animationTarget === AnimationTarget.both
      );
    } else {
      setShowPlayerAnimation(
        animationTarget === AnimationTarget.enemy ||
          animationTarget === AnimationTarget.both
      );
      setShowEnemyAnimation(
        animationTarget === AnimationTarget.self ||
          animationTarget === AnimationTarget.both
      );
    }

    return true;
  };

  return {
    cardAnimationData,
    showPlayerAnimation,
    showEnemyAnimation,
    handleShowCardAnimation,
  };
};

export default useCardAnimation;
