#!/bin/bash

# Rocket League Decal Generator - Docker Deployment Script
# This script deploys the application using Docker

echo "Deploying Rocket League Decal Generator with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Prompt for environment variables
read -p "Enter OpenAI API Key: " OPENAI_API_KEY
read -p "Enter JWT Secret (or press enter for random): " JWT_SECRET

# Generate random JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "Generated random JWT Secret: $JWT_SECRET"
fi

# Update docker-compose.yml with environment variables
sed -i "s/OPENAI_API_KEY=your-openai-api-key/OPENAI_API_KEY=$OPENAI_API_KEY/" docker-compose.yml
sed -i "s/JWT_SECRET=your-secret-key/JWT_SECRET=$JWT_SECRET/" docker-compose.yml

# Start the containers
echo "Starting Docker containers..."
docker-compose up -d

# Check if containers are running
echo "Checking container status..."
docker-compose ps

echo "Deployment complete! The application should be available at http://localhost:3000"
echo "Backend API is available at http://localhost:5000/api"
echo ""
echo "To stop the application, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
