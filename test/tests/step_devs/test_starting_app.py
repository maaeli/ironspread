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
from table_parser.table_parser import table_parser

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


@then(parsers.parse("I see a table with the header\n{header}"))
def check_table_header(frontend, header):
    expected_table_header = table_parser(header)
    table = WebDriverWait(frontend, 20).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )
    table_header = table.find_element_by_tag_name("thead")
    header_rows = table_header.find_elements_by_tag_name("tr")
    header_dict = {key: [] for key in expected_table_header}
    header_dict_keys = list(header_dict.keys())
    for row in header_rows:
        cells = row.find_elements_by_tag_name("td")
        for cell_number, cell in enumerate(cells):
            header_dict[header_dict_keys[cell_number]].append(cell.text)
    assert header_dict == expected_table_header


@then(parsers.parse("I see a table with the row labels {labels}"))
def check_row_lables(frontend, labels):
    labels_expected = [label.strip("'") for label in labels.split(",")]
    table = WebDriverWait(frontend, 20).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )
    table_body = table.find_element_by_tag_name("tbody")
    body_rows = table_body.find_elements_by_tag_name("tr")
    row_labels = []
    for row in body_rows:
        row_labels.append(row.find_elements_by_tag_name("td")[0].text)
    assert row_labels == labels_expected