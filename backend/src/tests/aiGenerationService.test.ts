import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import axios from 'axios';
import { AIGenerationService } from '../services/aiGenerationService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AIGenerationService', () => {
  let aiService: AIGenerationService;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of the service
    aiService = new AIGenerationService('openai');
  });
  
  it('should generate a decal texture with OpenAI provider', async () => {
    // Mock the axios post response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: [
          {
            url: 'https://example.com/generated-image.png'
          }
        ]
      }
    });
    
    const prompt = 'flaming cybernetic wolf';
    const result = await aiService.generateDecalTexture(prompt);
    
    // Check that axios was called with the correct parameters
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post.mock.calls[0][0]).toContain('openai');
    
    // Check that the payload contains the enhanced prompt
    const payload = mockedAxios.post.mock.calls[0][1];
    expect(payload.prompt).toContain(prompt);
    
    // Check that the result is the expected URL
    expect(result).toBe('https://example.com/generated-image.png');
  });
  
  it('should handle reference images when provided', async () => {
    // Mock the axios post response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: [
          {
            url: 'https://example.com/generated-image.png'
          }
        ]
      }
    });
    
    const prompt = 'flaming cybernetic wolf';
    const referenceImages = ['https://example.com/reference1.png', 'https://example.com/reference2.png'];
    
    await aiService.generateDecalTexture(prompt, referenceImages);
    
    // Check that the payload contains reference images
    const payload = mockedAxios.post.mock.calls[0][1];
    expect(payload.reference_images).toBeDefined();
    expect(payload.reference_images).toEqual(referenceImages);
  });
  
  it('should throw an error when the API call fails', async () => {
    // Mock the axios post to reject
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
    
    const prompt = 'flaming cybernetic wolf';
    
    // Expect the service to throw an error
    await expect(aiService.generateDecalTexture(prompt)).rejects.toThrow();
  });
  
  it('should allow changing the provider at runtime', async () => {
    // Initially using OpenAI
    expect(aiService).toBeDefined();
    
    // Change to Replicate
    aiService.setProvider('replicate');
    
    // Mock the axios post response for Replicate
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        output: 'https://replicate-generated-image-url.com'
      }
    });
    
    // This should now use the Replicate provider
    const prompt = 'flaming cybernetic wolf';
    await aiService.generateDecalTexture(prompt);
    
    // Check that axios was called with the Replicate URL
    expect(mockedAxios.post.mock.calls[0][0]).toContain('replicate');
  });
});
