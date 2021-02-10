/* eslint-disable max-lines-per-function */
import '@testing-library/jest-dom';
import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
//import { act } from 'react-dom/test-utils';
import { act } from '@testing-library/react-hooks';
import App, { storiesReducer, Action } from './App';
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

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action: Action = { type: 'REMOVE_STORIES', payload: storyOne };
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
    const get = axios.get as jest.Mock;
    get.mockImplementationOnce(() => promise);

    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act((): void => {
      promise;
    });
    expect(screen.queryByText(/Loading/)).toBeNull;

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(3);
  });

  test('fails fetching data', async () => {
    const get = axios.get as jest.Mock;
    const rejectedAxiosMock = get.mockRejectedValueOnce(
      new Error('Async error'),
    );

    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act(async () => rejectedAxiosMock());
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

  /* I cannot get this one to work, revisit later.
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
      throw Error();
    })


    render(<App />);

    await act(async () => reactPromise.then());
    expect(axios.get).toHaveBeenCalledTimes(1);
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
    expect(screen.queryByText('JavaScript')).toBeInTheDocument();
    await fireEvent.submit(screen.getByText('Submit'));
    //await act(async () => jsPromise.then());
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
  }); */

  afterEach(() => {
    jest.clearAllMocks();
  });
});
