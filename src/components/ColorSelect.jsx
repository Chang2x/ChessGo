import React from 'react';
import './ColorSelect.css';

const ColorSelect = ({ onSelect, onBack }) => {
    const handleColorSelect = (color) => {
        onSelect(color);
    };

    return (
        <div className="color-select-container">
            <div className="color-select-content">
                <h2>Choose Your Side</h2>
                <div className="color-options">
                    <button 
                        className="color-button white-option"
                        onClick={() => handleColorSelect('w')}
                    >
                        <div className="piece-preview">♔</div>
                        <span>Play as White</span>
                        <small>First to Move</small>
                    </button>
                    <button 
                        className="color-button black-option"
                        onClick={() => handleColorSelect('b')}
                    >
                        <div className="piece-preview">♚</div>
                        <span>Play as Black</span>
                        <small>Second to Move</small>
                    </button>
                    <button 
                        className="color-button random-option"
                        onClick={() => {
                            const colors = ['w', 'b'];
                            const randomColor = colors[Math.floor(Math.random() * colors.length)];
                            handleColorSelect(randomColor);
                        }}
                    >
                        <div className="piece-preview">?</div>
                        <span>Random</span>
                        <small>Let fate decide</small>
                    </button>
                </div>
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default ColorSelect;
