// It's the usual Angular stuff. Exactly as expected.
const app = angular.module('pokerApp', []);

// This is the controller used for the program. Just, usual Angular stuff.
app.controller('pokerController', ($scope) => {
  $scope.possibleNoOfPlayers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25];
  $scope.possibleNoOfCardsDealt = [1, 2, 3, 4, 5];

  $scope.play = () => {
    // Declaring a bunch of variables here. Not much to see.
    const fullDeck = [];
    const playerHandsValues = [];
    const playerArrayValue = [];
    const winningPlayers = [];
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    const suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts'];
    const ignoreArray = [];
    const sortedPlayerArray = [];
    const playerArray = [];
    let temporaryHoldingForCardSorting = {};
    let straightCounter = 0;
    let numberToCheck = 0;
    let largerNumberToCheck = 0;
    let finalOutputString = '';
    let highestScore = 0;
    let impossibleCombination = true;
    let currentIndex = 0;
    let cardToCheck = 0;
    let firstIndex = 0;
    let secondIndex = 0;
    let currentHighestSuit = 0;
    let currentHighestCardString = '';

    // This pair of loops creates the full deck, so that it didn't have to be typed out in on
    // horrible line of 52 seperate objects,
    for (let i = 0; i < values.length; i += 1) {
      for (let j = 0; j < suits.length; j += 1) {
        fullDeck.push({ number: values[i], suit: suits[j] });
      }
    }
    let noOfCardsInDeckCurrently = fullDeck.length - 1;
    const noOfPlayers = $scope.playerNumber;
    const noOfCards = $scope.cardNumber;
    // This for loop initialises a few arrays to represent each player's hand.
    for (let i = 0; i < noOfPlayers; i += 1) {
      playerArray.push([]);
      sortedPlayerArray.push([]);
      playerArrayValue.push([]);
      playerHandsValues.push(0);
    }
    // This checks if you've put an impossible combo in - if you have 20 players with 3 cards
    // each, you'd run out of cards before dealing them all.
    if ((noOfCards * noOfPlayers) > 52) {
      impossibleCombination = true;
    } else {
      impossibleCombination = false;
      for (let h = 0; h < noOfCards; h += 1) {
        for (let i = 0; i < noOfPlayers; i += 1) {
          // This set of 5 lines assigns each player's hand, and removes the relevant cards from
          // the full deck. playerArray contains cards and its suit, playerHandsValues just works
          // out the total points in the hand.
          const randomNumber = Math.floor((Math.random() * noOfCardsInDeckCurrently) + 1);
          playerArray[i].push(fullDeck[randomNumber]);
          playerArrayValue[i].push(values.indexOf(fullDeck[randomNumber].number) + 1);
          playerHandsValues[i] = playerHandsValues[i] +
          values.indexOf(fullDeck[randomNumber].number) + 1;
          fullDeck.splice(randomNumber, 1);
          noOfCardsInDeckCurrently = fullDeck.length - 1;
        }
      }
      // This sorts the cards by suit
      for (let i = 0; i < noOfPlayers; i += 1) {
        currentIndex = 0;
        for (let k = 3; k > -1; k -= 1) {
          for (let j = 0; j < noOfCards; j += 1) {
            cardToCheck = playerArray[i][j];
            if (suits.indexOf(cardToCheck.suit) === k) {
              sortedPlayerArray[i].push(cardToCheck);
            }
          }
        }
      }
      // This sorts the cards by number on top of that
      for (let i = 0; i < noOfPlayers; i += 1) {
        for (let k = 0; k < 4; k += 1) {
          for (let j = 0; j < noOfCards - 1; j += 1) {
            if (values.indexOf(sortedPlayerArray[i][j].number) <
            values.indexOf(sortedPlayerArray[i][j + 1].number) &&
            sortedPlayerArray[i][j].suit === sortedPlayerArray[i][j + 1].suit) {
              temporaryHoldingForCardSorting = sortedPlayerArray[i][j + 1];
              sortedPlayerArray[i][j + 1] = sortedPlayerArray[i][j];
              sortedPlayerArray[i][j] = temporaryHoldingForCardSorting;
            }
          }
        }
      }
      // Checking for straights
      for (let h = 0; h < noOfPlayers; h += 1) {
        straightCounter = 0;
        for (let i = 0; i < (noOfCards - 1); i += 1) {
          numberToCheck = playerArrayValue[h][i];
          largerNumberToCheck = playerArrayValue[h][i + 1];
          if (largerNumberToCheck - numberToCheck === 1) {
            straightCounter += 1;
          }
        }
        if (straightCounter === 5) {
          playerHandsValues[h] += 40;
        } else {
          // These lines are checking for three of a kind or pairs, adding on the resulting points.
          // This will not run if there's a straight, as it's impossible to have a straight and a
          // pair (if the number of possible cards was increased, this would have to be changed).
          for (let j = 0; j < (noOfCards - 1); j += 1) {
            numberToCheck = playerArrayValue[h][j];
            firstIndex = j;
            if (!ignoreArray.includes(numberToCheck)) {
              if (playerArrayValue[h].indexOf(numberToCheck, firstIndex + 1) !== -1) {
                secondIndex = playerArrayValue[h].indexOf(numberToCheck, firstIndex);
                playerHandsValues[h] += 10;
                if (playerArrayValue[h].indexOf(numberToCheck, secondIndex + 1) !== -1) {
                  playerHandsValues[h] += 10;
                }
                ignoreArray.push(numberToCheck);
              }
            }
          }
        }
      }
    }
    // From here on, it's putting together the output that will get shown to the player for scores,
    // and formatting it. In another system it could be better to add arrays of individual player's
    // hands formatted to the scope, but that's not done here.
    if (impossibleCombination === true) {
      $scope.output = 'You\'ve given me a combination that\'s impossible with a 52 card deck! Try something else.';
    } else {
      for (let k = 0; k < noOfPlayers; k += 1) {
        finalOutputString = `${finalOutputString}Player ${k + 1}'s hand is: `;
        for (let l = 0; l < noOfCards; l += 1) {
          finalOutputString = `${finalOutputString}${sortedPlayerArray[k][l].number} of ${sortedPlayerArray[k][l].suit}`;
          if (l === (noOfCards - 1)) {
            finalOutputString = `${finalOutputString}. The value of their hand is ${playerHandsValues[k]}. \n`;
          } else {
            finalOutputString = `${finalOutputString}, `;
          }
        }
      }
      // In this final segment, it's working out the winning player.
      highestScore = Math.max.apply(null, playerHandsValues);
      for (let z = 0; z < playerHandsValues.length; z += 1) {
        if (playerHandsValues[z] === highestScore) {
          winningPlayers.push(z + 1);
        }
      }
      if (winningPlayers.length === 1) {
        finalOutputString = `${finalOutputString}Player ${winningPlayers[0]} wins! `;
      } else {
        finalOutputString = `${finalOutputString}It's a draw!`;
        for (let i = 0; i < noOfPlayers; i += 1) {
          for (let j = 0; j < noOfCards; j += 1) {
            if ((values.indexOf(sortedPlayerArray[i][j].number) + 1) === highestScore) {
              if (suits.indexOf(sortedPlayerArray[i][j].suit) > currentHighestSuit) {
                currentHighestSuit = suits.indexOf(sortedPlayerArray[i][j].suit);
                currentHighestCardString = `The winning player is Player ${(i + 1)} as they have the highest card by suit, the ${sortedPlayerArray[i][j].number} of ${sortedPlayerArray[i][j].suit}.`;
              }
            }
          }
        }
      }
      finalOutputString += currentHighestCardString;
      $scope.output = finalOutputString;
    }
  };
});
