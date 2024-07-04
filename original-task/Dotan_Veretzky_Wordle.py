# The word we're trying to guess
secret_word = "DOTAN"

# Keep track of correctly guessed letters
green_letters = [" ", " ", " ", " ", " "]

# How many chances we get
max_tries = 6

for try_num in range(max_tries):
    # Keep asking for input until it's valid
    while True:
        guess = input("Enter a 5-letter word: ").upper()
        if len(guess) != 5:
            print(f"Your guess has {len(guess)} letters, Try again with 5!")
        elif not guess.isalpha():
            print("Only letters allowed - Try again!")
        else:
            break

    # Yay, we won!
    if guess == secret_word:
        print("You got it! Nice job!")
        break

    # Letters in the word but in wrong spot (only for this turn)
    orange_letters = []
    # Wrong letters from this guess (only for this turn)
    gray_letters = []

    # Check each letter in the guess
    for i, letter in enumerate(guess):
        if letter == secret_word[i]:
            green_letters[i] = letter
        elif letter in secret_word:
            orange_letters.append(letter)
        else:
            gray_letters.append(letter)

    # Show the results
    print(f"Green letters: {green_letters}")
    print(f"Orange letters: {orange_letters}")
    print(f"Gray letters: {gray_letters}")

# If we get here, we ran out of tries
else:
    print(f"Oops, no more tries left. The word was {secret_word}.")