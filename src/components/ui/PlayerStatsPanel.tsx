import { useState } from 'react';
import { EffectType, Player } from '../../core/models';
import {
  AnimationProps,
  getAvatarForLevel,
  getEnemyName,
  icon,
} from '../../utils';

export const AVATAR_HEIGHT = 125;
export const AVATAR_WIDTH = 125;
export const AVATAR_SMALL_SCALE = 0.9;
export const AVATAR_MEDIUM_SCALE = 1.1;

export interface PlayerStatsPanelProps {
  readonly player: Player;
  readonly level?: string;
  readonly showCardAnimation: boolean;
  readonly cardAnimationData?: AnimationProps;
}

/**
 * @group Components
 */
export const PlayerStatsPanel = ({
  player,
  level,
  showCardAnimation,
  cardAnimationData,
}: PlayerStatsPanelProps) => {
  const [isStatsIconsHovered, setIsStatsIconsHovered] = useState(false);

  const height = AVATAR_HEIGHT * AVATAR_MEDIUM_SCALE;
  const width = AVATAR_WIDTH * AVATAR_MEDIUM_SCALE;

  const formatValueDisplay = (
    currentValue: number,
    maxValue: number
  ): string => {
    if (currentValue >= maxValue) {
      return `${currentValue} (+${currentValue - maxValue})`;
    } else {
      return `${currentValue} (-${maxValue - currentValue})`;
    }
  };

  return (
    <div className='d-inline-block p-2 rounded bg-panel'>
      <div className='d-flex align-items-center'>
        <div
          className='me-3 position-relative'
          data-bs-toggle='tooltip'
          data-bs-placement={player.id === '0' ? 'top' : 'bottom'}
          data-bs-title={player.id === '0' ? 'You' : getEnemyName(level)}
        >
          {/* Player avatar */}
          <img
            src={getAvatarForLevel(player.id, level)}
            alt='avatar'
            height={height}
            width={width}
          />

          {/* Image overlay for level effect */}
          {player.effects.some((e) => e.type === EffectType.freeze) && (
            <img src={icon.ice} alt='ice' className='overlay-ice' />
          )}

          {/* Animation overlay for card effect */}
          {showCardAnimation && cardAnimationData && (
            <img
              src={cardAnimationData.path}
              alt={cardAnimationData.type}
              className={`vfx-${cardAnimationData.type}`}
            />
          )}
        </div>

        {/* Player stats (hp, atk, def) */}
        <div
          className='d-flex flex-column'
          onMouseEnter={() => setIsStatsIconsHovered(true)}
          onMouseLeave={() => setIsStatsIconsHovered(false)}
        >
          <div className='d-flex align-items-center mb-2'>
            <img src={icon.hp} className='me-2 pstats-icon' alt='hp' />
            <span className='fw-semibold pstats-text pstats-panel-width'>
              {player.hp}
              {isStatsIconsHovered && `/${player.maxHp}`}
            </span>
          </div>

          <div className='d-flex align-items-center mb-2'>
            <img src={icon.atk} className='me-2 pstats-icon' alt='atk' />
            <span
              className={`fw-semibold pstats-text ${
                player.atk < 0 ? 'text-danger' : ''
              }`}
            >
              {isStatsIconsHovered
                ? formatValueDisplay(player.atk, player.baseAtk)
                : player.atk}
            </span>
          </div>

          <div className='d-flex align-items-center'>
            <img src={icon.def} className='me-2 pstats-icon' alt='def' />
            <span
              className={`fw-semibold pstats-text ${
                player.def < 0 ? 'text-danger' : ''
              }`}
            >
              {isStatsIconsHovered
                ? formatValueDisplay(player.def, player.baseDef)
                : player.def}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
