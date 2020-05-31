import random


class Deck:

    def __init__(self):
        deck = []
        for num in range(2, 10):
            for _ in range(0, 4):
                deck.append(num)
        for _ in range(0, 12):
            deck.append(10)
        for _ in range(0, 4):
            deck.append("Ace")

        self.deck = deck

    def shuffle(self):
        random.shuffle(self.deck)

    def get_next(self):
        self.shuffle()
        return self.deck.pop()


def ask_for_player_action():
    action_response = 0
    while action_response == 0:
        answer = input("Would you like to hit or stay? h or s? ")
        if answer in {"h", "s"}:
            action_response = answer
    return action_response


def ask_about_ace():
    action_response = 0
    while action_response == 0:
        answer = input("You just received an Ace!\nWould you like to take a 1 or 11? ")
        if answer in {"1", "11"}:
            action_response = answer
    return int(action_response)


def ask_for_bet(balance):
    amount_response = 0
    while amount_response == 0:
        answer = input(f"How much would you like to bet? ")
        if 0 < int(answer) <= balance:
            amount_response = int(answer)
    return amount_response


def replay():
    play_response = 0
    while play_response == 0:
        answer = input("Would you like to play again? y or n? ")
        if answer in {"y", "n"}:
            play_response = answer
    return play_response


def clean_card(playing_card, player):
    if playing_card != "Ace":
        return playing_card
    if not player:
        return 11
    return ask_about_ace()


if __name__ == '__main__':

    print("Welcome to Simple BlackJack!")
    player_balance = 100
    while True:
        if player_balance <= 0:
            print(f"Sorry you have actually run out of money with {player_balance}."
                  f"\nYou may no longer play this game."
                  f"\nThank you for your time")
            break

        print("Let the games begin")
        print(f"You begin with a balance of {player_balance}")
        bet = ask_for_bet(player_balance)
        playing_deck = Deck()
        dealers_cards = [clean_card(playing_deck.get_next(), False)]
        dealers_score = dealers_cards[0]
        players_cards = [clean_card(playing_deck.get_next(), True), clean_card(playing_deck.get_next(), True)]
        player_score = players_cards[0] + players_cards[1]
        player_has_lost = False
        print(f"One of the dealer's cards is {dealers_cards[0]}")
        print(f"Your cards are {players_cards[0]} and {players_cards[1]}")

        # Player's turn
        while True:
            response = ask_for_player_action()
            if response == "s":
                break
            card = playing_deck.get_next()
            print(f'You drew one {card} card')
            if card == "Ace":
                card = ask_about_ace()
            players_cards.append(card)
            player_score += card
            if player_score > 21:
                player_balance -= bet
                print(f"Bust at {player_score}\nPlayer has lost {bet} bet amount")
                print(f"Player ends with balance of {player_balance}")
                player_has_lost = True
                break
            else:
                print(f"One of the dealer's cards is {dealers_cards[0]}")
                print(f"Your score is {player_score}")

        # Computer's turn
        while not player_has_lost:
            if player_score < dealers_score <= 21:
                print(f"Dealer has won this round with {dealers_score} and player at {player_score}")
                player_balance -= bet
                print(f"Player loses {bet} bet amount")
                break
            if dealers_score > 21:
                print(f"Dealer has lost this round (BUST) with {dealers_score} and player at {player_score}")
                player_balance += bet
                print(f"Player wins {bet} bet amount")
                break
            card = playing_deck.get_next()
            print(f'Dealer drew one {card} card')
            if card == "Ace":
                if 21 - dealers_score >= 11:
                    card = 11
                else:
                    card = 1
                print(f"Dealer elected for {card}")
            dealers_cards.append(card)
            dealers_score += card

        if replay() == "n":
            print(f"Thank you for playing!\nYou finish the game with {player_balance}")
            break
        else:
            print("Alright then. We play again!")
