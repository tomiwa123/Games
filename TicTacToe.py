def display_board(board):
    print('\n' * 100)
    space = " "
    bar = "|"
    space_bar = space * 2 + bar + space * 2
    new_row = "-" * 15 + "\n"
    spacer = space * 4 + bar + space * 5 + bar + space * 4 + "\n"

    # Print lines
    print(spacer)
    print(space + board[7] + space_bar + board[8] + space_bar + board[9] + space + "\n")
    print(spacer)
    print(new_row)
    print(spacer)
    print(space + board[4] + space_bar + board[5] + space_bar + board[6] + space + "\n")
    print(spacer)
    print(new_row)
    print(spacer)
    print(space + board[1] + space_bar + board[2] + space_bar + board[3] + space + "\n")
    print(spacer)


def player_input():
    num_set = {"1", "2", "3", "4", "5", "6", "7", "8", "9"}
    typeset = {"X", "O"}
    response = 0
    answer = [0, 0]

    while response not in typeset:
        response = input('Please enter whether you wish to be x or o:').upper()
    answer[0] = response
    response = 0
    while response not in num_set:
        response = input('Please enter a number location')

    answer[1] = int(response)
    return answer


def place_marker(board, marker, position):
    board[int(position)] = marker.upper()
    return board


def win_check(board, mark):
    for entry in {1, 4, 7}:
        if board[entry] == board[entry + 1] and board[entry + 1] == board[entry + 2] and board[entry + 2] == mark:
            return True
    for entry in {7, 8, 8}:
        if board[entry] == board[entry - 3] and board[entry - 3] == board[entry - 6] and board[entry - 6] == mark:
            return True
    if board[7] == board[5] and board[5] == board[3] and board[3] == mark:
        return True
    return board[9] == board[5] and board[5] == board[1] and board[1] == mark


import random


def choose_first():
    return f'Player{random.randint(1, 2)} goes first'


def space_check(board, position):
    numset = {"1", "2", "3", "4", "5", "6", "7", "8", "9"}
    if position not in numset:
        return False

    return board[int(position)] not in {"X", "O"}


def full_board_check(board):
    for num in range(1, 10):
        if board[num] not in {"X", "O"}:
            return False
    return True


def player_choice(board):
    numset = {"1", "2", "3", "4", "5", "6", "7", "8", "9"}
    response = -3
    while (response not in numset) or (not space_check(board, response)):
        response = input('Please enter a number location')

    return response


def replay():
    possible_answers = {"Y", "N", "y", "n", "Yes", "No"}
    response = 0
    while response not in possible_answers:
        response = input('Would you like to jolly play again? ')
    return response in {"Y", "y", "Yes"}


if __name__ == '__main__':
    print('Welcome to Tic Tac Toe!')

    # while True:
    while True:
        # Set the game up here
        game_is_on = True
        board = ["$"]
        for num in range(1, 10):
            board.append(" ")
        print("Alright. Let's go player 1")
        initial = player_input()
        player1Avatar = "X"
        player2Avatar = "O"
        if initial[0] == "O":
            player2Avatar = "X"
            player1Avatar = "O"

        place_marker(board, player1Avatar, initial[1])
        display_board(board)

        # while game_on:
        while (game_is_on):
            # Player 2 Turn
            if (full_board_check(board)):
                print("No Winner")
                game_is_on = False
            print("It is your turn player2 \n")
            pos = player_choice(board)
            place_marker(board, player2Avatar, pos)
            display_board(board)
            if win_check(board, player2Avatar):
                print("player2 wins")
                game_is_on = False
                break

            # Player1's turn.
            if (full_board_check(board)):
                print("No Winner")
                game_is_on = False
                break
            print("It is your turn player1 \n")
            pos = player_choice(board)
            place_marker(board, player1Avatar, pos)
            display_board(board)
            if win_check(board, player1Avatar):
                print("player1 wins")
                game_is_on = False
                break
                # pass

        # if not replay():
        if not replay():
            break
