import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';

const router = Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to get user profile
router.get('/profile/:id', getUserProfile);

export default router;
