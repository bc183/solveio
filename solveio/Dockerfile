FROM python:3.8-alpine
ENV PYTHONUNBUFFERED 1
WORKDIR /django
RUN python3 -m pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN \
 apk add gcc libc-dev libffi-dev openssl-dev python3-dev && \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 apk --purge del .build-deps
COPY . .