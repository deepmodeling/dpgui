"""Command line interface for the dpgui application."""

import argparse

from .web import run


def dpgui():
    """Command line interface for the dpgui application."""
    argparser = argparse.ArgumentParser(description="A web-based GUI for user inputs.")
    argparser.add_argument(
        "--port", type=int, default=6042, help="The port to serve DP-GUI on."
    )
    argparser.add_argument(
        "--bind_all",
        action="store_true",
        help=(
            "Serve on all public interfaces. This will expose your DP-GUI instance "
            "to the network on both IPv4 and IPv6 (where available)."
        ),
    )
    args = argparser.parse_args()
    run(port=args.port)
