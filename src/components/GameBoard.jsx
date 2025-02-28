import React, { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';
import ChessAI from '../ai/ChessAI';
import './GameBoard.css';

const GameBoard = ({ difficulty = 'medium', playerColor = 'w', onBack }) => {
    const [game, setGame] = useState(() => new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [status, setStatus] = useState('');
    const [ai] = useState(() => new ChessAI(difficulty));
    const [lastMove, setLastMove] = useState(null);
    const [showResignDialog, setShowResignDialog] = useState(false);
    const [moveHistory, setMoveHistory] = useState([]);
    const [promotionSquare, setPromotionSquare] = useState(null);

    const updateGameStatus = useCallback(() => {
        let status = '';
        if (game.isGameOver()) {
            if (game.isCheckmate()) {
                status = 'Checkmate! ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins!';
            } else if (game.isDraw()) {
                if (game.isStalemate()) {
                    status = 'Draw by stalemate!';
                } else if (game.isThreefoldRepetition()) {
                    status = 'Draw by threefold repetition!';
                } else if (game.isInsufficientMaterial()) {
                    status = 'Draw by insufficient material!';
                } else {
                    status = 'Draw!';
                }
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
            if (result) {
                setLastMove({ from: move.from, to: move.to });
                setMoveHistory(prev => [...prev, result.san]);
                setGame(new Chess(game.fen()));
                updateGameStatus();
            }
        }
    }, [game, playerColor, ai, updateGameStatus]);

    const handleSquareClick = useCallback((square) => {
        if (game.isGameOver() || game.turn() !== playerColor) return;

        if (selectedSquare) {
            const moveDetails = {
                from: selectedSquare,
                to: square
            };

            // Check for pawn promotion
            const piece = game.get(selectedSquare);
            if (piece && 
                piece.type === 'p' && 
                ((piece.color === 'w' && square[1] === '8') || 
                 (piece.color === 'b' && square[1] === '1'))) {
                setPromotionSquare({ from: selectedSquare, to: square });
                setSelectedSquare(null);
                return;
            }

            try {
                const result = game.move(moveDetails);
                if (result) {
                    setLastMove({ from: result.from, to: result.to });
                    setMoveHistory(prev => [...prev, result.san]);
                    setGame(new Chess(game.fen()));
                    setSelectedSquare(null);
                    updateGameStatus();
                    setTimeout(makeAIMove, 250);
                }
            } catch (error) {
                const piece = game.get(square);
                if (piece && piece.color === playerColor) {
                    setSelectedSquare(square);
                } else {
                    setSelectedSquare(null);
                }
            }
        } else {
            const piece = game.get(square);
            if (piece && piece.color === playerColor) {
                setSelectedSquare(square);
            }
        }
    }, [game, playerColor, selectedSquare, makeAIMove, updateGameStatus]);

    const handlePromotion = useCallback((promotionPiece) => {
        if (!promotionSquare) return;

        const { from, to } = promotionSquare;
        const move = game.move({
            from,
            to,
            promotion: promotionPiece
        });

        if (move) {
            setLastMove({ from, to });
            setMoveHistory(prev => [...prev, move.san]);
            setGame(new Chess(game.fen()));
            updateGameStatus();
            setTimeout(makeAIMove, 250);
        }

        setPromotionSquare(null);
    }, [game, promotionSquare, makeAIMove, updateGameStatus]);

    useEffect(() => {
        updateGameStatus();
        if (playerColor === 'b') {
            makeAIMove();
        }
    }, []);

    const handleResign = () => {
        // Add resetting class to all pieces
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach(piece => {
          piece.classList.add('resetting');
        });

        // Reset the game state after animation
        setTimeout(() => {
          const initialBoard = new Chess();
          setGame(initialBoard);
          setSelectedSquare(null);
          setMoveHistory([]);
          setStatus('Game Over - Resigned');
          setShowResignDialog(false);
          
          // Remove animation class
          pieces.forEach(piece => {
            piece.classList.remove('resetting');
          });
        }, 500);
    };

    return (
        <div className="game-container">
            <div className="game-controls">
                <button className="back-button" onClick={onBack}>← Back</button>
                <div className="status">{status}</div>
                <button className="resign-button" onClick={() => setShowResignDialog(true)}>Resign</button>
            </div>
            
            <ChessBoard
                gameState={game}
                playerColor={playerColor}
                onSquareClick={handleSquareClick}
                selectedSquare={selectedSquare}
                lastMove={lastMove}
                moveHistory={moveHistory}
            />

            {showResignDialog && (
                <div className="overlay">
                    <div className="resign-dialog">
                        <h3>Resign Game</h3>
                        <p>Are you sure you want to resign?</p>
                        <div className="resign-dialog-buttons">
                            <button className="cancel-resign" onClick={() => setShowResignDialog(false)}>Cancel</button>
                            <button className="confirm-resign" onClick={handleResign}>Resign</button>
                        </div>
                    </div>
                </div>
            )}

            {promotionSquare && (
                <div className="overlay">
                    <div className="promotion-dialog">
                        <h3>Choose Promotion Piece</h3>
                        <div className="promotion-options">
                            <button className="promotion-piece" onClick={() => handlePromotion('q')}>♕</button>
                            <button className="promotion-piece" onClick={() => handlePromotion('r')}>♖</button>
                            <button className="promotion-piece" onClick={() => handlePromotion('b')}>♗</button>
                            <button className="promotion-piece" onClick={() => handlePromotion('n')}>♘</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;
