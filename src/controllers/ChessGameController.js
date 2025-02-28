class ChessGameController {
    constructor(model) {
        this.model = model;
        this.moveListeners = new Set();
        
        // Set up model callback
        this.model.addMoveCallback((gameState) => {
            this.notifyMoveListeners(gameState);
        });
    }

    addMoveListener(listener) {
        this.moveListeners.add(listener);
    }

    removeMoveListener(listener) {
        this.moveListeners.delete(listener);
    }

    notifyMoveListeners(gameState) {
        this.moveListeners.forEach(listener => listener(gameState));
    }

    handleMove(from, to) {
        // Don't allow moves if AI is thinking
        if (this.model.isAIThinking) {
            return false;
        }

        const move = {
            from: from,
            to: to,
            promotion: 'q' // Always promote to queen for simplicity
        };

        return this.model.makeMove(move);
    }

    handleUndo() {
        return this.model.undoMove();
    }

    handleReset() {
        this.model.resetGame();
    }

    setDifficulty(difficulty) {
        this.model.setDifficulty(difficulty);
    }

    toggleAI(enabled) {
        this.model.toggleAI(enabled);
    }

    getLegalMoves(square) {
        return this.model.getLegalMoves().filter(move => 
            move.includes(square)
        );
    }

    getGameState() {
        return this.model.getGameState();
    }
}

export default ChessGameController;
