import React from 'react';
import ReactDom from 'react-dom';
import { render, screen } from '@testing-library/react';
import App, {
  storiesReducer,
  StoriesState,
  Action,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App';

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
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

describe('something truthy and falsy', () => {
  test('true to be true', () => {
    expect(true).toBe(true);
  });
  test('false to be false', () => {
    expect(false).toBe(false);
  });
});
