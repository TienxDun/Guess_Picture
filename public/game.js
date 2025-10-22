// API Base URL
const API_URL = window.location.origin;

// Game state
let currentGame = {
    imageUrl: '',
    letterBank: [],
    wordStructure: [],
    userInput: [],
    usedLetters: new Set()
};

// DOM Elements
const loadingEl = document.getElementById('loading');
const gameAreaEl = document.getElementById('gameArea');
const gameImageEl = document.getElementById('gameImage');
const wordInputEl = document.getElementById('wordInput');
const letterBankEl = document.getElementById('letterBank');
const checkBtn = document.getElementById('checkBtn');
const hintBtn = document.getElementById('hintBtn');
const newGameBtn = document.getElementById('newGameBtn');
const messageEl = document.getElementById('message');

/**
 * Initialize a new game
 */
async function startNewGame() {
    try {
        showLoading(true);
        hideMessage();
        
        const response = await fetch(`${API_URL}/api/new-game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to start new game');
        }
        
        const data = await response.json();
        
        currentGame = {
            imageUrl: data.imageUrl,
            letterBank: data.letterBank,
            wordStructure: data.wordStructure,
            userInput: [],
            usedLetters: new Set()
        };
        
        // Initialize user input array
        data.wordStructure.forEach(word => {
            const wordArray = new Array(word.length).fill('');
            currentGame.userInput.push(wordArray);
        });
        
        renderGame();
        showLoading(false);
        
    } catch (error) {
        console.error('Error starting new game:', error);
        showMessage('Không thể tải trò chơi. Vui lòng thử lại!', 'error');
        showLoading(false);
    }
}

/**
 * Render the game UI
 */
function renderGame() {
    // Display image
    gameImageEl.src = currentGame.imageUrl;
    
    // Render word input slots
    renderWordInput();
    
    // Render letter bank
    renderLetterBank();
}

/**
 * Render word input slots
 */
function renderWordInput() {
    wordInputEl.innerHTML = '';
    
    currentGame.wordStructure.forEach((word, wordIndex) => {
        const wordGroup = document.createElement('div');
        wordGroup.className = 'word-group';
        
        for (let i = 0; i < word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'letter-slot';
            slot.dataset.wordIndex = wordIndex;
            slot.dataset.letterIndex = i;
            
            const letter = currentGame.userInput[wordIndex][i];
            if (letter) {
                slot.textContent = letter;
                slot.classList.add('filled');
            }
            
            // Click to remove letter
            slot.addEventListener('click', () => {
                if (letter) {
                    removeLetter(wordIndex, i);
                }
            });
            
            wordGroup.appendChild(slot);
        }
        
        wordInputEl.appendChild(wordGroup);
    });
}

/**
 * Render letter bank
 */
function renderLetterBank() {
    letterBankEl.innerHTML = '';
    
    currentGame.letterBank.forEach((letter, index) => {
        const letterBtn = document.createElement('button');
        letterBtn.className = 'letter';
        letterBtn.textContent = letter;
        letterBtn.dataset.letter = letter;
        letterBtn.dataset.index = index;
        
        if (currentGame.usedLetters.has(index)) {
            letterBtn.classList.add('used');
        } else {
            letterBtn.addEventListener('click', () => addLetter(letter, index));
        }
        
        letterBankEl.appendChild(letterBtn);
    });
}

/**
 * Add a letter to the word input
 */
function addLetter(letter, bankIndex) {
    // Find the first empty slot
    for (let wordIndex = 0; wordIndex < currentGame.userInput.length; wordIndex++) {
        const word = currentGame.userInput[wordIndex];
        const emptyIndex = word.findIndex(l => l === '');
        
        if (emptyIndex !== -1) {
            currentGame.userInput[wordIndex][emptyIndex] = letter;
            currentGame.usedLetters.add(bankIndex);
            renderGame();
            return;
        }
    }
}

/**
 * Remove a letter from the word input
 */
function removeLetter(wordIndex, letterIndex) {
    const letter = currentGame.userInput[wordIndex][letterIndex];
    
    if (letter) {
        // Find the letter in the bank and mark it as unused
        const bankIndex = currentGame.letterBank.findIndex((l, i) => 
            l === letter && currentGame.usedLetters.has(i)
        );
        
        if (bankIndex !== -1) {
            currentGame.usedLetters.delete(bankIndex);
        }
        
        currentGame.userInput[wordIndex][letterIndex] = '';
        renderGame();
    }
}

/**
 * Check the user's answer
 */
async function checkAnswer() {
    try {
        // Build the guess from user input
        const guess = currentGame.userInput
            .map(word => word.join(''))
            .join(' ')
            .trim();
        
        if (!guess || guess.includes('')) {
            showMessage('Vui lòng điền đầy đủ các chữ cái!', 'error');
            return;
        }
        
        const response = await fetch(`${API_URL}/api/check-answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guess })
        });
        
        const data = await response.json();
        
        if (data.correct) {
            showMessage(`🎉 Chính xác! Đáp án là: "${data.answer}"`, 'success');
            
            // Disable buttons temporarily
            checkBtn.disabled = true;
            hintBtn.disabled = true;
            
            setTimeout(() => {
                checkBtn.disabled = false;
                hintBtn.disabled = false;
            }, 3000);
        } else {
            showMessage('❌ Sai rồi! Thử lại nhé!', 'error');
        }
        
    } catch (error) {
        console.error('Error checking answer:', error);
        showMessage('Lỗi khi kiểm tra đáp án!', 'error');
    }
}

/**
 * Get a hint
 */
async function getHint() {
    try {
        const response = await fetch(`${API_URL}/api/hint`);
        const data = await response.json();
        
        if (data.hints) {
            const hintText = data.hints.map((h, i) => `Từ ${i + 1}: Bắt đầu bằng "${h}"`).join(', ');
            showMessage(`💡 Gợi ý: ${hintText}`, 'info');
        }
        
    } catch (error) {
        console.error('Error getting hint:', error);
        showMessage('Không thể lấy gợi ý!', 'error');
    }
}

/**
 * Show/hide loading state
 */
function showLoading(show) {
    if (show) {
        loadingEl.style.display = 'block';
        gameAreaEl.style.display = 'none';
    } else {
        loadingEl.style.display = 'none';
        gameAreaEl.style.display = 'block';
    }
}

/**
 * Show a message
 */
function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

/**
 * Hide message
 */
function hideMessage() {
    messageEl.textContent = '';
    messageEl.className = 'message';
}

// Event listeners
checkBtn.addEventListener('click', checkAnswer);
hintBtn.addEventListener('click', getHint);
newGameBtn.addEventListener('click', startNewGame);

// Start the first game when page loads
window.addEventListener('DOMContentLoaded', startNewGame);
