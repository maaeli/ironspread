"""Step defintions for testing backend API."""

import json
from subprocess import Popen
from pathlib import PurePath
import pytest
import requests

from pytest_bdd import scenarios, given, when, then, parsers


# Scenarions
scenarios("../features/backend_provides_data.feature")

# Fixtures


# Given Steps
@given("the Backend API is running", target_fixture="response")
def start_backend(backend):
    """Minimal precondition for backend test"""
    return dict(response="")


# When Steps
@when(parsers.parse('I ask for "{api_endpoint}"'))
def get_account_data(response, api_endpoint):
    account_data = requests.get("http://localhost:8081/account_data")
    response["response"] = account_data


# Then Steps
@then(parsers.parse('the result contains "{key}": {value}'))
def search_results(response, key, value):
    response_json = response["response"].json()
    assert response_json[key] == json.loads(value)


@then(parsers.parse("the only keys in the result are {keys}"))
def search_results_keys(response, keys):
    response_json = response["response"].json()
    assert set(response_json.keys()) == set(json.loads(keys))
