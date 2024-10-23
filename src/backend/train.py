from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from agent import TicTacToeAgent
from environment import TicTacToeEnv

app = Flask(__name__)
CORS(app)

# Initialize agent and try to load trained policy
agent = TicTacToeAgent(epsilon=0.0)  # epsilon=0 for pure exploitation
try:
    agent.load_policy('tic_tac_toe_policy.pkl')
    print("Loaded trained policy successfully!")
except:
    print("No trained policy found. Using random moves.")

@app.route('/make_move', methods=['POST'])
def make_move():
    try:
        board = np.array(request.json['board'])
        valid_moves = [(i, j) for i in range(3) for j in range(3) if board[i, j] == 0]
        
        if not valid_moves:
            return jsonify({'error': 'No valid moves'})
        
        # Get agent's move
        move = agent.get_action(board, valid_moves)
        
        return jsonify({'move': move})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)