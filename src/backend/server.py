from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from agent import TicTacToeAgent
from environment import TicTacToeEnv

app = Flask(__name__)
CORS(app)

# Initialize environment and agent
env = TicTacToeEnv()
agent = TicTacToeAgent(epsilon=0.0)  # epsilon=0 for exploitation only

# Try to load trained policy
try:
    agent.load_policy('tic_tac_toe_policy.pkl')
    print("Loaded trained policy successfully!")
except:
    print("No trained policy found. Using random moves.")

@app.route('/make_move', methods=['POST'])
def make_move():
    data = request.json
    board = np.array(data['board']).reshape(3, 3)
    
    # Get valid moves
    valid_moves = [(i, j) for i in range(3) for j in range(3) if board[i, j] == 0]
    
    if not valid_moves:
        return jsonify({'error': 'No valid moves'})
    
    # Get agent's move
    move = agent.get_action(board, valid_moves)
    
    # Convert move to list format
    move_list = [move[0], move[1]]
    
    return jsonify({'move': move_list})

if __name__ == '__main__':
    app.run(debug=True, port=5000)