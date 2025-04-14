import { useState } from 'react';
import { icon } from '../../utils/assets';
import { EffectGroupName } from '../../data/cardEffects';

const EffectStack = ({ opponentEffects, playerEffects, showEffectStack }) => {
  const fxListItemStyle =
    'list-group-item bg-panel p-0 px-1 border-0 fxstack-width';
  const fxIconStyle = 'ms-1 me-2 mb-1';

  // Render compact mode when the number of effects is large enough to overflow the panel.
  const isCompactDisplay = opponentEffects.length + playerEffects.length > 11;
  const [isPlayerCompactFxHovered, setIsPlayerCompactFxHovered] =
    useState(false);
  const [isEnemyCompactFxHovered, setIsEnemyCompactFxHovered] = useState(false);

  // Sort by group first (buff then debuff), then name (group same non-unique effects together)
  const sortEffects = (effects) => {
    return effects.sort((a, b) => {
      if (a.group === 'buff' && b.group === 'debuff') {
        return -1;
      } else if (a.group === 'debuff' && b.group === 'buff') {
        return 1;
      } else if (a.group === b.group) {
        if (a.text < b.text) {
          return -1;
        } else if (a.text > b.text) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });
  };

  const renderFxStack = (effects) => {
    return (
      <ul className='list-group'>
        {sortEffects([...effects]).map((effect, index) => (
          <li key={index} className={fxListItemStyle}>
            {effect.text && effect.group ? (
              <>
                <img
                  src={icon[effect.group]}
                  className={fxIconStyle}
                  alt='effect'
                />
                <span className='fw-semibold'>{effect.text}</span>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    );
  };

  const renderCompactFxStack = (effects) => {
    const hasBuff = effects.some((e) => e.group === EffectGroupName.buff);
    const hasDebuff = effects.some((e) => e.group === EffectGroupName.debuff);
    return (
      <ul className='list-group'>
        {hasBuff &&
          getCompactFxStackByGroup(
            effects.filter((e) => e.group === EffectGroupName.buff),
            EffectGroupName.buff
          )}
        {hasDebuff &&
          getCompactFxStackByGroup(
            effects.filter((e) => e.group === EffectGroupName.debuff),
            EffectGroupName.debuff
          )}
      </ul>
    );
  };

  const getCompactFxStackByGroup = (effects, effectGroupName) => {
    return (
      <li className={fxListItemStyle}>
        <img
          src={icon[effectGroupName]}
          className={fxIconStyle}
          alt={effectGroupName}
        />
        <span className='fw-semibold'>
          {formatCompactFxText(effects[0].abbrevText, effects.length)}
        </span>
      </li>
    );
  };

  const formatCompactFxText = (text, count) =>
    count === 1 ? text : `${text} + ${count - 1} More`;

  return (
    showEffectStack && (
      <div className='d-flex flex-column h-100 justify-content-between'>
        <div
          className='fxstack-mb'
          onMouseEnter={() => setIsEnemyCompactFxHovered(true)}
          onMouseLeave={() => setIsEnemyCompactFxHovered(false)}
        >
          {isCompactDisplay && !isEnemyCompactFxHovered
            ? renderCompactFxStack([...opponentEffects])
            : renderFxStack([...opponentEffects])}
        </div>
        <div
          className='fxstack-mt'
          onMouseEnter={() => setIsPlayerCompactFxHovered(true)}
          onMouseLeave={() => setIsPlayerCompactFxHovered(false)}
        >
          {isCompactDisplay && !isPlayerCompactFxHovered
            ? renderCompactFxStack([...playerEffects])
            : renderFxStack([...playerEffects])}
        </div>
      </div>
    )
  );
};

export default EffectStack;
