import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (attempts >= 6 || gameOver) return

    try {
      const response = await axios.post('http://localhost:5000/guess', { guess })
      setFeedback(response.data)
      setAttempts(attempts + 1)
      if (response.data.isCorrect || attempts + 1 >= 6) {
        setGameOver(true)
      }
      setGuess('')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="App">
      <h1>Dotan's Wordle WebApp</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          maxLength={5}
          disabled={gameOver}
        />
        <button type="submit" disabled={gameOver}>Guess</button>
      </form>
      {feedback && (
        <div>
          <p>Green letters: {feedback.greenLetters.join('')}</p>
          <p>Orange letters: {feedback.orangeLetters.join(', ')}</p>
          <p>Gray letters: {feedback.grayLetters.join(', ')}</p>
        </div>
      )}
      <p>Attempts: {attempts}/6</p>
      {gameOver && <p>{feedback?.isCorrect ? 'You won!' : 'Game over!'}</p>}
    </div>
  )
}

export default App