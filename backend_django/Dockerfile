# Use an official Python runtime as the base image
FROM python:3.11-slim

# Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# Set work directory in container
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install system dependencies (if needed for psycopg2 or other packages)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . .

# Collect static files if you serve them via Django
RUN python manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Use gunicorn to serve the application
CMD ["gunicorn", "Quiz_Website_Project.wsgi:application", "--bind", "0.0.0.0:8000"]
