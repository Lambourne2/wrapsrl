import express, { RequestHandler } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser as RequestHandler);

// Route to login a user
router.post('/login', loginUser as RequestHandler);

// Route to get a user's profile
router.get('/profile/:id', getUserProfile as RequestHandler);

export default router;