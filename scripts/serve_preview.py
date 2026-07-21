#!/usr/bin/env python3
"""Serve Ember locally with single-page app route fallback."""

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


class SpaRequestHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        requested_path = urlparse(self.path).path
        local_path = Path(self.translate_path(requested_path))
        if requested_path != "/" and not local_path.exists() and not local_path.suffix:
            self.path = "/index.html"
        return super().send_head()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=4175)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.bind, args.port), SpaRequestHandler)
    print(f"Serving Ember on http://{args.bind}:{args.port} with SPA fallback")
    server.serve_forever()


if __name__ == "__main__":
    main()
