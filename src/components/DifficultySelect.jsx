import React from 'react';
import './DifficultySelect.css';

const DifficultySelect = ({ onSelect, onBack }) => {
  return (
    <div className="difficulty-screen">
      <div className="difficulty-content">
        <div className="chess-pieces-bg">
          <span className="bg-piece">♔</span>
          <span className="bg-piece">♕</span>
          <span className="bg-piece">♖</span>
          <span className="bg-piece">♗</span>
          <span className="bg-piece">♘</span>
          <span className="bg-piece">♙</span>
        </div>
        
        <h2>Select Difficulty</h2>
        
        <div className="difficulty-buttons">
          <button 
            className="difficulty-btn easy"
            onClick={() => onSelect('easy')}
          >
            <span className="btn-icon">♙</span>
            <div className="btn-content">
              <span className="btn-title">Easy</span>
              <span className="btn-desc">Perfect for beginners</span>
            </div>
          </button>

          <button 
            className="difficulty-btn medium"
            onClick={() => onSelect('medium')}
          >
            <span className="btn-icon">♘</span>
            <div className="btn-content">
              <span className="btn-title">Medium</span>
              <span className="btn-desc">For intermediate players</span>
            </div>
          </button>

          <button 
            className="difficulty-btn hard"
            onClick={() => onSelect('hard')}
          >
            <span className="btn-icon">♕</span>
            <div className="btn-content">
              <span className="btn-title">Hard</span>
              <span className="btn-desc">Challenge yourself</span>
            </div>
          </button>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default DifficultySelect;
