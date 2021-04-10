from subprocess import Popen
from pathlib import PurePath
import pytest

this_file_as_path = PurePath(__file__)

server_application_path = PurePath(
    this_file_as_path.parent.parent.parent.parent,
    "backend",
    "target",
    "debug",
    "ironspread",
)


@pytest.fixture
def backend():
    """Start and stop backend server"""
    server_instance = Popen(server_application_path)
    yield
    server_instance.kill()