# Unsplash Image Service Documentation

## Overview

`unsplash.js` is a service module that provides functionality to fetch images from the Unsplash API.
This module is part of the server-side implementation and is used to retrieve relevant images based
on search prompts, likely used in conjunction with other features of the application.

## File Location

```
server/unsplash.js
```

## Dependencies

- `node-fetch`: Used for making HTTP requests to the Unsplash API
- `dotenv`: Used to load environment variables from a `.env` file

## Environment Variables

- `UNSPLASH_API_KEY`: Required API key for authenticating with the Unsplash API

## Functions

### getUnsplashImages

```javascript
async getUnsplashImages(prompt: string): Promise<string[]>
```

#### Description

Fetches images from Unsplash based on a search prompt, returning an array of image URLs.

#### Parameters

- `prompt` (string): The search query to find relevant images on Unsplash

#### Returns

- Promise<string[]>: Returns a Promise that resolves to an array of 10 randomly selected image URLs
  from the search results

#### Process

1. Makes an API request to Unsplash's search endpoint
2. Retrieves up to 30 images matching the search query
3. Extracts the regular-sized image URLs from the results
4. Randomly shuffles the results
5. Returns 10 random images from the shuffled results

#### Error Handling

- Throws an error if the Unsplash API request fails, including the HTTP status code in the error
  message

## Usage Example

```javascript
import { getUnsplashImages } from './unsplash.js';

try {
    const imageUrls = await getUnsplashImages('nature');
    console.log('Retrieved images:', imageUrls);
} catch (error) {
    console.error('Failed to fetch images:', error);
}
```

## API Configuration

- Base URL: `https://api.unsplash.com/search/photos`
- Parameters:
    - `query`: Search term
    - `client_id`: Unsplash API key
    - `w`: Width of images (set to 800)
    - `per_page`: Number of results per page (set to 30)

## Integration Context

This module is likely used in conjunction with other server components to provide image content for
topics or other features in the application. Based on the project structure, it might be used by:

- Topic generation/creation
- Admin functionality
- Content management features

## Security Considerations

- The Unsplash API key is stored in environment variables for security
- API responses are validated before processing
- Error handling is implemented to prevent application crashes

## Notes

- The module returns 10 random images from up to 30 results to provide variety
- Image URLs are for regular-sized images from Unsplash
- The random selection process ensures different images may be returned for the same prompt
