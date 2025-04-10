import express, { RequestHandler } from 'express';
import { generateDecal, getDecals, getDecalById, downloadDecal } from '../controllers/decalController';

const router = express.Router();

// Route to generate a new decal
router.post('/generate', generateDecal as RequestHandler);

// Route to get all decals
router.get('/', getDecals as RequestHandler);

// Route to get a specific decal by ID
router.get('/:id', getDecalById as RequestHandler);

// Route to download a decal
router.get('/download/:id', downloadDecal as RequestHandler);

export default router;