import { parse_account_json_to_table } from './data';
import { TableProps } from './Table';

/* eslint-disable max-lines-per-function */

describe('parse_account_json_to_table', () => {
  test('parses json into header and table data', () => {
    const example_json_balances = {
      account_names: ['bank a', 'bank b', 'bank c'],
      balances: [
        { date: 'May 2018', balances: [1.3, 5.6, 7.8] },
        { date: 'June 2018', balances: [-0.3, 2.1, 4.0] },
      ],
    };
    const { header, content } = parse_account_json_to_table(
      example_json_balances,
    ) as TableProps;
    expect(header).toEqual(['bank a', 'bank b', 'bank c']);
    expect(content).toEqual([
      ['1.3', '5.6', '7.8'],
      ['-0.3', '2.1', '4.0'],
    ]);
  });
});
/* eslint-enable max-lines-per-function */
