"""Command line interface for the dpgui application."""

import argparse

from .web import run


def dpgui():
    """Command line interface for the dpgui application."""
    argparser = argparse.ArgumentParser(description="A web-based GUI for user inputs.")
    argparser.add_argument(
        "--port", type=int, default=8000, help="The port to run the server on."
    )
    args = argparser.parse_args()
    run(port=args.port)
