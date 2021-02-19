import { TableProps } from './Table';

type AccountBalances = {
  balances: Array<number>;
};

type account_names = {
  names: Array<string>,
}
type AccountBalancesFromServer = {
  account_names: account_names,
  balances: Array<AccountBalances>
}

const parse_account_json_to_table = (input_structure: AccountBalancesFromServer): TableProps => {
  const account_names = input_structure.account_names.names;
  const balances = input_structure.balances
    .map((entry: AccountBalances) => entry.balances)
    .map((numberArray: Array<number>) =>
      numberArray.map((x: number) => x.toFixed(1)),
    );
  return { header: account_names, content: balances };
};

export { parse_account_json_to_table };
