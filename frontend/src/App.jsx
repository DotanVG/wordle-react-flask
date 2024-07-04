import React, { useState, useEffect } from 'react'
import './App.css'
import useApi from './useApi'

// Keyboard component
const Keyboard = ({ onKeyPress, usedLetters }) => {
  const rows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['ENTER', ...'ZXCVBNM'.split(''), 'BACKSPACE']
  ];

  return (
    <div className="keyboard">
      {rows.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`key ${usedLetters[key] || ''}`}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

function App() {
  // State variables
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [guesses, setGuesses] = useState([])
  const [usedLetters, setUsedLetters] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [secretWord, setSecretWord] = useState('')
  const [error, setError] = useState(null);

  const apiCall = useApi();

  // Start a new game when the component mounts
  useEffect(() => {
    startNewGame();
  }, []);

  // Add keyboard event listeners for physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (event.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Za-z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guess, attempts, gameOver]);

// Function to start a new game
const startNewGame = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const data = await apiCall('get', '/new-game');
    setSecretWord(data.word || '');
    // Reset all game state
    setGuess('');
    setFeedback(null);
    setAttempts(0);
    setGameOver(false);
    setGuesses([]);
    setUsedLetters({});
  } catch (error) {
    console.error('Error starting new game:', error);
    setError('Failed to start a new game. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  // Function to handle guess submission
  const handleSubmit = async () => {
    if (attempts >= 6 || gameOver || guess.length !== 5) return

    try {
      const data = await apiCall('post', '/guess', { guess });
      setFeedback(data)
      setAttempts(attempts + 1)
      setGuesses([...guesses, { word: guess, feedback: data }])
      updateUsedLetters(guess, data)
      if (data.isCorrect || attempts + 1 >= 6) {
        setGameOver(true)
      }
      setGuess('')
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to submit guess. Please try again.');
    }
  }

  // Function to update the state of used letters
  const updateUsedLetters = (guess, feedback) => {
    const newUsedLetters = { ...usedLetters };
    guess.split('').forEach((letter, index) => {
      if (feedback.greenLetters[index] === letter) {
        newUsedLetters[letter] = 'green';
      } else if (feedback.orangeLetters.includes(letter)) {
        newUsedLetters[letter] = newUsedLetters[letter] !== 'green' ? 'orange' : newUsedLetters[letter];
      } else {
        newUsedLetters[letter] = newUsedLetters[letter] ? newUsedLetters[letter] : 'gray';
      }
    });
    setUsedLetters(newUsedLetters);
  };

  // Function to handle key presses on the virtual keyboard
  const handleKeyPress = (key) => {
    if (key === 'ENTER') {
      handleSubmit();
    } else if (key === 'BACKSPACE') {
      setGuess(prev => prev.slice(0, -1));
    } else if (guess.length < 5) {
      setGuess(prev => (prev + key).slice(0, 5));
    }
  };

  if (isLoading) {
    return (
      <div className="App">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <p>{error}</p>
        <button onClick={startNewGame}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Dotan's Wordle WebApp</h1>
      <div className="game-board">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="word-row">
            {[...Array(5)].map((_, j) => (
              <div key={j} className={`letter-box ${
                guesses[i] ? 
                  guesses[i].feedback.greenLetters[j] === guesses[i].word[j] ? 
                    'green' : 
                    guesses[i].feedback.orangeLetters.includes(guesses[i].word[j]) ? 
                      'orange' : 
                      'gray' 
                  : i === attempts ? 'current' : ''
              }`}>
                {guesses[i] ? guesses[i].word[j] : i === attempts ? guess[j] || '' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p>Attempts: {attempts}/6</p>
      {gameOver && (
        <p>
          {feedback?.isCorrect ? 'You won!' : `Game over! The word was: ${secretWord}`}
        </p>
      )}
      {gameOver && <button onClick={startNewGame}>New Game</button>}
      <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />
    </div>
  )
}

export default App