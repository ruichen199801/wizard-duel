import { fireEvent, render, screen } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  test('renders with title, message, and buttons', () => {
    render(
      <ConfirmModal
        isOpen={true}
        title='Confirm Action'
        message='Confirm this?'
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Confirm this?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('calls onConfirm and onCancel when buttons are clicked', () => {
    render(
      <ConfirmModal
        isOpen={true}
        message='Confirm this?'
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
