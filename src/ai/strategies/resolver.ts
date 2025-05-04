import { EffectGroupName, EffectType } from '../../core/data/cardEffects';
import { Card, CardId, CardKeyword } from '../../core/data/cards';
import { WizardDuelState } from '../../core/game/game';
import { random } from './random';
import {
  POWERFUL_CARDS,
  REMOVE_BUFF_CARDS,
  REMOVE_DEBUFF_CARDS,
} from './strategyUtils';

/**
 * Resolves the card to play from a list of filtered actions.
 * The rules are ranked by priority, more prioritized rules get evaluated first.
 * This function should only be invoked when there's more than 1 card left after filterActions().
 *
 * @returns The resolved card object.
 */
export const resolveAction = (actions: Card[], G: WizardDuelState): Card => {
  // When AI is frozen, resolve to random(cards)
  if (G.players[1].effects.some((e) => e.type === EffectType.freeze)) {
    // console.log('Resolve to random card when frozen');
    return random(actions);
  }

  // When HP diff is huge, resolve to random(Mutate) if any
  if (
    actions.some((card) => card.id === CardId.Mutate) &&
    G.players[0].hp - G.players[1].hp >= 20
  ) {
    // console.log('Resolve to Mutate');
    return actions.find((card) => card.id === CardId.Mutate)!;
  }

  // When AI has multiple debuffs, resolve to random(removeDebuffCards) if any
  if (
    actions.some((card) => REMOVE_DEBUFF_CARDS.includes(card.id)) &&
    G.players[1].effects.filter((e) => e.group === EffectGroupName.debuff)
      .length >= 2
  ) {
    // console.log('Resolve to removing debuff');
    return actions.find((card) => REMOVE_DEBUFF_CARDS.includes(card.id))!;
  }

  // When player has multiple buffs, resolve to random(removeBuffCards) if any
  if (
    actions.some((card) => REMOVE_BUFF_CARDS.includes(card.id)) &&
    G.players[0].effects.filter((e) => e.group === EffectGroupName.buff)
      .length >= 2
  ) {
    // console.log('Resolve to removing buff');
    return actions.find((card) => REMOVE_BUFF_CARDS.includes(card.id))!;
  }

  // When AI is low on HP and healing is not invalidated, resolve to random(CardKeyword.sustain) if any
  if (
    actions.some((card) => card.keywords.includes(CardKeyword.sustain)) &&
    !G.players[1].effects.some((e) => e.type === EffectType.poison) &&
    G.players[1].hp <= Math.ceil(G.players[1].maxHp * 0.3)
  ) {
    // console.log('Resolve to healing cards');
    return actions.find((card) => card.keywords.includes(CardKeyword.sustain))!;
  }

  // When AI has next damage x2 or high atk or player has low def or player is low on HP,
  // resolve to random(CardKeyword.damage) if any
  if (
    actions.some((card) => card.keywords.includes(CardKeyword.damage)) &&
    (G.players[1].effects.some((e) => e.type === EffectType.doubleDmg) ||
      G.players[1].atk >= G.players[1].baseAtk + 3 ||
      G.players[0].def <= G.players[0].baseDef - 3 ||
      G.players[0].hp <= Math.ceil(G.players[0].maxHp * 0.3))
  ) {
    // console.log('Resolve to damage cards');
    return actions.find((card) => card.keywords.includes(CardKeyword.damage))!;
  }

  // Resolve to cards with powerful effects if any
  if (actions.some((card) => POWERFUL_CARDS.includes(card.id))) {
    // console.log('Resolve to powerful cards');
    return actions.find((card) => POWERFUL_CARDS.includes(card.id))!;
  }

  // Resolve to random(original actions)
  // console.log('Exit from resolver fallback');
  return random(actions);
};
