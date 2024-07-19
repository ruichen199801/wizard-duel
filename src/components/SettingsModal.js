const SettingsModal = ({
  showSettingsModal,
  setShowSettingsModal,
  audioToggleMute,
}) => {
  if (!showSettingsModal) {
    return null;
  }

  return (
    <>
      <div
        className='modal modal-sm fade show d-block'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content bg-modal font-lora-semibold'>
            <div className='modal-header border-0'>
              <h3 className='modal-title w-100 font-cinzel-semibold text-center ms-4'>Settings</h3>
              <button
                type='button'
                class='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={() => setShowSettingsModal(false)}
              ></button>
            </div>

            <div className='modal-body'>
              <div className='d-flex flex-column align-items-center'>
                <button
                  type='button'
                  className='btn btn-outline-dark w-100 mb-2'
                >
                  Mute Sound
                </button>
                <button
                  type='button'
                  className='btn btn-outline-dark w-100 mb-2'
                >
                  Mute Music
                </button>
                <button
                  type='button'
                  className='btn btn-outline-dark w-100 mb-2'
                >
                  Show Battle Log
                </button>
                <button
                  type='button'
                  className='btn btn-outline-dark w-100 mb-2'
                >
                  Exit to Title
                </button>
                <button type='button' className='btn btn-outline-dark w-100'>
                  Restart Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};

export default SettingsModal;
