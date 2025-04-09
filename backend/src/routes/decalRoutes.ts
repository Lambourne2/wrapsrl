import { Router } from 'express';
import { generateDecal, getDecals, downloadDecal } from '../controllers/decalController';

const router = Router();

// Route to generate a new decal
router.post('/generate', generateDecal);

// Route to get all decals
router.get('/', getDecals);

// Route to download a specific decal
router.get('/download/:id', downloadDecal);

export default router;
