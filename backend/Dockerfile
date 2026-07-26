FROM python:3.12-slim-bookworm

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Package management
RUN pip install --no-cache-dir uv

# Install dependencies
COPY requirements.txt requirements.lock ./
RUN uv pip install --system --no-cache -r requirements.lock

# Copy project files (this copies backend/settings.py directly into /app)
COPY . .

# Service runs on port 8000
EXPOSE 8000

# Development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]