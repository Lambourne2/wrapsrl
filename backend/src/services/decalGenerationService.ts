import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config';
import aiGenerationService from './aiGenerationService';

// Interface for decal texture data
interface DecalTexture {
  diffuse: string;
  normal?: string;
  mask?: string;
}

// Interface for decal package data
interface DecalPackage {
  id: string;
  name: string;
  textures: DecalTexture;
  configJson: string;
  zipPath: string;
}

export class DecalGenerationService {
  private uploadDir: string;
  private tempDir: string;

  constructor() {
    this.uploadDir = path.resolve(config.uploadDir);
    this.tempDir = path.resolve(config.uploadDir, 'temp');
    
    // Ensure directories exist
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async generateDecal(prompt: string, colors: string[], referenceImages?: string[]): Promise<string> {
    try {
      // Generate unique ID for this decal
      const decalId = uuidv4();
      
      // Generate AI texture using the service
      const imageUrl = await aiGenerationService.generateDecalTexture(prompt, referenceImages);
      
      // Download the generated image
      const diffuseMapPath = await this.downloadImage(imageUrl, decalId, 'diffuse');
      
      // Process the image to create necessary texture maps
      const textureData = await this.processTextures(diffuseMapPath, colors, decalId);
      
      // Create JSON configuration file
      const configPath = await this.createConfigFile(decalId, prompt, textureData);
      
      // Package everything into a ZIP file
      const zipPath = await this.packageDecal(decalId, textureData, configPath);
      
      return zipPath;
    } catch (error) {
      console.error('Error generating decal:', error);
      throw new Error('Failed to generate decal');
    }
  }

  private async downloadImage(url: string, decalId: string, type: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const filePath = path.join(this.tempDir, `${decalId}_${type}.png`);
      
      fs.writeFileSync(filePath, response.data);
      return filePath;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error('Failed to download generated image');
    }
  }

  private async processTextures(diffusePath: string, colors: string[], decalId: string): Promise<DecalTexture> {
    // This is a placeholder for actual image processing
    // In a real implementation, this would use image processing libraries
    // to create normal maps and other texture maps based on the diffuse map
    
    // For now, we'll just return the diffuse map path
    return {
      diffuse: diffusePath,
      // In a real implementation, these would be generated:
      // normal: path.join(this.tempDir, `${decalId}_normal.png`),
      // mask: path.join(this.tempDir, `${decalId}_mask.png`)
    };
  }

  private async createConfigFile(decalId: string, prompt: string, textureData: DecalTexture): Promise<string> {
    // Create a configuration file similar to the example "University of Utah.json"
    const configData = {
      [prompt]: {
        "BodyID": 23, // Octane body ID
        "SkinID": parseInt(decalId.substring(0, 8), 16) % 100000, // Generate a numeric ID from the UUID
        "Chassis": {
          "Diffuse": path.basename(textureData.diffuse),
          "Masks": "",
          "Normal": ""
        },
        "Body": {
          "Diffuse": "body.png",
          "1_Diffuse_Skin": path.basename(textureData.diffuse),
          "2_Diffuse_Skin_Mask": "",
          "CurvaturePack": "",
          "F1DetailNormal": "",
          "BodyMasks": "",
          "F2DetailNormal": "",
          "Normal": ""
        }
      }
    };
    
    const configPath = path.join(this.tempDir, `${decalId}_config.json`);
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    
    return configPath;
  }

  private async packageDecal(decalId: string, textureData: DecalTexture, configPath: string): Promise<string> {
    // This is a placeholder for actual ZIP packaging
    // In a real implementation, this would use a library like archiver
    // to create a ZIP file with all the necessary files
    
    // For now, we'll just return a mock path
    const zipPath = path.join(this.uploadDir, `${decalId}.zip`);
    
    // In a real implementation, this would create the ZIP file:
    // const output = fs.createWriteStream(zipPath);
    // const archive = archiver('zip', { zlib: { level: 9 } });
    // archive.pipe(output);
    // archive.file(textureData.diffuse, { name: path.basename(textureData.diffuse) });
    // archive.file(configPath, { name: path.basename(configPath) });
    // await archive.finalize();
    
    return zipPath;
  }
}

export default new DecalGenerationService();
