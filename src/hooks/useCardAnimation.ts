import { Ctx } from 'boardgame.io';
import { useState } from 'react';
import { EffectType } from '../core/data/cardEffects';
import { Card, CardKeyword } from '../core/data/cards';
import { WizardDuelState } from '../core/game/game';
import { PowerClass } from '../core/power/power';
import {
  AnimationProps,
  AnimationTarget,
  getAnimationDataForCard,
  getAnimationTargetForCard,
} from '../utils/assetUtils';
import { sleep } from '../utils/commonUtils';

const useCardAnimation = (ctx: Ctx, G: WizardDuelState) => {
  const [showPlayerAnimation, setShowPlayerAnimation] = useState(false);
  const [showEnemyAnimation, setShowEnemyAnimation] = useState(false);
  const [cardAnimationData, setCardAnimationData] = useState<
    AnimationProps | undefined
  >();

  const handleShowCardAnimation = async (card: Card): Promise<void> => {
    const animationTarget = getAnimationTargetForCard(card.id);
    const animationData = getAnimationDataForCard(card.id);

    if (!animationTarget || !animationData) return;

    let shouldPlayAnimation = animateCardOnPlay(card, animationTarget);
    if (!shouldPlayAnimation) return;

    setCardAnimationData(animationData);

    await sleep(animationData.timeout);

    setShowPlayerAnimation(false);
    setShowEnemyAnimation(false);
    setCardAnimationData(undefined);
  };

  /**
   * Manages card animation state changes when a card is played.
   *
   * Special rules to validate:
   *  - Do not play animation in the following cases.
   *     1. Effects will be cleared this turn, and current player is playing a card to change effect.
   *     2. Current player is frozen.
   *     3. Current player's attack is scheduled to miss.
   *     4. Current player is poisoned and the card has single effect and the effect is self-healing.
   *
   * Otherwise, play animation based on animationTarget value.
   */
  const animateCardOnPlay = (
    card: Card,
    animationTarget: AnimationTarget
  ): boolean => {
    const hasFreezeEffect = G.players[ctx.currentPlayer].effects.some(
      (e) => e.type === EffectType.freeze
    );
    const hasPoisonEffect = G.players[ctx.currentPlayer].effects.some(
      (e) => e.type === EffectType.poison
    );
    const hasDamageKeyword = card.keywords.includes(CardKeyword.damage);
    const hasEffectKeyward = card.keywords.includes(CardKeyword.effect);
    const isUniqueHealCard =
      (card.effects.length === 1 && card.effects[0].type === EffectType.heal) ||
      card.id === '23';
    const shouldMiss = G.globalEffects.shouldMiss?.[ctx.turn - 1];
    const shouldPlayerMiss = G.globalEffects.shouldPlayerMiss?.[ctx.turn - 1];
    const shouldClearEffects =
      G.globalEffects.shouldClearEffects?.[ctx.turn - 1];

    if (
      (hasEffectKeyward && shouldClearEffects) ||
      hasFreezeEffect ||
      (hasDamageKeyword && shouldMiss) ||
      (ctx.currentPlayer === '0' && hasDamageKeyword && shouldPlayerMiss) ||
      (isUniqueHealCard && hasPoisonEffect) ||
      (ctx.currentPlayer === '0' &&
        isUniqueHealCard &&
        sessionStorage.getItem('power') === PowerClass.cryo)
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
