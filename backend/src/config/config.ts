import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://<user>:<password>@cluster0.abcdefg.mongodb.net/?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  replicateApiKey: process.env.REPLICATE_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'openai',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default config;
