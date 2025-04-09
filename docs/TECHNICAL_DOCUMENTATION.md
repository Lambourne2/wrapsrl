# Rocket League Decal Generator - Technical Documentation

This technical documentation provides an overview of the architecture, components, and implementation details of the Rocket League Decal Generator application. It is intended for developers who want to understand, modify, or extend the application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Frontend Components](#frontend-components)
5. [Backend Services](#backend-services)
6. [Database Schema](#database-schema)
7. [AI Integration](#ai-integration)
8. [Decal Generation Pipeline](#decal-generation-pipeline)
9. [Authentication System](#authentication-system)
10. [Testing](#testing)
11. [Future Enhancements](#future-enhancements)

## Architecture Overview

The Rocket League Decal Generator follows a client-server architecture with a clear separation between the frontend and backend components:

- **Frontend**: A React single-page application (SPA) that provides the user interface for creating, viewing, and downloading decals.
- **Backend**: A Node.js API server that handles decal generation, AI integration, and data persistence.
- **Database**: MongoDB for storing user data and decal information.
- **AI Service**: Integration with OpenAI's image generation API (with flexibility to switch to other providers).

The application uses a RESTful API for communication between the frontend and backend, with JSON as the data exchange format.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **State Management**: React Hooks and Context API
- **Routing**: React Router
- **3D Rendering**: Three.js with React Three Fiber
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Testing**: Jest and React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Local filesystem (configurable for cloud storage)
- **AI Integration**: OpenAI API (with adapter pattern for other providers)
- **Testing**: Jest

## Project Structure

The project is organized into two main directories:

### Frontend Structure
```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── services/        # API client services
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── assets/          # Images, fonts, etc.
│   ├── tests/           # Test files
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

### Backend Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── tests/           # Test files
│   └── server.ts        # Server entry point
├── uploads/             # Uploaded and generated files
└── tsconfig.json        # TypeScript configuration
```

## Frontend Components

### Key Components

#### DecalCreator
The main component for creating decals. It provides:
- A form for entering the decal description
- Color selection interface
- 3D preview of the Octane with the generated decal
- Generation and download functionality

```typescript
// Usage example
<DecalCreator onSubmit={handleSubmit} />
```

#### OctaneModel
A Three.js component that renders a 3D model of the Octane with the applied decal texture.

```typescript
// Usage example
<OctaneModel textureUrl={decalImageUrl} colors={selectedColors} />
```

#### ColorPicker
A component for selecting and displaying colors.

```typescript
// Usage example
<ColorPicker color={color} onChange={handleColorChange} />
```

### Pages

- **Home**: Landing page with introduction and navigation
- **CreatePage**: Page containing the DecalCreator component
- **GalleryPage**: Displays all created decals in a grid
- **DecalDetailPage**: Shows detailed information about a specific decal

## Backend Services

### AIGenerationService
Handles communication with AI image generation APIs. Uses a provider pattern to support multiple AI services.

```typescript
// Usage example
const imageUrl = await aiGenerationService.generateDecalTexture(prompt, referenceImages);
```

### DecalGenerationService
Processes the AI-generated images into Rocket League-compatible decal packages.

```typescript
// Usage example
const zipPath = await decalGenerationService.generateDecal(prompt, colors, referenceImages);
```

## Database Schema

### Decal Model
```typescript
interface IDecal {
  _id: string;
  name: string;
  prompt: string;
  colors: string[];
  userId: string;
  imageUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
```

### User Model (Prepared for future implementation)
```typescript
interface IUser {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## AI Integration

The application integrates with AI image generation services through a flexible provider system:

### Provider Interface
```typescript
interface AIProvider {
  generateImage(prompt: string, referenceImages?: string[]): Promise<string>;
}
```

### Implemented Providers
- **OpenAIProvider**: Uses OpenAI's DALL-E 3 model
- **ReplicateProvider**: Prepared for integration with Replicate.com (Stable Diffusion)

### Prompt Engineering
The service enhances user prompts with specific instructions for generating Rocket League decal textures:

```typescript
private enhancePrompt(prompt: string): string {
  return `Create a seamless texture for a Rocket League car decal with the following design: ${prompt}. 
  The texture should be suitable for wrapping around a 3D car model, with clean edges and high contrast. 
  Make it visually striking with bold colors and clear design elements that would look good on a sports car in a video game.`;
}
```

## Decal Generation Pipeline

The decal generation process follows these steps:

1. **User Input**: Collect prompt and color preferences from the user
2. **AI Generation**: Send enhanced prompt to the AI service to generate the base texture
3. **Image Processing**: Download and process the generated image
4. **Configuration Creation**: Generate a JSON configuration file compatible with Bakkesmod/AlphaConsole
5. **Package Creation**: Bundle all necessary files into a ZIP archive
6. **Storage**: Store the package and update the database with download information

## Authentication System

The application includes hooks for user authentication, though this feature is not fully implemented in the current version. The architecture supports:

- User registration and login
- Secure password storage with hashing
- JWT-based authentication
- User-specific decal galleries

## Testing

The application includes comprehensive tests for both frontend and backend components:

### Backend Tests
- Unit tests for AI integration services
- Unit tests for decal generation pipeline
- API endpoint tests

### Frontend Tests
- Component tests for UI elements
- Page tests for user flows
- Integration tests for API communication

## Future Enhancements

The application is designed to be extensible. Planned future enhancements include:

- Support for additional Rocket League vehicles
- Advanced texture editing capabilities
- Community sharing features
- Custom AI model trained specifically on Rocket League decals
- Cloud storage integration for generated files
- Enhanced 3D preview with additional camera controls and lighting options
