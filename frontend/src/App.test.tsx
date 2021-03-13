/* eslint-disable max-lines-per-function */
import '@testing-library/jest-dom';
import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App, { storiesReducer, StoriesAction } from './App';
import { article } from './Item';

jest.mock('axios');

const reactAuthor = 'Jordan Walke';
const reduxAuthor = 'Dan Abramov, Andrew Clark';
const jsAuthor = 'Brendan Eich';

const storyOne: article = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: reactAuthor,
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo: article = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: reduxAuthor,
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const anotherStory = {
  title: 'Javascript',
  url: 'http://en.wikipedia.org/wiki/Javascript',
  author: jsAuthor,
  num_comments: 15,
  points: 10,
  objectId: 3,
};

const stories = [storyOne, storyTwo];

const mockSwitch = (
  url: string,
): Promise<Record<string, unknown>> | undefined => {
  if (url.includes('react')) {
    return Promise.resolve({
      data: {
        hits: stories,
      },
    });
  } else if (url.includes('account_data')) {
    return Promise.resolve({
      data: {
        account_names: ['al', 'bl'],
        balances: [
          { date: 'one', balances: [4, 1.1] },
          { date: 'two', balances: [5, 8.9] },
        ],
      },
    });
  } else if (url.includes('JavaScript')) {
    return Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });
  }
  return undefined;
};

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action: StoriesAction = { type: 'REMOVE_STORIES', payload: storyOne };
    const state = { stories: stories, isLoading: false, isError: false };
    const newState = storiesReducer(state, action);
    const expectedState = {
      stories: [storyTwo],
      isLoading: false,
      isError: false,
    };
    expect(newState).toStrictEqual(expectedState);
  });
});

describe('App', () => {
  test('succeeds fetching data', async () => {
    const axiosMock = (axios.get as jest.Mock).mockImplementation(mockSwitch);

    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
    expect(screen.queryByText(/Waiting for data/)).toBeInTheDocument();
    await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(2));
    expect(screen.queryByText(/Loading/)).toBeNull;
    expect(screen.queryByText(/Waiting for data/)).not.toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(3);
  });

  test('fails fetching stories data', async () => {
    const axiosMock = (axios.get as jest.Mock).mockImplementation(
      (url: string) => {
        if (url.includes('react')) {
          return Promise.reject(new Error('Async error'));
        }
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
      },
    );

    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(2));
    expect(screen.queryByText(/Loading/)).toBeNull;
    expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
  });

  test('removes a story', async () => {
    const axiosMock = (axios.get as jest.Mock).mockImplementation(mockSwitch);

    render(<App />);

    await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(2));
    expect(screen.getByText(reactAuthor)).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(3);

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.queryByText(reactAuthor)).toBeNull();
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  test('searches for specific stories', async () => {
    const axiosMock = (axios.get as jest.Mock).mockImplementation(mockSwitch);

    render(<App />);

    await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(2));
    expect(screen.queryByText('react')).toBeInTheDocument();
    expect(screen.queryByText('JavaScript')).toBeNull();
    expect(screen.queryByText(reactAuthor)).toBeInTheDocument();
    expect(screen.queryByText(reduxAuthor)).toBeInTheDocument();
    expect(screen.queryByText(jsAuthor)).toBeNull();

    fireEvent.change(screen.getByDisplayValue('react'), {
      target: {
        value: 'JavaScript',
      },
    });
    expect(screen.queryByText('react')).toBeNull();
    await waitFor(() =>
      expect(screen.queryByText('JavaScript')).toBeInTheDocument(),
    );
    fireEvent.submit(screen.getByText('Submit'));
    expect(screen.queryByText('JavaScript')).toBeInTheDocument();
    await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(3));
    expect(screen.queryByText(reactAuthor)).toBeNull();
    expect(screen.queryByText(reduxAuthor)).toBeNull();
    expect(screen.queryByText(jsAuthor)).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
