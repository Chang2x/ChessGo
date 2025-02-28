class ChessAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.depthMap = {
            'easy': 2,
            'medium': 3,
            'hard': 4
        };
    }

    async getBestMove(game) {
        const depth = this.depthMap[this.difficulty] || 3;
        const moves = game.moves({ verbose: true });
        
        if (moves.length === 0) return null;

        let bestMove = null;
        let bestScore = -Infinity;

        for (const move of moves) {
            game.move(move);
            const score = -this.minimax(game, depth - 1, -Infinity, Infinity, false);
            game.undo();

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    minimax(game, depth, alpha, beta, isMaximizing) {
        if (depth === 0) return this.evaluatePosition(game);

        const moves = game.moves();
        if (moves.length === 0) {
            if (game.isCheckmate()) return isMaximizing ? -10000 : 10000;
            return 0; // Stalemate
        }

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const move of moves) {
                game.move(move);
                const score = this.minimax(game, depth - 1, alpha, beta, false);
                game.undo();
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const move of moves) {
                game.move(move);
                const score = this.minimax(game, depth - 1, alpha, beta, true);
                game.undo();
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
            return minScore;
        }
    }

    evaluatePosition(game) {
        const pieceValues = {
            'p': 1,
            'n': 3,
            'b': 3,
            'r': 5,
            'q': 9,
            'k': 0
        };

        // Position weights for different pieces
        const pawnPositionWeights = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [5, 5, 5, 5, 5, 5, 5, 5],
            [1, 1, 2, 3, 3, 2, 1, 1],
            [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
            [0.5, 1, 1, -2, -2, 1, 1, 0.5],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        const knightPositionWeights = [
            [-5, -4, -3, -3, -3, -3, -4, -5],
            [-4, -2, 0, 0, 0, 0, -2, -4],
            [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
            [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
            [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
            [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
            [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
            [-5, -4, -3, -3, -3, -3, -4, -5]
        ];

        let score = 0;
        const board = game.board();

        // Material and position evaluation
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (!piece) continue;

                const baseValue = pieceValues[piece.type.toLowerCase()] || 0;
                let positionValue = 0;

                // Add position-based values
                if (piece.type.toLowerCase() === 'p') {
                    positionValue = pawnPositionWeights[piece.color === 'w' ? i : 7 - i][j];
                } else if (piece.type.toLowerCase() === 'n') {
                    positionValue = knightPositionWeights[piece.color === 'w' ? i : 7 - i][j];
                }

                const totalValue = baseValue + positionValue;
                score += piece.color === 'w' ? totalValue : -totalValue;
            }
        }

        // Mobility evaluation
        const mobility = game.moves().length;
        score += (game.turn() === 'w' ? 0.1 : -0.1) * mobility;

        // Check and checkmate evaluation
        if (game.isCheck()) {
            score += game.turn() === 'w' ? -0.5 : 0.5;
        }
        if (game.isCheckmate()) {
            score += game.turn() === 'w' ? -100 : 100;
        }

        // Castling evaluation
        const castlingRights = game.history().filter(move => move.includes('O-O')).length;
        score += (game.turn() === 'w' ? 0.3 : -0.3) * castlingRights;

        return score;
    }
}

export default ChessAI;
