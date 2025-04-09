import axios from 'axios';
import config from '../config/config';

// Interface for AI service providers
interface AIProvider {
  generateImage(prompt: string, referenceImages?: string[]): Promise<string>;
}

// OpenAI provider implementation
class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openai.com/v1/images/generations';
  }

  async generateImage(prompt: string, referenceImages?: string[]): Promise<string> {
    try {
      // Prepare the request payload
      const payload: any = {
        model: "dall-e-3", // Using DALL-E 3 model
        prompt: this.enhancePrompt(prompt),
        n: 1,
        size: "1024x1024",
        response_format: "url"
      };

      // If reference images are provided, add them to the request
      if (referenceImages && referenceImages.length > 0) {
        // This is a placeholder for the actual implementation
        // OpenAI's API might require different formatting for reference images
        payload.reference_images = referenceImages;
      }

      // Make the API request
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Return the generated image URL
      return response.data.data[0].url;
    } catch (error) {
      console.error('Error generating image with OpenAI:', error);
      throw new Error('Failed to generate image with OpenAI');
    }
  }

  private enhancePrompt(prompt: string): string {
    // Enhance the prompt with specific instructions for Rocket League decals
    return `Create a seamless texture for a Rocket League car decal with the following design: ${prompt}. 
    The texture should be suitable for wrapping around a 3D car model, with clean edges and high contrast. 
    Make it visually striking with bold colors and clear design elements that would look good on a sports car in a video game.`;
  }
}

// Replicate.com provider implementation (for future use)
class ReplicateProvider implements AIProvider {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.replicate.com/v1/predictions';
  }

  async generateImage(prompt: string, referenceImages?: string[]): Promise<string> {
    try {
      // Implementation for Replicate.com API
      // This is a placeholder for future implementation
      return "https://replicate-generated-image-url.com";
    } catch (error) {
      console.error('Error generating image with Replicate:', error);
      throw new Error('Failed to generate image with Replicate');
    }
  }
}

// Factory to create the appropriate AI provider
class AIProviderFactory {
  static createProvider(provider: string): AIProvider {
    switch (provider) {
      case 'openai':
        return new OpenAIProvider(config.openAiApiKey || '');
      case 'replicate':
        return new ReplicateProvider(config.replicateApiKey || '');
      default:
        return new OpenAIProvider(config.openAiApiKey || '');
    }
  }
}

// Main service for AI image generation
export class AIGenerationService {
  private provider: AIProvider;

  constructor(providerName: string = 'openai') {
    this.provider = AIProviderFactory.createProvider(providerName);
  }

  async generateDecalTexture(prompt: string, referenceImages?: string[]): Promise<string> {
    try {
      return await this.provider.generateImage(prompt, referenceImages);
    } catch (error) {
      console.error('Error in AI generation service:', error);
      throw error;
    }
  }

  // Method to change the provider at runtime
  setProvider(providerName: string): void {
    this.provider = AIProviderFactory.createProvider(providerName);
  }
}

export default new AIGenerationService();
