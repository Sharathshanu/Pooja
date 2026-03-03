import React, { useEffect } from 'react';
import './Birthday.css';
import birthdayImage from '../assets/ii.jpeg';
import confetti from 'canvas-confetti';

const Birthday = () => {

  useEffect(() => {
    // Blast confetti when the component mounts
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Optional: make continuous bursts for 2 seconds
    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 300);

    setTimeout(() => clearInterval(interval), 2000); // Stop after 2 seconds
  }, []);

  return (
    <div className="birthday-container">
      {/* Top greeting text */}
      <div className="birthday-greeting">
        <h1 className="greeting-text">Happy Birthday Mami</h1>
      </div>

      {/* Main content area */}
      <div className="birthday-content">
        <img src={birthdayImage} alt="Birthday" className="birthday-image" />

        <div className="birthday-message">
          <p className="wish-text">
            Wishing you a day filled with happiness and a year filled with joy!
          </p>
        </div>
      </div>

      {/* Developer credit */}
      <div className="developer-credit">
        <p>By Shanu</p>
      </div>
    </div>
  );
};

export default Birthday;