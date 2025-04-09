#!/bin/bash

# Rocket League Decal Generator - Deployment Script
# This script packages the application for deployment

echo "Starting Rocket League Decal Generator packaging process..."

# Create a build directory
mkdir -p build
rm -rf build/*

# Build the frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build the backend
echo "Building backend..."
cd backend
npm install
npm run build
cd ..

# Create deployment package
echo "Creating deployment package..."
mkdir -p build/rocket-league-decal-generator
cp -r backend/dist build/rocket-league-decal-generator/backend
cp -r frontend/dist build/rocket-league-decal-generator/frontend
cp -r docs build/rocket-league-decal-generator/docs
cp README.md build/rocket-league-decal-generator/

# Create environment template files
echo "Creating environment templates..."
cat > build/rocket-league-decal-generator/backend/.env.template << EOL
PORT=5000
MONGO_URI=mongodb://localhost:27017/rocket-league-decals
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
REPLICATE_API_KEY=your-replicate-api-key
AI_PROVIDER=openai
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000
EOL

cat > build/rocket-league-decal-generator/frontend/.env.template << EOL
VITE_API_URL=http://localhost:5000/api
EOL

# Create startup scripts
echo "Creating startup scripts..."
cat > build/rocket-league-decal-generator/start-backend.sh << EOL
#!/bin/bash
cd backend
npm install --production
node dist/server.js
EOL

cat > build/rocket-league-decal-generator/start-frontend.sh << EOL
#!/bin/bash
cd frontend
npx serve -s dist -l 3000
EOL

chmod +x build/rocket-league-decal-generator/start-backend.sh
chmod +x build/rocket-league-decal-generator/start-frontend.sh

# Create Docker Compose file
echo "Creating Docker Compose file..."
cat > build/rocket-league-decal-generator/docker-compose.yml << EOL
version: '3'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: always

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/rocket-league-decals
      - JWT_SECRET=your-secret-key
      - OPENAI_API_KEY=your-openai-api-key
      - REPLICATE_API_KEY=your-replicate-api-key
      - AI_PROVIDER=openai
      - UPLOAD_DIR=./uploads
      - CORS_ORIGIN=http://localhost:3000
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: always

volumes:
  mongodb_data:
EOL

# Create Dockerfiles
echo "Creating Dockerfiles..."
cat > build/rocket-league-decal-generator/backend/Dockerfile << EOL
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
EOL

cat > build/rocket-league-decal-generator/frontend/Dockerfile << EOL
FROM nginx:alpine

COPY dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOL

# Create nginx config for frontend
cat > build/rocket-league-decal-generator/frontend/nginx.conf << EOL
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Create a README for the deployment package
cat > build/rocket-league-decal-generator/README.md << EOL
# Rocket League Decal Generator - Deployment Package

This package contains the Rocket League Decal Generator application ready for deployment.

## Quick Start

### Using Docker (Recommended)

1. Install Docker and Docker Compose
2. Update the environment variables in docker-compose.yml
3. Run \`docker-compose up -d\`
4. Access the application at http://localhost:3000

### Manual Deployment

1. Set up MongoDB
2. Copy .env.template to .env in both frontend and backend directories and update values
3. Run \`./start-backend.sh\` to start the backend
4. Run \`./start-frontend.sh\` to start the frontend
5. Access the application at http://localhost:3000

## Documentation

Detailed documentation is available in the docs directory:

- USER_GUIDE.md - Guide for end users
- TECHNICAL_DOCUMENTATION.md - Technical details for developers
- API_DOCUMENTATION.md - API reference
- SETUP_DEPLOYMENT_GUIDE.md - Detailed setup and deployment instructions

## Support

For issues or questions, please refer to the documentation or contact the development team.
EOL

# Create a zip archive of the deployment package
echo "Creating zip archive..."
cd build
zip -r rocket-league-decal-generator.zip rocket-league-decal-generator

echo "Packaging complete! Deployment package is available at build/rocket-league-decal-generator.zip"
