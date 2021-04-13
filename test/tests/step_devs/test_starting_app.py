"""Step defintions for testing backend API."""

import json
from subprocess import Popen
from pathlib import PurePath
import pytest
import requests
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By

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
def start_app(backend, frontend):
    """Minimal precondition for end to end test, just starts the fixtures"""
    pass


# When Steps
@when("I look at the GUI")
def look_at_gui(frontend):
    """Minimal action, nothing really happens here"""
    pass


# Then Steps
@then("I see a table")
def check_that_table_is_visible(frontend):
    WebDriverWait(frontend, 20).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )
    assert frontend.find_element_by_tag_name("table").is_displayed()
