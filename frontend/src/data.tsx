import { TableProps } from './Table';

type AccountBalances = {
  balances: Array<number>;
};

const parse_account_json_to_table = (input_json: string): TableProps => {
  const parsed_input = JSON.parse(input_json);
  const account_names = parsed_input.account_names.names;
  const balances = parsed_input.balances
    .map((entry: AccountBalances) => entry.balances)
    .map((numberArray: Array<number>) =>
      numberArray.map((x: number) => x.toFixed(1)),
    );
  return { header: account_names, content: balances };
};

export { parse_account_json_to_table };
