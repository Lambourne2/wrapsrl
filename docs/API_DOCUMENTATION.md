# Rocket League Decal Generator - API Documentation

This document provides detailed information about the API endpoints available in the Rocket League Decal Generator application. It is intended for developers who want to integrate with or extend the application.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api
```

For production deployments, replace with your actual domain.

## Authentication

Authentication is prepared but not fully implemented in the current version. When implemented, most endpoints will require authentication via JWT tokens.

## Response Format

All responses are returned in JSON format. Successful responses typically include:

```json
{
  "data": { ... },  // The requested data
  "message": "...", // A human-readable message
  "status": "..."   // Status indicator (success, error, etc.)
}
```

Error responses include:

```json
{
  "message": "Error message",
  "status": "error"
}
```

## Endpoints

### Health Check

#### GET /health

Check if the API server is running.

**Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Decals

#### POST /decals/generate

Generate a new decal based on the provided prompt and colors.

**Request Body**:
- `prompt` (string, required): Description of the desired decal
- `colors` (array of strings, required): Array of hex color codes
- `userId` (string, optional): User ID for authentication
- `referenceImages` (files, optional): Image files to use as references

**Example Request**:
```json
{
  "prompt": "flaming cybernetic wolf",
  "colors": ["#FF0000", "#000000", "#FFFFFF"],
  "userId": "user123"
}
```

**Response**:
```json
{
  "message": "Decal generation started",
  "decalId": "60f1a5b3e6b3f32a4c9b4567",
  "status": "processing"
}
```

#### GET /decals

Retrieve a list of decals.

**Query Parameters**:
- `userId` (string, optional): Filter decals by user ID

**Response**:
```json
{
  "decals": [
    {
      "_id": "60f1a5b3e6b3f32a4c9b4567",
      "name": "flaming cybernetic wolf",
      "prompt": "flaming cybernetic wolf",
      "colors": ["#FF0000", "#000000", "#FFFFFF"],
      "userId": "user123",
      "status": "completed",
      "imageUrl": "http://example.com/image.png",
      "previewUrl": "http://example.com/preview.png",
      "downloadUrl": "http://example.com/download.zip",
      "createdAt": "2025-04-09T12:00:00.000Z",
      "updatedAt": "2025-04-09T12:05:00.000Z"
    },
    // More decals...
  ]
}
```

#### GET /decals/:id

Retrieve a specific decal by ID.

**URL Parameters**:
- `id` (string, required): The ID of the decal to retrieve

**Response**:
```json
{
  "decal": {
    "_id": "60f1a5b3e6b3f32a4c9b4567",
    "name": "flaming cybernetic wolf",
    "prompt": "flaming cybernetic wolf",
    "colors": ["#FF0000", "#000000", "#FFFFFF"],
    "userId": "user123",
    "status": "completed",
    "imageUrl": "http://example.com/image.png",
    "previewUrl": "http://example.com/preview.png",
    "downloadUrl": "http://example.com/download.zip",
    "createdAt": "2025-04-09T12:00:00.000Z",
    "updatedAt": "2025-04-09T12:05:00.000Z"
  }
}
```

#### GET /decals/download/:id

Download a specific decal package.

**URL Parameters**:
- `id` (string, required): The ID of the decal to download

**Response**:
- If successful, returns the download URL
- If the decal is not ready, returns an error message

```json
{
  "downloadUrl": "http://example.com/download.zip"
}
```

### Users

These endpoints are prepared but not fully implemented in the current version.

#### POST /users/register

Register a new user.

**Request Body**:
- `username` (string, required): User's username
- `email` (string, required): User's email address
- `password` (string, required): User's password

**Example Request**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "message": "User registration endpoint (placeholder)",
  "received": {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "[REDACTED]"
  }
}
```

#### POST /users/login

Log in a user.

**Request Body**:
- `email` (string, required): User's email address
- `password` (string, required): User's password

**Example Request**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "message": "User login endpoint (placeholder)",
  "received": {
    "email": "john@example.com",
    "password": "[REDACTED]"
  }
}
```

#### GET /users/profile/:id

Retrieve a user's profile.

**URL Parameters**:
- `id` (string, required): The ID of the user to retrieve

**Response**:
```json
{
  "message": "Get user profile endpoint (placeholder)",
  "userId": "user123"
}
```

## Error Codes

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: The request was successful
- `202 Accepted`: The request has been accepted for processing (async operations)
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required or failed
- `404 Not Found`: The requested resource does not exist
- `500 Internal Server Error`: An error occurred on the server

## Rate Limiting

The current version does not implement rate limiting, but it is recommended for production deployments.

## Versioning

The API does not currently use versioning in the URL path. Future versions may implement this as `/api/v1/`, etc.

## CORS

The API is configured to allow cross-origin requests from the frontend application domain. For development, this is typically `http://localhost:3000`.

## Webhook Support

The current version does not implement webhooks, but future versions may add support for notifications when decal generation is complete.

## Example Usage

### Generating a Decal with cURL

```bash
curl -X POST http://localhost:5000/api/decals/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"flaming cybernetic wolf","colors":["#FF0000","#000000","#FFFFFF"],"userId":"anonymous"}'
```

### Checking Decal Status with cURL

```bash
curl -X GET http://localhost:5000/api/decals/60f1a5b3e6b3f32a4c9b4567
```

### Downloading a Decal with cURL

```bash
curl -X GET http://localhost:5000/api/decals/download/60f1a5b3e6b3f32a4c9b4567
```
