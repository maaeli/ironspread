/* eslint-disable max-lines-per-function */
import '@testing-library/jest-dom';
import React from 'react';
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('axios');

const mockSwitch = (
  url: string,
): Promise<Record<string, unknown>> | undefined => {
  if (url.includes('account_data')) {
    return Promise.resolve({
      data: {
        account_names: ['al', 'bl'],
        balances: [
          { date: 'one', balances: [4, 1.1] },
          { date: 'two', balances: [5, 8.9] },
        ],
      },
    });
  }
  return undefined;
};

describe('App', () => {
  test('succeeds fetching data', async () => {
    const axiosMock = (axios.get as jest.Mock).mockImplementation(mockSwitch);

    render(<App />);
    expect(screen.queryByText(/Waiting for data/)).toBeInTheDocument();
    await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(/Waiting for data/)).not.toBeInTheDocument();
  });
});
