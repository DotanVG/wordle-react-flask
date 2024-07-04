from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Global variable to store the secret word
SECRET_WORD = ""

def get_random_word():
    """
    Fetch a random 5-letter word from an external API.
    Retries until a suitable word is found.
    """
    while True:
        try:
            response = requests.get("https://random-word-api.herokuapp.com/word")
            if response.status_code == 200:
                word = response.json()[0].upper()
                if len(word) == 5:
                    return word
            # If word is not 5 letters, we'll try again
        except requests.RequestException:
            print("Error fetching word, retrying...")
    
@app.route('/new-game', methods=['GET'])
def new_game():
    """
    Start a new game by getting a new random word.
    """
    global SECRET_WORD
    SECRET_WORD = get_random_word()
    return jsonify({"message": "New game started"}), 200

@app.route('/guess', methods=['POST'])
def check_guess():
    """
    Check the submitted guess against the secret word.
    Returns feedback on correct letters and positions.
    """
    guess = request.json['guess'].upper()
    
    # Validate the guess
    if len(guess) != 5 or not guess.isalpha():
        return jsonify({"error": "Invalid guess"}), 400
    
    green_letters = [" "] * 5
    orange_letters = []
    gray_letters = []
    
    # Check each letter of the guess
    for i, letter in enumerate(guess):
        if letter == SECRET_WORD[i]:
            green_letters[i] = letter
        elif letter in SECRET_WORD:
            orange_letters.append(letter)
        else:
            gray_letters.append(letter)
    
    is_correct = guess == SECRET_WORD
    
    return jsonify({
        "greenLetters": green_letters,
        "orangeLetters": orange_letters,
        "grayLetters": gray_letters,
        "isCorrect": is_correct
    })

if __name__ == '__main__':
    # Start the first game
    SECRET_WORD = get_random_word()
    app.run(debug=True)