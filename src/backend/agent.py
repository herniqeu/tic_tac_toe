import numpy as np
from collections import defaultdict
import random
import pickle

class TicTacToeAgent:
    def __init__(self, epsilon=0.1, alpha=0.1, gamma=0.9):
        self.epsilon = epsilon
        self.alpha = alpha
        self.gamma = gamma
        self.q_table = defaultdict(lambda: defaultdict(float))
    
    def _get_state_key(self, state):
        return str(state.tolist())
    
    def get_action(self, state, valid_moves):
        if random.random() < self.epsilon:
            return random.choice(valid_moves)
        return self._get_best_action(state, valid_moves)
    
    def _get_best_action(self, state, valid_moves):
        state_key = self._get_state_key(state)
        best_value = float('-inf')
        best_actions = []
        
        for move in valid_moves:
            value = self.q_table[state_key][str(move)]
            if value > best_value:
                best_value = value
                best_actions = [move]
            elif value == best_value:
                best_actions.append(move)
        
        return random.choice(best_actions)
    
    def update(self, state, action, reward, next_state, next_valid_moves):
        state_key = self._get_state_key(state)
        action_key = str(action)
        next_state_key = self._get_state_key(next_state)
        
        next_max_value = max([self.q_table[next_state_key][str(move)] 
                            for move in next_valid_moves]) if next_valid_moves else 0
        
        current_q = self.q_table[state_key][action_key]
        self.q_table[state_key][action_key] = current_q + self.alpha * (
            reward + self.gamma * next_max_value - current_q
        )
    
    def save_policy(self, filename):
        with open(filename, 'wb') as f:
            pickle.dump(dict(self.q_table), f)
    
    def load_policy(self, filename):
        with open(filename, 'rb') as f:
            self.q_table = defaultdict(lambda: defaultdict(float), pickle.load(f))