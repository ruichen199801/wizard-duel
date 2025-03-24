import { icon } from './utils/assetPaths';

const EffectStack = ({ opponentEffects, playerEffects, showEffectStack }) => {
  const sortEffects = (effects) => {
    // Sort by group first (buff then debuff), then name (group same non-unique effects together)
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
        return 0; // Keep the original order if groups are the same but texts are different
      }
    });
  };

  // Only 10 effects can be rendered at a time without overflowing the panel.
  const renderEffectStack = (effects) => {
    return (
      <ul className='list-group'>
        {sortEffects([...effects]).map((effect, index) => (
          <li
            key={index}
            className='list-group-item bg-panel p-0 px-1 pt-1 border-0 fxstack-width'
          >
            {effect.text && effect.group ? (
              <>
                <img
                  src={icon[effect.group]}
                  className='ms-1 me-2 mb-1'
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

  return (
    showEffectStack && (
      <div className='d-flex flex-column h-100 justify-content-between'>
        <div className='fxstack-mb'>
          {renderEffectStack([...opponentEffects])}
        </div>

        <div className='fxstack-mt'>
          {renderEffectStack([...playerEffects])}
        </div>
      </div>
    )
  );
};

export default EffectStack;
