import '@testing-library/jest-dom';
import React from 'react';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App, { storiesReducer, Action } from './App';
import { article } from './Item';

jest.mock('axios');

const storyOne: article = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
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
    screen.debug();

    await act(() => promise.then());
    screen.debug();
  });
});
