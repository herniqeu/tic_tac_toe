'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("Sua vez! Você é O");
  const [isThinking, setIsThinking] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares: (string | null)[]) => {
    return squares.every(square => square !== null);
  };

  const simulateAgentMove = async () => {
    setIsThinking(true);
    try {
      const boardMatrix = Array(3).fill(null).map((_, row) => 
        board.slice(row * 3, (row + 1) * 3).map(cell => 
          cell === 'X' ? 1 : cell === 'O' ? -1 : 0
        )
      );

      const response = await fetch('http://localhost:5000/make_move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board: boardMatrix }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const moveIndex = data.move[0] * 3 + data.move[1];
      const newBoard = [...board];
      newBoard[moveIndex] = 'X';
      setBoard(newBoard);
      
      const winner = checkWinner(newBoard);
      if (winner) {
        setGameResult('Agente venceu!');
        setGameOver(true);
      } else if (isBoardFull(newBoard)) {
        setGameResult('Empate!');
        setGameOver(true);
      } else {
        setIsPlayerTurn(true);
        setMessage("Sua vez! Você é O");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("Erro ao processar jogada do agente");
    } finally {
      setIsThinking(false);
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== null || !isPlayerTurn || gameOver || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameResult('Você venceu!');
      setGameOver(true);
      return;
    }
    
    if (isBoardFull(newBoard)) {
      setGameResult('Empate!');
      setGameOver(true);
      return;
    }

    setIsPlayerTurn(false);
    setMessage("Agente está pensando...");
  };

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      simulateAgentMove();
    }
  }, [isPlayerTurn, gameOver]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setMessage("Sua vez! Você é O");
    setGameResult(null);
  };

  const renderCell = (index: number) => {
    const cellValue = board[index];
    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        className={`w-20 h-20 border-2 border-gray-300 text-4xl font-bold flex items-center justify-center
          ${!cellValue && !gameOver && isPlayerTurn ? 'hover:bg-gray-100' : ''}
          ${cellValue === 'X' ? 'text-blue-600' : 'text-green-600'}`}
        disabled={cellValue !== null || gameOver || !isPlayerTurn}
      >
        {cellValue}
      </button>
    );
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">tictactoe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {isThinking && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Agente pensando...
            </div>
          )}
          
          {gameResult && (
            <Alert>
              <AlertDescription>{gameResult}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Array(9).fill(null).map((_, i) => renderCell(i))}
          </div>

          <div className="text-center mb-4">
            {!gameOver && <p className="text-lg">{message}</p>}
          </div>

          <Button 
            onClick={resetGame}
            className="w-full md:w-auto"
          >
            Novo Jogo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicTacToe;