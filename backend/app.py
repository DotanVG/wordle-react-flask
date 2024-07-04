from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SECRET_WORD = "DOTAN"

@app.route('/guess', methods=['POST'])
def check_guess():
    guess = request.json['guess'].upper()
    
    if len(guess) != 5 or not guess.isalpha():
        return jsonify({"error": "Invalid guess"}), 400
    
    green_letters = [" "] * 5
    orange_letters = []
    gray_letters = []
    
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
    app.run(debug=True)