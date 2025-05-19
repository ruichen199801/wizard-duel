import { ReactNode } from 'react';

interface BaseModalProps {
  readonly title: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly modalSizeClass?: string;
  readonly heightClass?: string;
}

export const BaseModal = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  modalSizeClass = '',
  heightClass = '',
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={`modal ${modalSizeClass} fade show d-block`}
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered'>
          <div className={`modal-content bg-modal ${heightClass}`}>
            <div className='modal-header border-0'>
              <h4 className='modal-title w-100 text-center font-bold'>
                {title}
              </h4>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={onClose}
              ></button>
            </div>

            <div className='modal-body'>{children}</div>

            {footer && (
              <div className='modal-footer border-0 justify-content-end'>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};
