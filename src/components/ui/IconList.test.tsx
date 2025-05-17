import { fireEvent, render, screen } from '@testing-library/react';
import { click } from '../../utils/assetUtils';
import { IconList } from './IconList';

describe('IconList', () => {
  test('triggers modals and plays audio on icon click', () => {
    const setShowLevelEffectModal = jest.fn();
    const setShowLogModal = jest.fn();
    const setShowSettingsModal = jest.fn();
    const setShowHelpModal = jest.fn();
    const playAudio = jest.fn();

    render(
      <IconList
        setShowLevelEffectModal={setShowLevelEffectModal}
        setShowLogModal={setShowLogModal}
        setShowSettingsModal={setShowSettingsModal}
        setShowHelpModal={setShowHelpModal}
        playAudio={playAudio}
      />
    );

    // alt to setter map
    const icons = {
      effect: setShowLevelEffectModal,
      log: setShowLogModal,
      settings: setShowSettingsModal,
      help: setShowHelpModal,
    };

    for (const [alt, setter] of Object.entries(icons)) {
      const icon = screen.getByAltText(alt);
      fireEvent.click(icon);
      expect(setter).toHaveBeenCalledWith(true);
      expect(playAudio).toHaveBeenCalledWith(click);
    }
  });
});
