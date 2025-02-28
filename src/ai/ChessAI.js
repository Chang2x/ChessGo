class ChessAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.pieceValues = {
            p: 100,   // pawn
            n: 320,   // knight
            b: 330,   // bishop
            r: 500,   // rook
            q: 900,   // queen
            k: 20000  // king
        };

        this.pawnPositionBonus = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ];

        this.knightPositionBonus = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ];

        this.difficultySettings = {
            easy: { depth: 2, randomness: 0.3 },
            medium: { depth: 3, randomness: 0.15 },
            hard: { depth: 4, randomness: 0 }
        };
    }

    evaluateBoard(position) {
        let score = 0;
        const gamePhase = position.isGameOver() ? 'endgame' : 
                         position.moveNumber < 10 ? 'opening' : 
                         'middlegame';

        // Calculate material and positional advantage
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = String.fromCharCode(97 + j) + (8 - i);
                const piece = position.get(square);
                
                if (piece) {
                    // Base piece value
                    const baseValue = this.pieceValues[piece.type.toLowerCase()];
                    let positionBonus = 0;

                    // Add positional bonus based on piece type
                    if (piece.type.toLowerCase() === 'p') {
                        positionBonus = piece.color === 'w' ? 
                            this.pawnPositionBonus[i][j] : 
                            this.pawnPositionBonus[7-i][j];
                    } else if (piece.type.toLowerCase() === 'n') {
                        positionBonus = piece.color === 'w' ? 
                            this.knightPositionBonus[i][j] : 
                            this.knightPositionBonus[7-i][j];
                    }

                    // Adjust bonus based on game phase
                    if (gamePhase === 'opening') {
                        if (piece.type.toLowerCase() === 'n' || piece.type.toLowerCase() === 'b') {
                            positionBonus *= 1.5;
                        }
                    }

                    score += piece.color === 'w' ? 
                        (baseValue + positionBonus) : 
                        -(baseValue + positionBonus);
                }
            }
        }

        // Additional strategic evaluations
        if (position.isCheck()) {
            score += position.turn() === 'w' ? -50 : 50;
        }

        if (position.isCheckmate()) {
            score += position.turn() === 'w' ? -10000 : 10000;
        }

        return score;
    }

    minimax(position, depth, alpha, beta, isMaximizing) {
        if (depth === 0) return this.evaluateBoard(position);

        const moves = position.moves({ verbose: true });
        moves.sort(() => Math.random() - 0.5);

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                position.move(move);
                const evaluation = this.minimax(position, depth - 1, alpha, beta, false);
                position.undo();
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                position.move(move);
                const evaluation = this.minimax(position, depth - 1, alpha, beta, true);
                position.undo();
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    getBestMove(game) {
        const { depth, randomness } = this.difficultySettings[this.difficulty];
        const moves = game.moves({ verbose: true });
        
        if (moves.length === 0) return null;

        // For easy difficulty, occasionally make a random move
        if (Math.random() < randomness) {
            return moves[Math.floor(Math.random() * moves.length)];
        }

        let bestMove = null;
        let bestValue = -Infinity;

        for (const move of moves) {
            game.move(move);
            const value = -this.minimax(game, depth - 1, -Infinity, Infinity, false);
            game.undo();

            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }

        return bestMove;
    }
}

export default ChessAI;
