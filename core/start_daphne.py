# start_daphne.py
import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from daphne import server, cli

if __name__ == "__main__":
    cli.CommandLineInterface().run(["core.asgi:application", "--port", "8000",
        "--bind", "0.0.0.0"])
