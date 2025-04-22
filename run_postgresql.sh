#!/bin/bash

# Define the custom Docker Compose file
COMPOSE_FILE="postgresql-db.yml"

# Check if the data directory exists
DATA_DIR="/var/lib/postgresql/data"
if [ ! -d "$DATA_DIR" ]; then
  echo "Creating data directory at $DATA_DIR"
  mkdir -p "$DATA_DIR"
else
  echo "Data directory already exists at $DATA_DIR"
fi

# Stop and remove existing PostgreSQL container
echo "Stopping and removing existing PostgreSQL container (if running)..."
docker-compose -f $COMPOSE_FILE down

# Start a new PostgreSQL container
echo "Starting new PostgreSQL container..."
docker-compose -f $COMPOSE_FILE up -d

# Check if the container is running
if [ $? -eq 0 ]; then
  echo "✅ PostgreSQL is running in Docker."
else
  echo "❌ Failed to start PostgreSQL container."
fi

# Show running Docker containers
docker-compose -f $COMPOSE_FILE ps
