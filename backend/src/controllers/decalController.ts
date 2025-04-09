import { Request, Response } from 'express';
import decalGenerationService from '../services/decalGenerationService';
import Decal from '../models/decalModel';

// Controller for handling decal generation
export const generateDecal = async (req: Request, res: Response) => {
  try {
    const { prompt, colors, userId } = req.body;
    
    // Validate input
    if (!prompt || !colors || !Array.isArray(colors)) {
      return res.status(400).json({ message: 'Invalid input. Prompt and colors array are required.' });
    }
    
    // Get reference images if provided
    let referenceImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      referenceImages = (req.files as Express.Multer.File[]).map(file => file.path);
    }
    
    // Create a new decal record in the database
    const decal = new Decal({
      name: prompt.substring(0, 30), // Use first 30 chars of prompt as name
      prompt,
      colors,
      userId: userId || 'anonymous', // Use anonymous if no user ID provided
      status: 'processing'
    });
    
    await decal.save();
    
    // Start the generation process asynchronously
    decalGenerationService.generateDecal(prompt, colors, referenceImages)
      .then(async (zipPath) => {
        // Update the decal record with the result
        decal.downloadUrl = zipPath;
        decal.status = 'completed';
        await decal.save();
      })
      .catch(async (error) => {
        // Update the decal record with the error
        decal.status = 'failed';
        await decal.save();
        console.error('Error in decal generation:', error);
      });
    
    // Return the decal ID immediately
    res.status(202).json({ 
      message: 'Decal generation started',
      decalId: decal._id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Error in generateDecal controller:', error);
    res.status(500).json({ message: 'Error generating decal' });
  }
};

// Controller for retrieving decals
export const getDecals = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    // If userId is provided, get decals for that user
    // Otherwise, get all decals (could be limited or paginated in a real app)
    const query = userId ? { userId } : {};
    
    const decals = await Decal.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({ decals });
  } catch (error) {
    console.error('Error retrieving decals:', error);
    res.status(500).json({ message: 'Error retrieving decals' });
  }
};

// Controller for retrieving a specific decal
export const getDecalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const decal = await Decal.findById(id);
    
    if (!decal) {
      return res.status(404).json({ message: 'Decal not found' });
    }
    
    res.status(200).json({ decal });
  } catch (error) {
    console.error('Error retrieving decal:', error);
    res.status(500).json({ message: 'Error retrieving decal' });
  }
};

// Controller for downloading a decal
export const downloadDecal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const decal = await Decal.findById(id);
    
    if (!decal) {
      return res.status(404).json({ message: 'Decal not found' });
    }
    
    if (decal.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Decal is not ready for download',
        status: decal.status
      });
    }
    
    if (!decal.downloadUrl) {
      return res.status(400).json({ message: 'Download URL not available' });
    }
    
    // In a real implementation, this would send the file
    // res.download(decal.downloadUrl);
    
    // For now, just return the URL
    res.status(200).json({ downloadUrl: decal.downloadUrl });
  } catch (error) {
    console.error('Error downloading decal:', error);
    res.status(500).json({ message: 'Error downloading decal' });
  }
};
