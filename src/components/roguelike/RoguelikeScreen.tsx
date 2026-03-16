import { useBsTooltip } from '../../hooks/useBsTooltip';
import { ControlPanel } from './ControlPanel';
import { NodeOption } from './NodeOption';

export const RoguelikeScreen = () => {
  useBsTooltip();

  return (
    <div className='container-fluid vh-100 d-flex flex-column bg-roguelike'>
      <div className='row pt-2 bg-roguelike-navbar'>
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

      <div className='row flex-grow-1 pb-2'>
        <div className='col-10'>
          <div className='container d-flex justify-content-center mt-4'>
            <div className='d-flex gap-4'>
              <NodeOption
                title='Event'
                description='Ashes glow in the forgotten nest of the Phoenix.'
                imageUrl='images/events/phoenix-nest.png'
                onClick={() => {}}
              />
              <NodeOption
                title='Battle'
                description='An armored beast blocks your path.'
                imageUrl='images/events/beast-fight.png'
                onClick={() => {}}
              />
              <NodeOption
                title='Treasure'
                description='A glimmering chest lies beneath ancient roots.'
                imageUrl='images/events/treasure-grove.png'
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
        <div className='col-2'>Column</div>
      </div>
    </div>
  );
};
