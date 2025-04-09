import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config/config';
import mongoose from 'mongoose';

// Import routes
import decalRoutes from './routes/decalRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/decals', decalRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
