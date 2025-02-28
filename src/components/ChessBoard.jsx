import React, { useState } from 'react';
import { Box, Grid, GridItem, Center } from '@chakra-ui/react';

const ChessBoard = ({ gameState, onSquareClick }) => {
    const [selectedSquare, setSelectedSquare] = useState(null);

    const handleSquareClick = (row, col) => {
        const square = `${String.fromCharCode(97 + col)}${8 - row}`;
        
        if (selectedSquare) {
            onSquareClick(selectedSquare, square);
            setSelectedSquare(null);
        } else {
            const piece = gameState.board[row][col];
            if (piece && piece.color === gameState.turn) {
                setSelectedSquare(square);
            }
        }
    };

    const renderSquare = (row, col) => {
        const isLight = (row + col) % 2 === 0;
        const piece = gameState.board[row][col];
        const square = `${String.fromCharCode(97 + col)}${8 - row}`;
        const isSelected = square === selectedSquare;

        return (
            <GridItem
                key={`${row}-${col}`}
                bg={isLight ? 'gray.100' : 'gray.400'}
                border="1px solid"
                borderColor={isSelected ? 'blue.400' : 'gray.200'}
                position="relative"
                w="full"
                h="full"
                aspectRatio="1"
                onClick={() => handleSquareClick(row, col)}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
            >
                <Center h="full">
                    {piece && (
                        <Box
                            fontSize={["24px", "32px", "40px"]}
                            color={piece.color === 'w' ? 'black' : 'black.800'}
                            userSelect="none"
                        >
                            {getPieceSymbol(piece)}
                        </Box>
                    )}
                </Center>
            </GridItem>
        );
    };

    const getPieceSymbol = (piece) => {
        const symbols = {
            'p': '♟',
            'r': '♜',
            'n': '♞',
            'b': '♝',
            'q': '♛',
            'k': '♚',
        };
        return piece.color === 'w' 
            ? symbols[piece.type] 
            : symbols[piece.type];
    };

    return (
        <Box w={["300px", "400px", "500px"]} mx="auto">
            <Grid
                templateColumns="repeat(8, 1fr)"
                templateRows="repeat(8, 1fr)"
                gap={0}
                border="2px solid"
                borderColor="gray.300"
            >
                {Array(8).fill().map((_, row) => (
                    <React.Fragment key={row}>
                        {Array(8).fill().map((_, col) => (
                            renderSquare(row, col)
                        ))}
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    );
};

export default ChessBoard;
