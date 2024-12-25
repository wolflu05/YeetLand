FROM node:latest as frontend

WORKDIR /app
COPY . /app
RUN npm ci && npm run build

FROM python:3.13-slim

WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY --from=frontend /app/yeetland-build /app/yeetland-build
COPY ./web_client.py ./prelude.py /app/
CMD ["python", "web_client.py", "yeetland", "0.0.0.0"]
