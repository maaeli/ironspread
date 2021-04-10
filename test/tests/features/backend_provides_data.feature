@backend
Feature: Provide data for all accounts
  As a client,
  I want to get the complete time series for all acounts,
  so that the user can get an overview of their financial status.

  Scenario: Account names in "account_data"
    Given the Backend API is running
    When I ask for "account_data"
    Then the result contains "account_names": ["bank a","bank b","bank c"]

  Scenario: Balances in "account_data"
    Given the Backend API is running
    When I ask for "account_data"
    Then the result contains "balances": [{"date":"May 2018","balances":[1.3,5.6,7.8]},{"date":"June 2018","balances":[-0.3,2.1,4.0]}]

  Scenario: Only balances and account names in "account_data"
    Given the Backend API is running
    When I ask for "account_data"
    Then the only keys in the result are ["account_names", "balances"]
