<!-- markdownlint-disable MD041 MD033 -->
<div align="center">
    <img src="public/YeetLand.png" alt="logo" width="100" height="auto" />
    <h1>YeetLand</h1>
</div>
<br />

YeetLand is a simple graphical interface for the Yeet Social network in the browser (uni project).

![Screenshot](.github/images/screenshot.png)

## ✨ Features

- Own Feed
- Explore all new yeets
- Like, create, reply to yeets
- See all users (including follow graph view)

## 🚀 Installation

1. Copy the `web_client.py` file some folder together with the `exercise-10/prelude.py` file
2. Install the dependencies via `pip install flask requests`
3. Download the latest `yeetland-build.zip` from [the releases](https://github.com/wolflu05/YeetLand/releases) and unpack it next to the other two files, so that there is a folder `yeetland-build` with the `index.html`, ...
4. Start the Server via `python web_client.py web`
5. The client is now reachable from your browser under `http://localhost:8763`

## 🛠️ Development Setup

### 📋 Requirements

- Node.js
- Python

### 🧰 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Mantine](https://mantine.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [Python](https://www.python.org/)

### ⚙️ Setup

1. Copy the `prelude.py` file provided by the uni into this folder
2. Create a python venv via `python -m venv .venv`
3. Activate venv `source .venv/bin/activate`
4. Install python dependencies `pip install -r requirements.txt`
5. Install frontend dependencies via `npm install`
6. Start python server via `python web_client.py web`
7. And the frontend dev server via `npm run dev` in another terminal
