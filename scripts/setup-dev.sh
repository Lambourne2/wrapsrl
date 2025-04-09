#!/bin/bash

# Rocket League Decal Generator - Development Setup Script
# This script sets up the development environment

echo "Setting up Rocket League Decal Generator development environment..."

# Create project directories if they don't exist
mkdir -p frontend
mkdir -p backend
mkdir -p docs

# Install frontend dependencies
echo "Setting up frontend..."
cd frontend
npm init -y
npm install react react-dom react-router-dom @reduxjs/toolkit three @react-three/fiber @react-three/drei tailwindcss postcss autoprefixer
npm install vite @vitejs/plugin-react typescript @types/react @types/react-dom --save-dev
cd ..

# Install backend dependencies
echo "Setting up backend..."
cd backend
npm init -y
npm install express cors dotenv mongoose multer axios body-parser
npm install typescript ts-node @types/express @types/cors @types/node @types/multer nodemon --save-dev
cd ..

# Create environment template files
echo "Creating environment templates..."
cat > backend/.env.template << EOL
PORT=5000
MONGO_URI=mongodb://localhost:27017/rocket-league-decals
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
REPLICATE_API_KEY=your-replicate-api-key
AI_PROVIDER=openai
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000
EOL

cat > frontend/.env.template << EOL
VITE_API_URL=http://localhost:5000/api
EOL

echo "Development environment setup complete!"
echo "Next steps:"
echo "1. Copy .env.template to .env in both frontend and backend directories"
echo "2. Update the environment variables with your API keys"
echo "3. Start the backend with 'cd backend && npm run dev'"
echo "4. Start the frontend with 'cd frontend && npm run dev'"
