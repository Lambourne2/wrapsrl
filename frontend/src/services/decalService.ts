import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

// API service for decal-related operations
const DecalService = {
  // Generate a new decal
  generateDecal: async (prompt: string, colors: string[], referenceImages?: File[]) => {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      // Add colors as JSON string
      formData.append('colors', JSON.stringify(colors));
      
      // Add reference images if provided
      if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach((file, index) => {
          formData.append('referenceImages', file);
        });
      }
      
      const response = await axios.post(`${API_URL}/decals/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating decal:', error);
      throw error;
    }
  },
  
  // Get all decals
  getDecals: async (userId?: string) => {
    try {
      const params = userId ? { userId } : {};
      const response = await axios.get(`${API_URL}/decals`, { params });
      return response.data.decals;
    } catch (error) {
      console.error('Error fetching decals:', error);
      throw error;
    }
  },
  
  // Get a specific decal by ID
  getDecalById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/decals/${id}`);
      return response.data.decal;
    } catch (error) {
      console.error('Error fetching decal:', error);
      throw error;
    }
  },
  
  // Check the status of a decal generation
  checkDecalStatus: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/decals/${id}`);
      return response.data.decal.status;
    } catch (error) {
      console.error('Error checking decal status:', error);
      throw error;
    }
  },
  
  // Download a decal package
  downloadDecal: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/decals/download/${id}`);
      return response.data.downloadUrl;
    } catch (error) {
      console.error('Error downloading decal:', error);
      throw error;
    }
  },
};

export default DecalService;
