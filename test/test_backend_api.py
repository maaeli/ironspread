# coding: utf-8

"""Tests for the backend api."""

__authors__ = ["Martha Brennich"]
__license__ = "MIT"
__date__ = "11/07/2020"

import unittest
import logging
from subprocess import Popen
from pathlib import PurePath
import requests

logger = logging.getLogger(__name__)

this_file_as_path = PurePath(__file__)


class TestBackEndApi(unittest.TestCase):
    """Tests for the backend api."""

    def setUp(self):
        """Start the web server"""
        server_application_path = PurePath(
            this_file_as_path.parent.parent,
            "backend",
            "target",
            "debug",
            "ironspread",
        )
        self.server_instance = Popen(server_application_path)

    def tearDown(self):
        """Stop the web server after the test"""
        self.server_instance.kill()

    def test_should_get_test_account_data(self):  # pylint: disable=R0201
        """
        A GET on account_data should provide the following json:
            {"account_names":
                {"names":["bank a","bank b","bank c"]},
            "balances":[
            {"date":"May 2018","balances":[1.3,5.6,7.8]},
            {"date":"June 2018","balances":[-0.3,2.1,4.0]}
            ]
            }
        """
        account_data = requests.get("http://localhost:8081/account_data")
        account_data_json = account_data.json()
        assert account_data_json["account_names"] == [
            "bank a",
            "bank b",
            "bank c",
        ]
        assert account_data_json["balances"][0] == {
            "date": "May 2018",
            "balances": [1.3, 5.6, 7.8],
        }
        assert account_data_json["balances"][1] == {
            "date": "June 2018",
            "balances": [-0.3, 2.1, 4.0],
        }


def suite():
    """Assemble tests to suite"""
    test_suite = unittest.TestSuite()
    test_suite.addTest(TestBackEndApi("test_should_get_test_account_data"))
    return test_suite


if __name__ == "__main__":
    runner = unittest.TextTestRunner()
    runner.run(suite())
