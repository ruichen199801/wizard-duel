import { PlayerID } from 'boardgame.io';

import { Card } from './cards';
import { Player } from './player';

export interface GlobalEffectProps {
  // Level-related effects
  drawMode?: DrawMode;
  showEnemyHand?: boolean;
  shouldMiss?: boolean[];
  shouldClearEffects?: boolean[];
  loseHpAmount?: number;

  // Power-related effects
  shouldPlayerMiss?: boolean[];
}

export interface WizardDuelState {
  readonly players: Record<PlayerID, Player>;
  readonly level: string;
  deck: Card[];
  globalEffects: GlobalEffectProps;
}

export enum DrawMode {
  draw = 'draw',
  select = 'select',
}
