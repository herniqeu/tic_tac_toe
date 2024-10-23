import numpy as np
from typing import List, Tuple, Optional

class TicTacToeEnv:
    def __init__(self):
        self.board = np.zeros((3, 3), dtype=int)
        self.current_player = 1
        
    def reset(self):
        self.board = np.zeros((3, 3), dtype=int)
        self.current_player = 1
        return self.board.copy()
    
    def get_valid_moves(self):
        return [(i, j) for i in range(3) for j in range(3) if self.board[i, j] == 0]
    
    def make_move(self, position):
        if not self._is_valid_move(position):
            raise ValueError("Invalid move")
            
        self.board[position] = self.current_player
        
        done = False
        reward = 0
        
        if self._check_winner() == self.current_player:
            reward = 1
            done = True
        elif self._check_winner() is not None:
            reward = -1
            done = True
        elif len(self.get_valid_moves()) == 0:
            done = True
            
        self.current_player *= -1
        return self.board.copy(), reward, done
    
    def _is_valid_move(self, position):
        return self.board[position] == 0
    
    def _check_winner(self):
        # Check rows, columns and diagonals
        for i in range(3):
            if abs(sum(self.board[i,:])) == 3:
                return self.board[i,0]
            if abs(sum(self.board[:,i])) == 3:
                return self.board[0,i]
        
        if abs(sum(np.diag(self.board))) == 3:
            return self.board[0,0]
        if abs(sum(np.diag(np.fliplr(self.board)))) == 3:
            return self.board[0,2]
            
        return None