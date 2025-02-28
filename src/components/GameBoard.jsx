import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessAI from '../ai/ChessAI';
import './GameBoard.css';

const GameBoard = ({ difficulty = 'medium', onBack }) => {
    const [game, setGame] = useState(() => new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [status, setStatus] = useState('');
    const [playerColor] = useState('w');
    const [ai] = useState(() => new ChessAI(difficulty));
    const [lastMove, setLastMove] = useState(null);

    const updateGameStatus = useCallback(() => {
        let status = '';
        if (game.isGameOver()) {
            if (game.isCheckmate()) {
                status = 'Checkmate! ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins!';
            } else if (game.isDraw()) {
                status = 'Draw!';
            } else {
                status = 'Game Over!';
            }
        } else if (game.isCheck()) {
            status = 'Check!';
        } else {
            status = game.turn() === 'w' ? 'White to move' : 'Black to move';
        }
        setStatus(status);
    }, [game]);

    const makeAIMove = useCallback(async () => {
        if (game.isGameOver() || game.turn() === playerColor) return;

        const move = await ai.getBestMove(game);
        if (move) {
            const result = game.move(move);
            setLastMove({ from: result.from, to: result.to });
            setGame(new Chess(game.fen()));
            updateGameStatus();
        }
    }, [game, playerColor, ai, updateGameStatus]);

    const handleSquareClick = useCallback((square) => {
        if (game.isGameOver() || game.turn() !== playerColor) return;

        if (selectedSquare) {
            // Try to make the move
            const move = {
                from: selectedSquare,
                to: square,
                promotion: 'q' // Always promote to queen for simplicity
            };

            try {
                const result = game.move(move);
                setLastMove({ from: result.from, to: result.to });
                setGame(new Chess(game.fen()));
                setSelectedSquare(null);
                updateGameStatus();

                // Trigger AI move after player's move
                setTimeout(makeAIMove, 250);
            } catch (error) {
                // Invalid move, just update selected square
                const piece = game.get(square);
                if (piece && piece.color === playerColor) {
                    setSelectedSquare(square);
                } else {
                    setSelectedSquare(null);
                }
            }
        } else {
            // Select the square if it has a piece of the current player's color
            const piece = game.get(square);
            if (piece && piece.color === playerColor) {
                setSelectedSquare(square);
            }
        }
    }, [game, playerColor, selectedSquare, makeAIMove, updateGameStatus]);

    useEffect(() => {
        updateGameStatus();
    }, [updateGameStatus]);

    const renderSquare = useCallback((square, i, j) => {
        const piece = game.get(square);
        const isSelected = square === selectedSquare;
        const isLight = (i + j) % 2 === 0;
        const isLastMove = lastMove && (square === lastMove.from || square === lastMove.to);

        const squareClass = `square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLastMove ? 'last-move' : ''}`;
        
        return (
            <div 
                key={square} 
                className={squareClass}
                onClick={() => handleSquareClick(square)}
            >
                {piece && (
                    <div className={`piece ${piece.color === 'w' ? 'white' : 'black'} ${isLastMove ? 'moving' : ''}`}>
                        {getPieceSymbol(piece)}
                    </div>
                )}
            </div>
        );
    }, [game, selectedSquare, lastMove, handleSquareClick]);

    const getPieceSymbol = (piece) => {
        const symbols = {
            'w': {
                'p': '♙', 'n': '♘', 'b': '♗',
                'r': '♖', 'q': '♕', 'k': '♔'
            },
            'b': {
                'p': '♟', 'n': '♞', 'b': '♝',
                'r': '♜', 'q': '♛', 'k': '♚'
            }
        };
        return symbols[piece.color][piece.type];
    };

    const renderBoard = () => {
        const board = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = String.fromCharCode(97 + j) + (8 - i);
                board.push(renderSquare(square, i, j));
            }
        }
        return board;
    };

    return (
        <div className="game-container">
            <div className="game-info">
                <div className="status">{status}</div>
                {onBack && (
                    <button className="back-button" onClick={onBack}>
                        Back to Menu
                    </button>
                )}
            </div>
            <div className="board">{renderBoard()}</div>
        </div>
    );
};

export default GameBoard;
