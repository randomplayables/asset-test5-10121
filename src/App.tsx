import RPLogo2_png from './assets/RPLogo2_png.png';
import React, { useState } from 'react';
import './styles.css';



export default function App() {
  const [target, setTarget] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('Guess a number between 1 and 100');
  const [attempts, setAttempts] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const handleGuess = () => {
    const num = parseInt(guess, 10);
    if (isNaN(num)) {
      setMessage('Please enter a valid number.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let result: 'low' | 'high' | 'correct';
    if (num < target) {
      setMessage('Too low!');
      result = 'low';
    } else if (num > target) {
      setMessage('Too high!');
      result = 'high';
    } else {
      setMessage(`Correct! You guessed it in ${newAttempts} attempts.`);
      setIsGameOver(true);
      result = 'correct';
    }

    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({ event: 'guess', guess: num, result, attempts: newAttempts });
      if (result === 'correct') {
        window.sendDataToGameLab({ event: 'win', attempts: newAttempts });
      }
    }

    setGuess('');
  };

  const handleRestart = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTarget(newTarget);
    setAttempts(0);
    setGuess('');
    setMessage('Guess a number between 1 and 100');
    setIsGameOver(false);
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({ event: 'restart' });
    }
  };

  return (
    <div className="App">
      <img src={RPLogo2_png} alt="Game Logo" className="logo" />
      <h1>Number Guessing Game</h1>
      <p className="message">{message}</p>
      {!isGameOver ? (
        <div className="input-group">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Your guess"
          />
          <button onClick={handleGuess}>Guess</button>
        </div>
      ) : (
        <button onClick={handleRestart}>Restart Game</button>
      )}
      <p className="attempts">Attempts: {attempts}</p>
    </div>
  );
}