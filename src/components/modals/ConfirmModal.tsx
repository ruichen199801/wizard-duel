import { Modal } from './Modal';

interface ConfirmModalProps {
  readonly title?: string;
  readonly isOpen: boolean;
  readonly message: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const ConfirmModal = ({
  title = 'Are you sure?',
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      heightClass='h-50'
      footer={
        <>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type='button' className='btn btn-dark' onClick={onConfirm}>
            Confirm
          </button>
        </>
      }
    >
      {message}
    </Modal>
  );
};
