# Rocket League Decal Generator - Setup & Deployment Guide

This guide provides step-by-step instructions for setting up, configuring, and deploying the Rocket League Decal Generator application. It covers both development environment setup and production deployment options.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)
7. [Docker Deployment](#docker-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or later)
- **npm** (v8.x or later)
- **MongoDB** (v4.4 or later)
- **Git**

For AI integration:
- An OpenAI API key (or other supported AI provider)

For production deployment:
- Docker and Docker Compose (optional)
- AWS account or other cloud provider (optional)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/rocket-league-decal-generator.git
cd rocket-league-decal-generator
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Set Up MongoDB

Ensure MongoDB is running locally or set up a MongoDB Atlas cluster.

For local MongoDB:
```bash
# Start MongoDB service
sudo systemctl start mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 5. Create Environment Files

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rocket-league-decals
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
REPLICATE_API_KEY=your-replicate-api-key
AI_PROVIDER=openai
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Configuration

### Backend Configuration

The backend configuration is managed through the `config.ts` file and environment variables. Key configuration options include:

- **Port**: The port on which the server will run (default: 5000)
- **MongoDB URI**: Connection string for MongoDB
- **JWT Secret**: Secret key for JWT token generation
- **AI Provider**: Which AI service to use (openai, replicate)
- **API Keys**: Keys for accessing AI services
- **Upload Directory**: Where generated files are stored
- **CORS Origin**: Allowed origins for CORS

### Frontend Configuration

The frontend configuration is managed through environment variables. Key configuration options include:

- **API URL**: The URL of the backend API

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

This will start the backend server in development mode with hot reloading.

### Start the Frontend

```bash
cd frontend
npm run dev
```

This will start the frontend development server with hot reloading.

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Testing

### Running Backend Tests

```bash
cd backend
npm test
```

### Running Frontend Tests

```bash
cd frontend
npm test
```

## Production Deployment

### Building for Production

#### Backend

```bash
cd backend
npm run build
```

This will create a `dist` directory with compiled JavaScript files.

#### Frontend

```bash
cd frontend
npm run build
```

This will create a `dist` directory with optimized production files.

### Deploying to a Server

#### Manual Deployment

1. Transfer the built files to your server
2. Set up environment variables
3. Install dependencies with `npm install --production`
4. Start the backend with a process manager like PM2:

```bash
npm install -g pm2
pm2 start dist/server.js --name rocket-league-decal-generator
```

5. Serve the frontend with Nginx or another web server

#### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Deploying to AWS

#### Prerequisites

- AWS CLI installed and configured
- Terraform (optional, for infrastructure as code)

#### Steps

1. Create an ECR repository for Docker images
2. Build and push Docker images
3. Set up an ECS cluster or EC2 instance
4. Deploy the application using ECS tasks or EC2 instances
5. Set up an Application Load Balancer
6. Configure Route 53 for domain routing

Detailed AWS deployment scripts and configurations are available in the `deployment/aws` directory.

## Docker Deployment

### Building Docker Images

#### Backend

```bash
cd backend
docker build -t rocket-league-decal-generator-backend .
```

#### Frontend

```bash
cd frontend
docker build -t rocket-league-decal-generator-frontend .
```

### Docker Compose

A `docker-compose.yml` file is provided in the root directory for easy deployment:

```bash
docker-compose up -d
```

This will start the MongoDB, backend, and frontend containers.

## Troubleshooting

### Common Issues

#### MongoDB Connection Errors

- Ensure MongoDB is running
- Check the connection string in the `.env` file
- Verify network connectivity to the MongoDB server

#### API Key Issues

- Verify that your OpenAI API key is valid and has sufficient credits
- Check that the API key is correctly set in the environment variables

#### File Permission Issues

- Ensure the upload directory is writable by the application
- Check file ownership and permissions

#### CORS Errors

- Verify that the CORS_ORIGIN in the backend configuration matches the frontend URL
- Check for any proxy or network issues that might affect CORS

### Logs

- Backend logs are available in the console or in PM2 logs if using PM2
- Frontend build logs are available during the build process
- Docker logs can be viewed with `docker logs <container_id>`

### Getting Help

If you encounter issues not covered in this guide:

1. Check the GitHub repository issues section
2. Review the technical documentation
3. Contact the development team

## Maintenance

### Updating Dependencies

Regularly update dependencies to ensure security and performance:

```bash
npm update
```

### Backing Up Data

Regularly back up the MongoDB database:

```bash
mongodump --uri="mongodb://localhost:27017/rocket-league-decals" --out=backup
```

### Monitoring

Consider setting up monitoring for the application:

- Use PM2 monitoring for Node.js processes
- Set up MongoDB monitoring
- Implement application performance monitoring (APM) tools
