import { parse_account_json_to_table } from './data';
import { TableProps} from './Table';



describe('parse_account_json_to_table', () => {
  test('parses json into header and table data', () => {
  const example_json_balances = JSON.stringify({"account_names":
            {"names":["bank a","bank b","bank c"]},
        "balances":[
        {"date":"May 2018","balances":[1.3,5.6,7.8]},
        {"date":"June 2018","balances":[-0.3,2.1,4.0]}
        ]
      });
    const {
      header,
      content,
    } = parse_account_json_to_table(example_json_balances) as TableProps;
    expect(header).toEqual(['bank a','bank b','bank c']);
    expect(content).toEqual([['1.3','5.6','7.8'],['-0.3','2.1','4.0']]);
  });
  test('extra entries are fine', () => {
  const example_json_balances = JSON.stringify({"account_names":
            {"names":["bank a","bank b","bank c"], "dummy": "dummy"},
        "balances":[
        {"date":"May 2018","balances":[1.3,5.6,7.8], "dummy": "dummy"},
        {"date":"June 2018","balances":[-0.3,2.1,4.0]}
        ],
        "dummy": "dummy"
      });
    const {
      header,
      content,
    } = parse_account_json_to_table(example_json_balances) as TableProps;
    expect(header).toEqual(['bank a','bank b','bank c']);
    expect(content).toEqual([['1.3','5.6','7.8'],['-0.3','2.1','4.0']]);
  });
  test('throws SyntaxError if passed empty string', () => {
    expect(() => { parse_account_json_to_table("") }).toThrow(SyntaxError);
  });
  test('throws SyntaxError if passed non-json string', () => {
    expect(() => { parse_account_json_to_table("this is not JSON") }).toThrow(SyntaxError);
  });
  test('throws TypeError if account_names.names is missing', () => {
    const example_json_balances = JSON.stringify({
          "balances":[
          {"date":"May 2018","balances":[1.3,5.6,7.8]},
          {"date":"June 2018","balances":[-0.3,2.1,4.0]}
          ]
        });
    expect(() => { parse_account_json_to_table(example_json_balances) }).toThrow(TypeError);
  });
  test('throws TypeError if a balances entry is missing', () => {
    const example_json_balances = JSON.stringify({"account_names":
              {"names":["bank a","bank b","bank c"]},
        });
    expect(() => { parse_account_json_to_table(example_json_balances) }).toThrow(TypeError);
  });
  test('throws TypeError if a balance is missing the balance field', () => {
    const example_json_balances = JSON.stringify({"account_names":
              {"names":["bank a","bank b","bank c"]},
          "balances":[
          {"date":"May 2018","balances":[1.3,5.6,7.8]},
          {"date":"June 2018",}
          ]
        });
    expect(() => { parse_account_json_to_table(example_json_balances) }).toThrow(TypeError);
  });
});
