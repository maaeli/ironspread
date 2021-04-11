"""Step defintions for testing backend API."""

import json
from subprocess import Popen
from pathlib import PurePath
import pytest
import requests

from pytest_bdd import scenarios, given, when, then, parsers

this_file_as_path = PurePath(__file__)
server_application_path = PurePath(
    this_file_as_path.parent.parent.parent.parent,
    "backend",
    "target",
    "debug",
    "ironspread",
)

# Scenarions
scenarios("../features/starting_app.feature")

# Fixtures


# Given Steps
@given("the App has been started")
def start_backend(backend, frontend):
    """Minimal precondition for end to end test"""
    pass


# When Steps
@when("I look at the GUI")
def get_account_data(frontend):
    pass


# Then Steps
@then("I see a table")
def search_results(frontend):
    pass
