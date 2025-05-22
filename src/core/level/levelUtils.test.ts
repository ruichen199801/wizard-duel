import { Fireball1, Fireball2, Fireball3 } from '../../model/cards';
import {
  generateAttackOutcomes,
  getClearEffectSchedule,
  randomPopulateHand,
} from './levelUtils';

describe('levelUtils', () => {
  describe('randomPopulateHand', () => {
    const options = [Fireball1, Fireball2, Fireball3];
    const probabilities = [0.5, 0.3, 0.2];

    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.1); // 0.1 < 0.5, so first option is always selected
    });

    afterEach(() => {
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('throws if options and probabilities lengths mismatch', () => {
      expect(() => randomPopulateHand(options, [0.5, 0.3], 3)).toThrow();
    });

    it('selects expected card when random is mocked', () => {
      const hand = randomPopulateHand(options, probabilities, 3);
      expect(hand).toHaveLength(3);
      hand.forEach((card) => {
        expect(card).toEqual(options[0]);
      });
    });
  });

  describe('generateAttackOutcomes', () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('throws if numTurns or missProbability is falsy', () => {
      expect(() => generateAttackOutcomes(0, 0.5)).toThrow();
      expect(() => generateAttackOutcomes(5, 0)).toThrow();
    });

    it('marks outcome as miss if random < missProbability', () => {
      const outcomes = generateAttackOutcomes(2, 0.8); // 0.5 < 0.8
      expect(outcomes).toHaveLength(2);
      expect(outcomes).toEqual([true, true]);
    });

    it('marks outcome as hit if random >= missProbability', () => {
      const outcomes = generateAttackOutcomes(3, 0.2); // 0.5 >= 0.2
      expect(outcomes).toHaveLength(3);
      expect(outcomes).toEqual([false, false, false]);
    });
  });

  describe('getClearEffectSchedule', () => {
    it('throws if numTurns or turnInterval is falsy', () => {
      expect(() => getClearEffectSchedule(0, 10)).toThrow();
      expect(() => getClearEffectSchedule(5, 0)).toThrow();
    });

    it('marks correct turns for clearing effects', () => {
      const schedule = getClearEffectSchedule(10, 3);
      expect(schedule).toHaveLength(10);
      expect(schedule).toEqual([
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
      ]);
    });
  });
});
