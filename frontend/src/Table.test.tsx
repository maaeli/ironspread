import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from './Table';

const contentheader = ['Alabel', 'Blabel', 'Clabel'];
const content = [
  ['A1', 'B1', 'C1'],
  ['A2', 'B2', 'C2'],
];

describe('Table', () => {
  test('render all properties', () => {
    render(<Table content={content} header={contentheader} />);
    expect(screen.getByText('Alabel')).toBeInTheDocument();
    expect(screen.getByText('Blabel')).toBeInTheDocument();
    expect(screen.getByText('Clabel')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('C1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('C2')).toBeInTheDocument();
  });
});
