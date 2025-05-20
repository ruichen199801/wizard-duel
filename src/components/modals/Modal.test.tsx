import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    children: <div>Modal Content</div>,
  };

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders with a title when customHeader is not provided', () => {
    render(<Modal {...defaultProps} title='Test Title' />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with a custom header when provided', () => {
    render(
      <Modal
        {...defaultProps}
        customHeader={<div data-testid='custom-header'>Custom Header</div>}
      />
    );
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  it('renders children inside modal body', () => {
    render(<Modal {...defaultProps} />);
    const body = screen.getByTestId('modal-body');
    expect(body).toHaveTextContent('Modal Content');
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        {...defaultProps}
        footer={<div data-testid='custom-footer'>Footer Content</div>}
      />
    );
    const footer = screen.getByTestId('modal-footer');
    expect(footer).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer')).toHaveTextContent(
      'Footer Content'
    );
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal {...defaultProps} title='Closable Modal' onClose={onClose} />
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onBackdropClick when modal is clicked', () => {
    const onBackdropClick = jest.fn();
    render(<Modal {...defaultProps} onBackdropClick={onBackdropClick} />);
    fireEvent.click(screen.getByTestId('modal'));
    expect(onBackdropClick).toHaveBeenCalled();
  });

  it('applies modalSizeClass and heightClass correctly', () => {
    render(
      <Modal
        {...defaultProps}
        modalSizeClass='modal-lg'
        heightClass='custom-height'
      />
    );
    expect(screen.getByTestId('modal')).toHaveClass('modal-lg');
    expect(screen.getByTestId('modal-content')).toHaveClass('custom-height');
  });

  it('applies scrollable class when scrollable is true', () => {
    render(<Modal {...defaultProps} scrollable />);
    expect(screen.getByTestId('modal-dialog')).toHaveClass(
      'modal-dialog-scrollable'
    );
  });

  it('renders modal backdrop', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
  });
});
