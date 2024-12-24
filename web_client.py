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


def start_server(session: Session):
    from flask import Flask, jsonify, request

    app = Flask(__name__)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        return response

    @app.route("/api/me", methods=["GET"])
    def me():
        return jsonify({"username": session.username})

    @app.route("/api/<path:path>", methods=["GET", "POST"])
    def proxy_route(path):
        if request.method == "GET":
            return jsonify(session.get(f"/{path}"))
        if request.method == "POST":
            session.post(f"/{path}", request.json)
            return jsonify({})

    app.run("localhost", "8763")


if __name__ == "__main__":
    session = Session()
    authenticate(session)

    match sys.argv[1:]:
        case ["web"]:
            start_server(session)