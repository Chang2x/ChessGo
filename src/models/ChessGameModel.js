import { Chess } from 'chess.js';
import ChessAI from '../ai/ChessAI';

class ChessGameModel {
    constructor(difficulty = 'medium') {
        this.game = new Chess();
        this.history = [];
        this.ai = new ChessAI(difficulty);
        this.isAIEnabled = true;
        this.moveCallbacks = [];
        this.isAIThinking = false;
        this.gameStarted = false;
    }

    addMoveCallback(callback) {
        this.moveCallbacks.push(callback);
    }

    notifyMoveCallbacks() {
        this.moveCallbacks.forEach(callback => callback(this.getGameState()));
    }

    makeAIMove() {
        if (!this.isAIEnabled || this.game.isGameOver()) {
            return false;
        }

        this.isAIThinking = true;
        this.notifyMoveCallbacks();

        // Use setTimeout to make AI moves non-blocking
        setTimeout(() => {
            if (!this.game.isGameOver()) {
                const aiMove = this.ai.getBestMove(this.game);
                if (aiMove) {
                    const result = this.game.move(aiMove);
                    if (result) {
                        this.history.push(result);
                        this.notifyMoveCallbacks();
                    }
                }
            }
            this.isAIThinking = false;
            this.notifyMoveCallbacks();
        }, 1000);

        return true;
    }

    makeMove(move) {
        try {
            // Don't allow moves if AI is thinking
            if (this.isAIThinking) {
                return false;
            }

            const result = this.game.move(move);
            if (result) {
                this.history.push(result);
                this.notifyMoveCallbacks();

                // Start AI move process if it's AI's turn
                if (this.isAIEnabled && !this.game.isGameOver()) {
                    this.makeAIMove();
                }

                return true;
            }
            return false;
        } catch (error) {
            console.error('Move error:', error);
            this.isAIThinking = false;
            return false;
        }
    }

    startGame(playerColor = 'w') {
        this.gameStarted = true;
        this.resetGame();
        
        // If AI plays white, make the first move
        if (playerColor === 'b' && this.isAIEnabled) {
            this.makeAIMove();
        }
    }

    undoMove() {
        // Don't allow undo if AI is thinking
        if (this.isAIThinking) {
            return false;
        }

        // Undo both player's move and AI's move
        if (this.isAIEnabled) {
            const move1 = this.game.undo();
            const move2 = this.game.undo();
            if (move1 && move2) {
                this.history.pop();
                this.history.pop();
                this.notifyMoveCallbacks();
                return true;
            }
        } else {
            const move = this.game.undo();
            if (move) {
                this.history.pop();
                this.notifyMoveCallbacks();
                return true;
            }
        }
        return false;
    }

    setDifficulty(difficulty) {
        this.ai.setDifficulty(difficulty);
    }

    toggleAI(enabled) {
        this.isAIEnabled = enabled;
        if (enabled && this.gameStarted && this.game.turn() === 'b') {
            this.makeAIMove();
        }
    }

    getLegalMoves() {
        return this.game.moves({ verbose: true });
    }

    getFEN() {
        return this.game.fen();
    }

    isGameOver() {
        return this.game.isGameOver();
    }

    resetGame() {
        this.game.reset();
        this.history = [];
        this.isAIThinking = false;
        this.notifyMoveCallbacks();
    }

    getGameState() {
        return {
            board: this.game.board(),
            turn: this.game.turn(),
            isCheck: this.game.isCheck(),
            isCheckmate: this.game.isCheckmate(),
            isStalemate: this.game.isStalemate(),
            isDraw: this.game.isDraw(),
            isGameOver: this.game.isGameOver(),
            isAIThinking: this.isAIThinking,
            history: this.history,
            inCheck: this.game.inCheck(),
            moveColor: this.game.turn(),
            gameStarted: this.gameStarted
        };
    }
}

export default ChessGameModel;
