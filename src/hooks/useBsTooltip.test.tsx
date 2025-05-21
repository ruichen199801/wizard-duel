import { render, renderHook, screen } from '@testing-library/react';
import { Tooltip } from 'bootstrap';
import { useBsTooltip } from './useBsTooltip';

jest.mock('bootstrap', () => ({
  Tooltip: jest.fn(),
}));

describe('useBsTooltip', () => {
  it('initializes tooltip', () => {
    render(
      <>
        <button data-bs-toggle='tooltip' title='Tooltip 1'>
          Btn 1
        </button>
        <div data-bs-toggle='tooltip' title='Tooltip 2'>
          Div 2
        </div>
      </>
    );

    renderHook(() => useBsTooltip());

    const btn = screen.getByText('Btn 1');
    const div = screen.getByText('Div 2');

    expect(Tooltip).toHaveBeenCalledTimes(2);
    expect(Tooltip).toHaveBeenCalledWith(btn);
    expect(Tooltip).toHaveBeenCalledWith(div);
  });
});
