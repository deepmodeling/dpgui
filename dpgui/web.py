"""Web server for serving the web app."""

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

dist_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")


class Handler(SimpleHTTPRequestHandler):
    """Handler for serving the web app."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=dist_dir, **kwargs)

    def send_error(self, code, message=None):
        """Send an error message."""
        if code == 404:
            with open(os.path.join(dist_dir, "index.html")) as f:
                self.error_message_format = f.read()
        SimpleHTTPRequestHandler.send_error(self, code, message)


def run(port: int):
    """Run the web server."""
    server_address = ("", port)
    httpd = HTTPServer(server_address, Handler)
    httpd.serve_forever()
