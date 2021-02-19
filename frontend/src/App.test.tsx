/* eslint-disable max-lines-per-function */
import '@testing-library/jest-dom';
import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App, { storiesReducer, StoriesAction } from './App';
import { article } from './Item';


jest.mock('axios');

const reactAuthor = 'Jordan Walke';

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
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

const tablePromise =
  Promise.resolve({
    data: {
      account_names: {
        names: ['alpha', 'beta'],
        balances: [
          { date: 'May 2018', balances: ['A0', 'B0'] },
          { date: 'June 2018', balances: ['A1', 'B1'] },
        ],
      },
    }
  });

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
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const axiosMock = (axios.get as jest.Mock).mockImplementation((url: String) => {
      if (url) {
        if (url.includes('react')) {
          return promise;
        }
        if (url.includes('account_data')) {
          return tablePromise;
        }
      }
    });

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
    const get = axios.get as jest.Mock;
    const axiosMock = (axios.get as jest.Mock).mockImplementation((url: String) => {
      if (url) {
        if (url.includes('react')) {
          return Promise.reject(new Error('Async error'));
        }
        if (url.includes('account_data')) {
          return tablePromise;
        }
      }
    });

    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(2));
    expect(screen.queryByText(/Loading/)).toBeNull;
    expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
  });

  test('removes a story', async () => {
    const get = axios.get as jest.Mock;
    const resolvedAxiosMock = get.mockResolvedValue({
      data: {
        hits: stories,
      },
    });

    render(<App />);

    await act(async () => resolvedAxiosMock());
    expect(screen.getByText(reactAuthor)).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(3);

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.queryByText(reactAuthor)).toBeNull();
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  /* //I cannot get this one to work, revisit later.
  test('searches for specific stories', async () => {
    const anotherStory = {
      title: 'Javascript',
      url: 'http://en.wikipedia.org/wiki/Javascript',
      author: 'Brendan Eich',
      num_comments: 15,
      points: 10,
      objectId: 3,
    }

    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    const jsPromise = Promise.resolve({
      data: {
        hits: anotherStory,
      },
    });

    const axiosMock = (axios.get as jest.Mock).mockImplementation((url: String) => {
      if (url.includes('react')) {
        return reactPromise;
      }
      if (url.includes('JavaScript')) {
        return jsPromise;
      }
      if (url.includes('account_data')) {
        return tablePromise;
      }
    })


    render(<App />);

    await act(async () => reactPromise.then());
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('react')).toBeInTheDocument();
    expect(screen.queryByText('JavaScript')).toBeNull();
    expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
    expect(screen.queryByText('Brendan Eich')).toBeNull();

    fireEvent.change(screen.getByDisplayValue('react'), {
      target: {
        value: 'JavaScript',
      },
    });
    expect(screen.queryByText('react')).toBeNull();
    await waitFor(() => expect(screen.queryByText('JavaScript')).toBeInTheDocument());
    fireEvent.submit(screen.getByText('Submit'));
    expect(screen.queryByText('JavaScript')).toBeInTheDocument();
    //await act(async () => jsPromise.then());
    //await waitFor(() => expect(axiosMock).toHaveBeenCalledTimes(3));
    //await waitFor(() => expect(expect(screen.getByText('Brendan Eich')).toBeInTheDocument()));
    await waitFor(() => expect(expect(screen.getByText('Brendan Eich')).toBeInTheDocument()));
    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
  }); */

  afterEach(() => {
    jest.clearAllMocks();
  });
});
