import '@testing-library/jest-dom';

beforeAll(() => {
  // Mock HTMLMediaElement methods not implemented in JSDOM to prevent errors during tests
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: jest.fn(),
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn().mockResolvedValue(undefined),
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});
