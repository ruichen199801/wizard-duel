import { icon } from '../../utils/assetUtils';

export const ControlPanel = () => {
  return (
    <div className='d-flex justify-content-end'>
      <div className='d-inline-block px-1 rounded bg-panel'>
        <div className='d-flex m-2'>
          <img
            src={icon.decklist}
            className='me-3 icon'
            alt='deck'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Deck'
          />

          <img
            src={icon.artifacts}
            className='me-3 icon'
            alt='artifacts'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Artifacts'
          />

          <img
            src={icon.settings}
            className='me-3 icon'
            alt='settings'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Settings'
          />

          <img
            src={icon.help}
            className='icon'
            alt='help'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Help'
          />
        </div>
      </div>
    </div>
  );
};
