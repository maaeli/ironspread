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
    screen.debug();
  });
});
