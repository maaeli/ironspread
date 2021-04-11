from subprocess import Popen
from pathlib import PurePath
import pytest
from selenium import webdriver

this_file_as_path = PurePath(__file__)

server_application_path = PurePath(
    this_file_as_path.parent.parent.parent.parent,
    "backend",
    "target",
    "debug",
    "ironspread",
)

electron_application_path = PurePath(
    this_file_as_path.parent.parent.parent.parent,
    "frontend",
    "out",
    "mac",
    "IronSpread.app",
    "Contents",
    "MacOS",
    "IronSpread",
)

chrome_driver_path = PurePath(
    this_file_as_path.parent.parent.parent,
    "chromedriver",
)


@pytest.fixture
def backend():
    """Start and stop backend server"""
    server_instance = Popen(server_application_path)
    yield
    server_instance.kill()


@pytest.fixture
def frontend():
    """Start and stop frontend"""
    options = webdriver.ChromeOptions()
    options.binary_location = str(electron_application_path)
    chrome_driver = webdriver.Chrome(chrome_driver_path, options=options)
    yield chrome_driver
    chrome_driver.quit()
