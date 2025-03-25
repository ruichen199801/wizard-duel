import { EffectGroupName, EffectType } from '../../data/cardEffects';
import { CardKeyword } from '../../data/cards';
import { random } from './random';

/**
 * Resolves the card to play from a list of filtered actions.
 * The rules are ranked by priority, more prioritized rules get evaluated first.
 * This function should only be invoked when there's more than 1 card left after filterActions().
 *
 * @returns The resolved card object.
 */
export const resolveAction = (actions, G) => {
  // When AI is frozen, resolve to random(cards)
  if (G.players[1].effects.some((e) => e.type === EffectType.freeze)) {
    console.log('Resolve to random card when frozen');
    return random(actions);
  }

  // When HP diff is huge, resolve to random(Mutate cards) if any
  if (
    actions.some((card) => card.id === '30') &&
    G.players[0].hp - G.players[1].hp >= 20
  ) {
    console.log('Resolve to Mutate');
    return actions.find((card) => card.id === '30');
  }

  // When AI has multiple debuffs, resolve to random(Purify cards) if any
  if (
    actions.some((card) => card.id === '16') &&
    G.players[1].effects.filter((e) => e.group === EffectGroupName.debuff)
      .length >= 2
  ) {
    console.log('Resolve to Purify');
    return actions.find((card) => card.id === '16');
  }

  // When player has multiple buffs, resolve to random(Dispel cards) if any
  if (
    actions.some((card) => card.id === '17') &&
    G.players[0].effects.filter((e) => e.group === EffectGroupName.buff)
      .length >= 2
  ) {
    console.log('Resolve to Dispel');
    return actions.find((card) => card.id === '17');
  }

  // When AI is low on HP, resolve to random(CardKeyword.sustain cards) if any
  if (
    actions.some((card) => card.keywords.includes(CardKeyword.sustain)) &&
    G.players[1].hp <= Math.ceil(G.players[1].maxHp * 0.3)
  ) {
    console.log('Resolve to healing cards');
    return actions.find((card) => card.keywords.includes(CardKeyword.sustain));
  }

  // When AI has next damage x2 or high atk or player has low def or player is low on HP,
  // resolve to random(CardKeyword.damage cards) if any
  if (
    actions.some((card) => card.keywords.includes(CardKeyword.damage)) &&
    (G.players[1].effects.some((e) => e.type === EffectType.doubleDmg) ||
      G.players[1].atk >= G.players[1].baseAtk + 3 ||
      G.players[0].def <= G.players[0].baseDef - 3 ||
      G.players[0].hp <= Math.ceil(G.players[0].maxHp * 0.3))
  ) {
    console.log('Resolve to damage cards');
    return actions.find((card) => card.keywords.includes(CardKeyword.damage));
  }

  // Resolve to random(original actions)
  console.log('Exit from resolver fallback');
  return random(actions);
};
