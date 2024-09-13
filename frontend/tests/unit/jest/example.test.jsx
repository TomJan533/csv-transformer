import React from 'react';
import { act, render, screen } from '@testing-library/react';
import App from '../../../src/App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),  // Mock an empty response for the file list
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders Home page on default route "/"', async () => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(<App />);
  });
  
  // Assert that the Home component is rendered
  const homeElement = screen.getByText(/Welcome to the Home Page/i);
  expect(homeElement).toBeInTheDocument();
});
