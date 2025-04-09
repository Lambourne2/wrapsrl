import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import DecalService from '../services/decalGenerationService';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Mock dependencies
jest.mock('fs');
jest.mock('axios');
jest.mock('../services/aiGenerationService', () => ({
  __esModule: true,
  default: {
    generateDecalTexture: jest.fn().mockResolvedValue('https://example.com/generated-image.png')
  }
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('DecalGenerationService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock filesystem functions
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.mkdirSync.mockImplementation(() => undefined);
    mockedFs.writeFileSync.mockImplementation(() => undefined);
  });
  
  it('should generate a decal with the provided prompt and colors', async () => {
    // Mock axios get for downloading the image
    mockedAxios.get.mockResolvedValueOnce({
      data: Buffer.from('fake image data')
    });
    
    const prompt = 'flaming cybernetic wolf';
    const colors = ['#FF0000', '#000000', '#FFFFFF'];
    
    const result = await DecalService.generateDecal(prompt, colors);
    
    // Check that the result is a path to a zip file
    expect(result).toContain('.zip');
    
    // Check that the image was downloaded
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get.mock.calls[0][0]).toBe('https://example.com/generated-image.png');
    
    // Check that the config file was created
    expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(2); // Image and config
  });
  
  it('should handle reference images when provided', async () => {
    // Mock axios get for downloading the image
    mockedAxios.get.mockResolvedValueOnce({
      data: Buffer.from('fake image data')
    });
    
    const prompt = 'flaming cybernetic wolf';
    const colors = ['#FF0000', '#000000', '#FFFFFF'];
    const referenceImages = ['path/to/reference1.png', 'path/to/reference2.png'];
    
    await DecalService.generateDecal(prompt, colors, referenceImages);
    
    // Check that the AI service was called with reference images
    expect(require('../services/aiGenerationService').default.generateDecalTexture)
      .toHaveBeenCalledWith(prompt, referenceImages);
  });
  
  it('should throw an error when image download fails', async () => {
    // Mock the AI service to return a URL
    require('../services/aiGenerationService').default.generateDecalTexture.mockResolvedValueOnce('https://example.com/generated-image.png');
    
    // Mock axios get to reject
    mockedAxios.get.mockRejectedValueOnce(new Error('Download failed'));
    
    const prompt = 'flaming cybernetic wolf';
    const colors = ['#FF0000', '#000000', '#FFFFFF'];
    
    // Expect the service to throw an error
    await expect(DecalService.generateDecal(prompt, colors)).rejects.toThrow();
  });
  
  it('should create a valid JSON configuration file', async () => {
    // Mock axios get for downloading the image
    mockedAxios.get.mockResolvedValueOnce({
      data: Buffer.from('fake image data')
    });
    
    const prompt = 'flaming cybernetic wolf';
    const colors = ['#FF0000', '#000000', '#FFFFFF'];
    
    await DecalService.generateDecal(prompt, colors);
    
    // Check that writeFileSync was called with a JSON string
    const configCall = mockedFs.writeFileSync.mock.calls.find(call => 
      typeof call[0] === 'string' && call[0].endsWith('_config.json')
    );
    
    expect(configCall).toBeDefined();
    
    // Parse the JSON to ensure it's valid
    const configJson = JSON.parse(configCall[1] as string);
    
    // Check that the config has the expected structure
    expect(configJson[prompt]).toBeDefined();
    expect(configJson[prompt].BodyID).toBe(23); // Octane ID
    expect(configJson[prompt].Chassis).toBeDefined();
    expect(configJson[prompt].Body).toBeDefined();
  });
});
