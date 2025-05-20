import { ReactNode } from 'react';

interface ModalProps {
  readonly title?: string; // either title or customHeader should be provided
  readonly isOpen: boolean;
  readonly children: ReactNode;

  readonly onClose?: () => void;
  readonly onBackdropClick?: () => void;

  readonly scrollable?: boolean;
  readonly modalSizeClass?: string;
  readonly heightClass?: string;

  readonly customHeader?: ReactNode;
  readonly footer?: ReactNode;
}

export const Modal = ({
  title,
  isOpen,
  children,
  onClose,
  onBackdropClick,
  scrollable = false,
  modalSizeClass = '',
  heightClass = '',
  customHeader,
  footer,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={`modal ${modalSizeClass} fade show d-block`}
        data-testid='modal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
        onClick={onBackdropClick}
      >
        <div
          className={`modal-dialog modal-dialog-centered ${
            scrollable ? 'modal-dialog-scrollable' : ''
          }`}
          data-testid='modal-dialog'
        >
          <div
            className={`modal-content bg-modal ${heightClass}`}
            data-testid='modal-content'
          >
            <div className='modal-header border-0' data-testid='modal-header'>
              {customHeader ? (
                customHeader
              ) : (
                <h4 className='modal-title w-100 text-center font-bold'>
                  {title}
                </h4>
              )}

              {onClose && (
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                  onClick={onClose}
                ></button>
              )}
            </div>

            <div className='modal-body' data-testid='modal-body'>
              {children}
            </div>

            {footer && (
              <div
                className='modal-footer border-0 justify-content-end'
                data-testid='modal-footer'
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className='modal-backdrop fade show'
        data-testid='modal-backdrop'
      ></div>
    </>
  );
};
