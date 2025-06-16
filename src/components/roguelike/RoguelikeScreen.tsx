import { useBsTooltip } from '../../hooks/useBsTooltip';
import { ControlPanel } from './ControlPanel';

export const RoguelikeScreen = () => {
  useBsTooltip();

  return (
    <div className='container-fluid vh-100 d-flex flex-column bg-menu'>
      <div className='row bg-info pt-2'>
        <div className='col-3'>Column</div>
        <div className='col-6'>
          <h4 className='text-center font-bold justify-content-center'>
            Stage 1: Tribal Canyon
          </h4>
        </div>
        <div className='col-3'>
          <ControlPanel />
        </div>
      </div>

      <div className='row flex-grow-1 bg-warning pb-2'>
        <div className='col-9'>Column</div>
        <div className='col-3'>Column</div>
      </div>
    </div>
  );
};
