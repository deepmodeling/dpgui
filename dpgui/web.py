"""Web server for serving the web app."""

import logging
from pathlib import Path

from waitress import serve
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.shared_data import SharedDataMiddleware
from werkzeug.routing import Map, Rule
from werkzeug.wrappers import Request, Response

from .dargs import generate_input_json

dist_dir = Path(__file__).parent / "dist"
log = logging.getLogger(__name__)


class App:
    """Web server for serving the web app."""

    def __init__(self) -> None:
        self.url_map = Map(
            [
                Rule("/", endpoint="app"),
                Rule("/<path:route>", endpoint="app"),
                Rule("/api/inputs", endpoint="inputs"),
            ]
        )
        self.wsgi_app = SharedDataMiddleware(
            self.wsgi_app,
            {
                "/": str(dist_dir),
            },
        )

    def dispatch_request(self, request):
        """Dispatch the request to the appropriate handler."""
        adapter = self.url_map.bind_to_environ(request.environ)
        try:
            endpoint, values = adapter.match()
            return getattr(self, f"on_{endpoint}")(request, **values)
        except HTTPException as e:
            return e

    def on_app(self, request, **kwargs):
        """Serve the web app."""
        with open(dist_dir / "index.html") as f:
            html = f.read()
        return Response(html, mimetype="text/html")

    def on_inputs(self, request, **kwargs):
        """Serve the input JSON."""
        return Response(generate_input_json(), mimetype="application/json")

    def wsgi_app(self, environ, start_response):
        """WSGI application."""
        request = Request(environ)
        response = self.dispatch_request(request)
        return response(environ, start_response)

    def __call__(self, environ, start_response):
        """Call the WSGI application."""
        return self.wsgi_app(environ, start_response)


def run(port: int, bind_all: bool = False):
    """Run the web server."""
    app = App()
    if bind_all:
        listen = f"0.0.0.0:{port} [::]:{port}"
    else:
        listen = f"127.0.0.1:{port} [::1]:{port}"
    log.info(f"Open DP-GUI from http://localhost:{port}/")
    serve(app, listen=listen)
