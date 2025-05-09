import { Card } from '../data/cards';

/**
 * Randomly populate a player's hand with cards from a list of options and probabilities.
 */
export const randomPopulateHand = (
  options: Card[],
  probabilities: number[],
  handSize: number
): Card[] => {
  if (options.length !== probabilities.length) {
    throw new Error('Options and probabilities must have the same length.');
  }

  const totalProbability = probabilities.reduce((sum, prob) => sum + prob, 0);
  const normalizedProbabilities = probabilities.map(
    (prob) => prob / totalProbability
  );

  const hand = Array.from({ length: handSize }, () => {
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < options.length; i++) {
      cumulativeProbability += normalizedProbabilities[i];
      if (randomValue < cumulativeProbability) {
        return options[i];
      }
    }
    return options[0]; // Fallback logic, will never reach this line
  });

  return [...hand];
};

/**
 * Generate a sequence of attack outcomes based on a given number of turns and miss probability,
 * where `true` indicates a missed attack.
 */
export const generateAttackOutcomes = (
  numTurns: number,
  missProbability: number
): boolean[] => {
  if (!numTurns || !missProbability) {
    throw new Error('Total turn number or miss probability is not provided.');
  }

  const outcomes = [];
  for (let i = 0; i < numTurns; i++) {
    outcomes.push(Math.random() < missProbability);
  }
  return outcomes;
};

/**
 * Generates a boolean array indicating the turns when effects should be cleared. E.g. if clearing every 10 turns,
 * it triggers on 10th turn after all effects have been evaluated post playCard.
 */
export const getClearEffectSchedule = (
  numTurns: number,
  turnInterval: number
): boolean[] => {
  if (!numTurns || !turnInterval) {
    throw new Error('Total turn number or turn interval is not provided.');
  }

  return Array.from(
    { length: numTurns },
    (_, index) => (index + 1) % turnInterval === 0
  );
};
