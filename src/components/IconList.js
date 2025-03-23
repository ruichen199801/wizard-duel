import { icon, click } from './utils/assetPaths';

const IconList = ({
  setShowLevelEffectModal,
  setShowLogModal,
  setShowSettingsModal,
  setShowHelpModal,
  playAudio,
}) => {
  const handleLevelEffectClick = () => {
    setShowLevelEffectModal(true);
    playAudio(click);
  };

  const handleLogClick = () => {
    setShowLogModal(true);
    playAudio(click);
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    playAudio(click);
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
    playAudio(click);
  };

  return (
    <div className='d-flex justify-content-end'>
      <div className='d-inline-block px-1 bg-panel'>
        <div className='d-flex m-2'>
          <img
            src={icon.effect}
            className='me-3 icon'
            alt='effect'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Level effect'
            onClick={handleLevelEffectClick}
          />

          <img
            src={icon.log}
            className='me-3 icon'
            alt='log'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Battle log'
            onClick={handleLogClick}
          />

          <img
            src={icon.settings}
            className='me-3 icon'
            alt='settings'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Settings'
            onClick={handleSettingsClick}
          />

          <img
            src={icon.help}
            className='icon'
            alt='help'
            data-bs-toggle='tooltip'
            data-bs-placement='bottom'
            data-bs-title='Help'
            onClick={handleHelpClick}
          />
        </div>
      </div>
    </div>
  );
};

export default IconList;
