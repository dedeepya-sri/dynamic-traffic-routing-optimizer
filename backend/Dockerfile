FROM python:3.10-slim

# Install system dependencies needed by geospatial libraries (osmnx, geopandas)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential gdal-bin libgdal-dev libproj-dev proj-bin libgeos-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python deps
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt

# Copy app source
COPY . /app

EXPOSE 8000

# Use PORT env var when provided by platform
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
