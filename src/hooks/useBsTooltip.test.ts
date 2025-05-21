import { renderHook } from '@testing-library/react';
import { Tooltip } from 'bootstrap';
import { useBsTooltip } from './useBsTooltip';

jest.mock('bootstrap', () => ({
  Tooltip: jest.fn(),
}));

describe('useBsTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-bs-toggle="tooltip" title="Tooltip 1">Btn 1</button>
      <div data-bs-toggle="tooltip" title="Tooltip 2">Div 2</div>
    `;
  });

  it('initializes tooltip', () => {
    renderHook(() => useBsTooltip());

    const elements = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    // Expect Tooltip constructor to be called once per element
    expect(Tooltip).toHaveBeenCalledTimes(elements.length);

    elements.forEach((el, index) => {
      expect(Tooltip).toHaveBeenNthCalledWith(index + 1, el);
    });
  });
});
