import React from 'react';
import axios from 'axios';
import Table, { TableProps } from './Table';
import './App.css';
import { parse_account_json_to_table, AccountBalancesFromServer } from './data';

type AccountDataAction =
  | { type: 'ACCOUNT_DATA_FETCH_INIT' }
  | { type: 'ACCOUNT_DATA_FETCH_SUCCESS'; payload: AccountBalancesFromServer };

type AccountDataState = {
  tableData: TableProps;
  isLoading: boolean;
  isError: boolean;
};

const accountDataReducer = (
  state: AccountDataState,
  action: AccountDataAction,
): AccountDataState => {
  switch (action.type) {
    case 'ACCOUNT_DATA_FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'ACCOUNT_DATA_FETCH_SUCCESS':
      console.log(action.payload);
      const tableData = parse_account_json_to_table(action.payload);
      console.log(tableData);
      return { ...state, tableData, isLoading: false, isError: false };
    default:
      throw new Error();
  }
};

const contentheader = ['Alabel', 'Blabel', 'Clabel'];
const content = [
  ['A1', 'B1', 'C1'],
  ['A2', 'B2', 'C2'],
];

/* eslint-disable max-lines-per-function */

const App = (): JSX.Element => {
  const [account_data, dispatch_account_data] = React.useReducer(
    accountDataReducer,
    {
      tableData: { header: contentheader, content: content },
      isLoading: true,
      isError: false,
    },
  );

  const demo = '';

  const handleFetchAccountData = React.useCallback(() => {
    dispatch_account_data({ type: 'ACCOUNT_DATA_FETCH_INIT' });
    axios
      .get('http://localhost:8081/account_data')
      .then((result) => {
        dispatch_account_data({
          type: 'ACCOUNT_DATA_FETCH_SUCCESS',
          payload: result.data,
        });
      })
      .catch(() => {
        console.log('Not yet implemented');
      });
  }, [demo as string]);

  React.useEffect(() => {
    handleFetchAccountData();
  }, [demo as string]);

  return (
    <div className="container">
      {account_data.isLoading ? (
        <p>Waiting for data ...</p>
      ) : (
        <>
          <Table
            content={account_data.tableData.content}
            header={account_data.tableData.header}
          />
        </>
      )}
    </div>
  );
};

/* eslint-enable max-lines-per-function */

export default App;
