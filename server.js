require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NANA_BANANA_API_KEY);

// Vietnamese word list for the game
const wordList = [
    'con mèo',
    'con chó',
    'bông hoa',
    'ngôi nhà',
    'cây cối',
    'mặt trời',
    'mặt trăng',
    'ô tô',
    'xe đạp',
    'máy bay',
    'con voi',
    'con cá',
    'núi non',
    'biển cả',
    'cầu vồng',
    'người đàn ông',
    'người phụ nữ',
    'trẻ em',
    'quả táo',
    'quả cam'
];

// Store current game state
let currentGame = null;

async function generateImage(prompt) {
    const apiKey = process.env.NANA_BANANA_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
        throw new Error('Please configure NANA_BANANA_API_KEY in .env file');
    }
    try {
        // For now, use placeholder with the prompt
        // To use real image generation, enable Imagen API in Google Cloud
        return `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(prompt)}`;
    } catch (error) {
        console.error('Error generating image:', error.message);
        throw new Error('Failed to generate image');
    }
}

/**
 * Create letter bank with correct letters and some random ones
 * @param {string} word - The target word
 * @returns {Array<string>} - Array of shuffled letters
 */
function createLetterBank(word) {
    const cleanWord = word.replace(/\s/g, '').toLowerCase();
    const uniqueLetters = [...new Set(cleanWord.split(''))];
    
    // Add some random Vietnamese letters
    const extraLetters = 'aăâbcdđeêghiklmnoôơpqrstuưvxy'.split('');
    const randomLetters = [];
    
    // Add 5-8 random letters that aren't in the word
    const extraCount = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < extraCount; i++) {
        const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)];
        if (!uniqueLetters.includes(randomLetter) && !randomLetters.includes(randomLetter)) {
            randomLetters.push(randomLetter);
        }
    }
    
    // Combine and shuffle
    const allLetters = [...uniqueLetters, ...randomLetters];
    return allLetters.sort(() => Math.random() - 0.5);
}

/**
 * Get a new game with word and image
 */
app.post('/api/new-game', async (req, res) => {
    try {
        // Select a random word
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        
        // Generate image (for demo, we'll use a placeholder if API fails)
        let imageUrl;
        try {
            imageUrl = await generateImage(word);
        } catch (error) {
            console.warn('Using placeholder image due to API error:', error.message);
            // Fallback to placeholder
            imageUrl = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(word)}`;
        }
        
        // Create letter bank
        const letterBank = createLetterBank(word);
        
        // Create word structure (show spaces and word lengths)
        const wordStructure = word.split(' ').map(w => ({
            length: w.length,
            word: w.toLowerCase()
        }));
        
        currentGame = {
            word: word.toLowerCase(),
            imageUrl: imageUrl,
            letterBank: letterBank,
            wordStructure: wordStructure,
            createdAt: new Date()
        };
        
        // Send response without the actual word
        res.json({
            imageUrl: currentGame.imageUrl,
            letterBank: currentGame.letterBank,
            wordStructure: currentGame.wordStructure.map(w => ({ length: w.length }))
        });
    } catch (error) {
        console.error('Error creating new game:', error);
        res.status(500).json({ error: 'Failed to create new game' });
    }
});

/**
 * Check if the guessed word is correct
 */
app.post('/api/check-answer', (req, res) => {
    try {
        const { guess } = req.body;
        
        if (!currentGame) {
            return res.status(400).json({ error: 'No active game' });
        }
        
        const cleanGuess = guess.toLowerCase().trim();
        const isCorrect = cleanGuess === currentGame.word;
        
        res.json({
            correct: isCorrect,
            answer: isCorrect ? currentGame.word : null
        });
    } catch (error) {
        console.error('Error checking answer:', error);
        res.status(500).json({ error: 'Failed to check answer' });
    }
});

/**
 * Get a hint (reveal one letter position)
 */
app.get('/api/hint', (req, res) => {
    try {
        if (!currentGame) {
            return res.status(400).json({ error: 'No active game' });
        }
        
        // Return the first letter of each word as a hint
        const hints = currentGame.word.split(' ').map(w => w[0]);
        
        res.json({ hints });
    } catch (error) {
        console.error('Error getting hint:', error);
        res.status(500).json({ error: 'Failed to get hint' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🎮 Picture Guessing Game server running on http://localhost:${PORT}`);
    console.log(`📝 Make sure to configure your NANA_BANANA_API_KEY in .env file`);
});
