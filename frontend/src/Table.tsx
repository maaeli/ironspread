import React, { FunctionComponent, ReactElement } from 'react';

type TableProps = {
  header: Array<string>;
  content: Array<Array<string>>;
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type TableHeaderProps = {
  header: Array<string>;
};

const TableHeader: FunctionComponent<TableHeaderProps> = ({
  header,
}: TableHeaderProps): ReactElement => (
  <thead key="head">
    <tr key="labels">
      <td key="corner1"></td>
      {header.map((cell, columnNumber) => (
        <td key={'label ' + columnNumber}>{alphabet[columnNumber]}</td>
      ))}
    </tr>
    <tr key="headers">
      <td key="corner2"></td>
      {header.map((cell, columnNumber) => (
        <td key={'header ' + columnNumber}>{cell}</td>
      ))}
    </tr>
  </thead>
);

const Table: FunctionComponent<TableProps> = ({
  header,
  content,
}: TableProps): ReactElement => (
  <table key="table">
    <TableHeader header={header} />
    <tbody key="body">
      {content.map((row, rowNumber) => (
        <tr key={'row' + rowNumber}>
          <td>{rowNumber + 1}</td>
          {row.map((cell, columnNumber) => (
            <td key={'cell ' + rowNumber + ',' + columnNumber}>
              <input
                type="text"
                value={cell}
                key={rowNumber + ',' + columnNumber}
                name="name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  console.log(rowNumber, columnNumber, event.target.value)
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
export { TableProps };
