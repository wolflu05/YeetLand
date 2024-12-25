import sys
from prelude import Session
from getpass import getpass


def authenticate(session: Session) -> None:
    if session.authenticated:
        return

    while True:
        username = input("Username: ")
        password = getpass("Password: ")

        if session.login(username, password):
            print(f"Erfolgreich als {username} angemeldet!")
            break
        else:
            print("Fehler beim Anmelden, probiere es erneut!\n\n")


def start_yeetland(session: Session):
    from flask import Flask, jsonify, request, send_from_directory, send_file
    import os

    BASE_DIR = os.path.dirname(os.path.realpath(__file__))
    DST_DIR = os.path.join(BASE_DIR, "yeetland-build")
    if not os.path.isdir(DST_DIR):
        if input("The frontend build is not yet downloaded, do you want to download it now automatically? [Y/N]: ").lower() != "y":
            print("Ok, please consider downloading the latest version from the releases at https://github.com/wolflu05/YeetLand/releases manually.")
            exit(0)

        # Automatically download frontend...
        import requests
        import functools
        import shutil
        from tempfile import NamedTemporaryFile
        from zipfile import ZipFile

        with requests.get(
            "https://github.com/wolflu05/yeetland/releases/latest/download/yeetland-build.zip",
            headers={'Accept': 'application/vnd.github.v3+json'},
            stream=True,
            allow_redirects=True
        ) as response, NamedTemporaryFile(suffix=".zip") as dst:
            response.raise_for_status()

            # auto decode the gzipped raw data
            response.raw.read = functools.partial(
                response.raw.read, decode_content=True
            )
            with open(dst.name, 'wb') as f:
                shutil.copyfileobj(response.raw, f)
            print(f"Downloaded yeetland-build to temporary file: {dst.name}")

            os.makedirs(DST_DIR)
            with ZipFile(dst.name, "r") as zip_ref:
                zip_ref.extractall(DST_DIR)

            print(f"Unzipped downloaded yeetland-build to: {DST_DIR}\n")
            print("To update, just delete that folder and run the script again.")
            print("(You may need to check if there is a new web_client.py version available if something doesn't work as expected)")
            print("This will download the latest version again.")
            print("\nAll done now, have fun...")

    app = Flask(__name__)

    @app.after_request
    def add_cors_headers(response: Any):  # type: ignore
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        return response

    @app.route("/api/me", methods=["GET"])
    def me():  # type: ignore
        return jsonify({"username": session.username})

    @app.route("/api/<path:path>", methods=["GET", "POST"])  # type: ignore
    def proxy_route(path: str):  # type: ignore
        if request.method == "GET":
            return jsonify(session.get(f"/{path}"))
        if request.method == "POST":
            session.post(f"/{path}", request.json)  # type: ignore
            return jsonify({})

    @app.route("/assets/<path:path>", methods=["GET"])
    def serve_assets(path: str):  # type: ignore
        return send_from_directory("yeetland-build/assets", path)

    @app.route("/YeetLand.png", methods=["GET"])
    def serve_logo():  # type: ignore
        return send_file("yeetland-build/YeetLand.png")

    @app.route("/", methods=["GET"])
    @app.route("/<path:path>", methods=["GET"])
    def serve_index(**kwargs):  # type: ignore
        return send_file("yeetland-build/index.html")

    app.run("localhost", 8763)


if __name__ == "__main__":
    session = Session()
    authenticate(session)

    match sys.argv[1:]:
        case ["yeetland"]:
            start_yeetland(session)
