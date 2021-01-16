import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './SearchForm';

describe('SearchForm', () => {
  const TestSearchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  test('renders the input field with its value', () => {
    render(<SearchForm {...TestSearchFormProps} />);
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  test('renders the correct label', () => {
    render(<SearchForm {...TestSearchFormProps} />);
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test('calls onSearchInput on input field change', () => {
    render(<SearchForm {...TestSearchFormProps} />);
    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' },
    });
    expect(TestSearchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  test('calls onSearchSubmit on button submit click', () => {
    render(<SearchForm {...TestSearchFormProps} />);
    fireEvent.submit(screen.getByRole('button'));
    expect(TestSearchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});
