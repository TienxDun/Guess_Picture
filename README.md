# 🎮 Nhìn Hình Đoán Chữ (Picture Guessing Game)

A web-based picture guessing game that generates images using the Nana Banana API. Players see an AI-generated image and must guess the Vietnamese word or phrase that describes it.

## ✨ Features

- **AI-Generated Images**: Uses Nana Banana API to create unique images for each game
- **Interactive Letter Bank**: Drag and select letters to form your answer
- **Vietnamese Word Support**: Supports Vietnamese characters and phrases
- **Hint System**: Get hints when you're stuck
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern, gradient-based design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Nana Banana API key (get it from [nana-banana.com](https://nana-banana.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TienxDun/TienxDun.github.io.git
   cd TienxDun.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Nana Banana API key:
   ```
   NANA_BANANA_API_KEY=your_actual_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open the game**
   
   Navigate to `http://localhost:3000` in your web browser

## 📁 Project Structure

```
TienxDun.github.io/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling
│   └── game.js            # Game logic (frontend)
├── server.js              # Express backend server
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🎯 How to Play

1. **Start the Game**: A new image is automatically generated when you load the page
2. **Look at the Image**: Study the AI-generated image carefully
3. **Select Letters**: Click letters from the letter bank to fill in the word slots
4. **Check Answer**: Click "Kiểm Tra" (Check) to verify your answer
5. **Get Hints**: Click "Gợi Ý" (Hint) if you need help
6. **New Game**: Click "Chơi Mới" (New Game) to start over with a new image

## 🔧 API Integration

### Nana Banana API

The game uses the Nana Banana Image Generation API to create images. Here's how it works:

**Request Format:**
```javascript
POST https://api.nana-banana.com/v1/generate
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json
Body:
{
  "prompt": "con mèo",
  "model": "default",
  "width": 512,
  "height": 512
}
```

**Response Format:**
```javascript
{
  "imageUrl": "https://...",
  // or
  "url": "https://..."
}
```

### Backend API Endpoints

#### `POST /api/new-game`
Creates a new game with a random word and generated image.

**Response:**
```json
{
  "imageUrl": "https://...",
  "letterBank": ["c", "o", "n", "m", "è", "o", "a", "b", "d"],
  "wordStructure": [
    { "length": 3 },
    { "length": 3 }
  ]
}
```

#### `POST /api/check-answer`
Checks if the guessed word is correct.

**Request:**
```json
{
  "guess": "con mèo"
}
```

**Response:**
```json
{
  "correct": true,
  "answer": "con mèo"
}
```

#### `GET /api/hint`
Returns the first letter of each word as a hint.

**Response:**
```json
{
  "hints": ["c", "m"]
}
```

## 🎨 Customization

### Adding More Words

Edit the `wordList` array in `server.js`:

```javascript
const wordList = [
    'con mèo',
    'con chó',
    'your new word',
    // Add more words here
];
```

### Changing the Design

Modify `public/styles.css` to customize:
- Colors (change the gradient in `body`)
- Button styles (`.btn` classes)
- Layout and spacing
- Animations

### API Configuration

The API configuration can be modified in `server.js`:

```javascript
const response = await axios.post('https://api.nana-banana.com/v1/generate', {
    prompt: prompt,
    model: 'default',      // Change model
    width: 512,            // Change dimensions
    height: 512
}, {
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
});
```

## 🔒 Security

- **Environment Variables**: API keys are stored in `.env` file (not committed to git)
- **CORS**: Configured to accept requests from the same origin
- **API Key Protection**: API key is only used server-side, never exposed to frontend

## 🐛 Troubleshooting

### Image Not Loading

If images don't load, the game falls back to placeholder images. Check:
1. Your API key is correct in `.env`
2. You have internet connection
3. The Nana Banana API is accessible

### Port Already in Use

Change the port in `.env`:
```
PORT=3001
```

### Dependencies Issues

Clear npm cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you make changes.

### Testing the API

You can test the API endpoints using curl:

```bash
# Start a new game
curl -X POST http://localhost:3000/api/new-game

# Check an answer
curl -X POST http://localhost:3000/api/check-answer \
  -H "Content-Type: application/json" \
  -d '{"guess":"con mèo"}'

# Get a hint
curl http://localhost:3000/api/hint
```

## 🌐 Deployment

### Deploy to Heroku

1. Create a Heroku app
2. Set environment variables:
   ```bash
   heroku config:set NANA_BANANA_API_KEY=your_key
   ```
3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Vercel/Netlify

For static hosting platforms, you'll need to modify the backend to use serverless functions.

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

TienxDun

## 🙏 Acknowledgments

- Nana Banana API for image generation
- Express.js for the backend framework
- All contributors and testers

## 📮 Support

If you encounter issues or have questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue on GitHub

---

Made with ❤️ by TienxDun
