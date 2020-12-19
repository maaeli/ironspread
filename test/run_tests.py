# coding: utf-8

"""Run the end to end tests of the project."""

__author__ = "Martha Brennich"
__license__ = "MIT"
__copyright__ = "2020"
__date__ = "19/12/2020"

import sys
import unittest
import test_backend_api


def suite():
    """Creates suite for end to end tests"""
    test_suite = unittest.TestSuite()
    test_suite.addTest(test_backend_api.suite())
    return test_suite

if __name__ == '__main__':
    runner = unittest.TextTestRunner()
    result = runner.run(suite())

    if result.wasSuccessful():
        EXIT_STATUS = 0
    else:
        EXIT_STATUS = 1

    sys.exit(EXIT_STATUS)
