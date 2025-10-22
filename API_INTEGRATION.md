# API Integration Guide

## Nana Banana API Integration

This document explains how the Picture Guessing Game integrates with the Nana Banana Image Generation API.

### API Configuration

The API key is stored securely in the `.env` file:

```bash
NANA_BANANA_API_KEY=your_actual_api_key_here
```

### How It Works

1. **Game Initialization**: When a new game starts, the backend selects a random Vietnamese word from the word list.

2. **Image Generation**: The word is sent to the Nana Banana API to generate an image.

3. **API Request Format**:
```javascript
POST https://api.nana-banana.com/v1/generate
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "prompt": "con mèo",  // The Vietnamese word
  "model": "default",
  "width": 512,
  "height": 512
}
```

4. **API Response**: The API returns an image URL that is displayed to the player.

5. **Fallback**: If the API is unavailable or returns an error, the game uses a placeholder image to ensure the game continues working.

### Customizing the API Integration

You can modify the API configuration in `server.js`:

```javascript
// Change the API endpoint
const response = await axios.post('https://api.nana-banana.com/v1/generate', {
    prompt: prompt,
    model: 'default',      // Try different models
    width: 512,            // Adjust image size
    height: 512,
    // Add more parameters as needed
}, {
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
});
```

### Adding More Words

To add more words to the game, edit the `wordList` array in `server.js`:

```javascript
const wordList = [
    'con mèo',      // cat
    'con chó',      // dog
    'bông hoa',     // flower
    // Add your words here
    'your new word',
];
```

### Error Handling

The application includes comprehensive error handling:

1. **Missing API Key**: Shows a clear error message
2. **API Unavailable**: Falls back to placeholder images
3. **Network Errors**: Logged to console, game continues with fallback

### Testing Without API Key

You can test the game without a real API key. The application will use placeholder images that display the word text, allowing you to test all game functionality.

### Security Best Practices

1. **Never commit `.env`**: The `.gitignore` file ensures this
2. **Use environment variables**: API keys are never exposed to frontend
3. **Validate API responses**: The backend validates all API responses before sending to frontend
4. **CORS protection**: Only accepts requests from the same origin

### API Response Handling

The backend handles different response formats from the API:

```javascript
// The API might return the image URL in different fields
return response.data.imageUrl || response.data.url;
```

This ensures compatibility even if the API response structure changes.

### Rate Limiting

If you encounter rate limiting issues:

1. Add caching to store generated images
2. Implement a delay between API calls
3. Consider upgrading your API plan
4. Use the placeholder fallback during development

## Troubleshooting

### API Key Not Working

1. Verify the key is correct in `.env`
2. Check if the key has expired
3. Ensure there are no extra spaces in the `.env` file
4. Restart the server after updating `.env`

### Images Not Loading

1. Check browser console for errors
2. Verify the API endpoint is accessible
3. Check CORS configuration
4. Review API response in network tab

### Server Errors

1. Check server logs: `npm start`
2. Verify all dependencies are installed: `npm install`
3. Ensure `.env` file exists
4. Check port availability (default: 3000)

## Next Steps

- Add image caching to reduce API calls
- Implement difficulty levels
- Add score tracking
- Support for custom word lists
- Multi-language support
