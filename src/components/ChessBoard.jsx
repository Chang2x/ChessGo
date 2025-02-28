import React, { useState, useEffect } from 'react';
import './ChessBoard.css';

const ChessBoard = ({ 
    gameState, 
    playerColor, 
    onSquareClick, 
    selectedSquare,
    lastMove,
    moveHistory = []
}) => {
    const [boardSize, setBoardSize] = useState(Math.min(window.innerWidth, window.innerHeight) * 0.8);

    useEffect(() => {
        const handleResize = () => {
            setBoardSize(Math.min(window.innerWidth, window.innerHeight) * 0.8);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPieceSymbol = (piece) => {
        if (!piece) return null;
        const symbols = {
            'w': { 'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔' },
            'b': { 'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚' }
        };
        return symbols[piece.color][piece.type];
    };

    const getSquareColor = (row, col, square) => {
        const isLight = (row + col) % 2 === 0;
        if (selectedSquare === square) {
            return 'selected';
        }
        if (lastMove && (lastMove.from === square || lastMove.to === square)) {
            return isLight ? 'light-highlighted' : 'dark-highlighted';
        }
        return isLight ? 'light' : 'dark';
    };

    const renderBoard = () => {
        const board = gameState.board();
        const rows = playerColor === 'b' ? [...board].reverse() : board;
        const files = playerColor === 'b' ? 'hgfedcba' : 'abcdefgh';
        const ranks = playerColor === 'b' ? '12345678' : '87654321';

        return (
            <div 
                className="board"
                style={{ 
                    width: Math.min(boardSize, 480),
                    height: Math.min(boardSize, 480)
                }}
            >
                {rows.map((row, i) => (
                    <div key={i} className="row">
                        {(playerColor === 'b' ? [...row].reverse() : row).map((piece, j) => {
                            const file = files[j];
                            const rank = ranks[i];
                            const square = file + rank;
                            
                            return (
                                <div
                                    key={square}
                                    className={`square ${getSquareColor(i, j, square)}`}
                                    onClick={() => onSquareClick(square)}
                                >
                                    {piece && (
                                        <div className={`piece ${piece.color === 'w' ? 'white' : 'black'}`}>
                                            {getPieceSymbol(piece)}
                                        </div>
                                    )}
                                    {j === 0 && <div className="rank-label">{rank}</div>}
                                    {i === 7 && <div className="file-label">{file}</div>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="board-container">
            {renderBoard()}
            <div className="move-history">
                <h3>Move History</h3>
                <div className="moves">
                    {moveHistory.map((move, index) => (
                        <span key={index} className="move">
                            {index % 2 === 0 ? `${Math.floor(index/2 + 1)}. ` : ''}{move}{' '}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;
