FROM python:3.11

# Set environment variables to prevent Python from buffering stdout and writing .pyc files
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies to ensure compatibility with packages that require compilation, such as database drivers.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir poetry

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the application code
COPY . /app/

EXPOSE 8000

CMD ["poetry", "run", "daphne", "-b", "0.0.0.0", "-p", "8000", "app.asgi:application"]
