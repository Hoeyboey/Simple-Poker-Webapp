// It's the usual Angular stuff. Exactly as expected.
const app = angular.module('pokerApp', []);

// This is the controller used for the program. Just, usual Angular stuff.
app.controller('pokerController', ($scope) => {
  $scope.possibleNoOfPlayers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25];
  $scope.possibleNoOfCardsDealt = [1, 2, 3, 4, 5];
  $scope.play = () => {
    // Declaring a bunch of variables here. Not much to see. 
    let fullDeck = [];
    let playerHandsValues = [];
    let playerArrayValue = [];
    let winningPlayers = [];
    let playerArray = [];
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    const suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts'];

    // This pair of loops creates the full deck, so that it didn't have to be typed out in on
    // horrible line of 52 seperate objects,
    function deckCreation(values, suits, fullDeck) {
      for (let i = 0; i < values.length; i += 1) {
        for (let j = 0; j < suits.length; j += 1) {
          fullDeck.push({ number: values[i], suit: suits[j] });
        }
      }
      let noOfCardsInDeckCurrently = fullDeck.length - 1;
      let noOfPlayers = $scope.playerNumber;
      let noOfCards = $scope.cardNumber;
      return {
        fullDeck: fullDeck, 
        noOfCardsInDeckCurrently : noOfCardsInDeckCurrently, 
        noOfPlayers : noOfPlayers, 
        noOfCards : noOfCards
    }
    }
    // This for loop initialises a few arrays to represent each player's hand.
    function playerHandInitialisation(noOfPlayers) {
      let playerArray = [];
      let sortedPlayerArray = [];
      let playerArrayValue = [];
      let playerHandsValues = [];
      for (let i = 0; i < noOfPlayers; i += 1) {
        playerArray.push([]);
        sortedPlayerArray.push([]);
        playerArrayValue.push([]);
        playerHandsValues.push(0);
      }
      return {
        playerArray : playerArray, 
        sortedPlayerArray : sortedPlayerArray, 
        playerArrayValue : playerArrayValue, 
        playerHandsValues : playerHandsValues
    }
    }
    
    // This checks if you've put an impossible combo in - if you have 20 players with 3 cards
    // each, you'd run out of cards before dealing them all.
    function checkIfTooManyCardOrPlayersInGame(noOfCards, noOfPlayers){
      let impossibleCombination
      if ((noOfCards * noOfPlayers) > 52) {
        return impossibleCombination = true;
      } else {
        return false
      }
    }
    function assignHands(noOfCards, noOfPlayers, noOfCardsInDeckCurrently, playerArray, 
                        playerArrayValue, fullDeck, playerHandsValues) {
      for (let h = 0; h < noOfCards; h += 1) {
        for (let i = 0; i < noOfPlayers; i += 1) {
          // This set of lines assigns each player's hand, and removes the relevant cards from
          // the full deck. playerArray contains cards and its suit, playerHandsValues just works
          // out the total points in the hand.
          const randomNumber = Math.floor((Math.random() * noOfCardsInDeckCurrently) + 1);
          playerArray[i].push(fullDeck[randomNumber]);
          let currentCardValue = values.indexOf(fullDeck[randomNumber].number) + 1
          console.log(currentCardValue)
          if (currentCardValue > 10) {
            playerHandsValues[i] += 10
          } else {
            playerHandsValues[i] += currentCardValue;
          }
          fullDeck.splice(randomNumber, 1);
          noOfCardsInDeckCurrently = fullDeck.length - 1;
        }
      }
      return {
        noOfCardsInDeckCurrently : noOfCardsInDeckCurrently,
        playerArray : playerArray,
        playerArrayValue: playerArrayValue,
        playerHandsValues : playerHandsValues,
        fullDeck :fullDeck
        
      }
    }
    // Sorts by suit using loops - i is current player, k is index of current suit we're comparing again, j is current card we're checking
    function sortHandBySuit(noOfPlayers, noOfCards, suits, playerArray, sortedPlayerArray) {
      let currentIndex = 0;
      let cardToCheck = 0;
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
      return sortedPlayerArray
    }
    // After sorting by suit, then sorts hands by the number on each card, using loops - i is the current player, k is index of card being sorted
    function sortHandByNumber(noOfPlayers, noOfCards, values, sortedPlayerArray){
      let temporaryHoldingForCardSorting
      for (let i = 0; i < noOfPlayers; i += 1) {
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
      return sortedPlayerArray
    }
    // Looks for straights, the highest possible value. h is current player, i is current card we're checking 
    function checkForStraights(noOfPlayers, noOfCards, playerArrayValue, playerHandsValues) {
      let straightCounter
      let numberToCheck
      let largerNumberToCheck
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
        }
      }
      return playerHandsValues
    }
    //Similarly to checking for pairs, checks for pairs and three of a kinds
    function checkForPairsAndThreeOfAKinds(h, noOfCards, playerArrayValue, ignoreArray, 
                                          playerHandsValues){
      let numberToCheck
      let firstIndex
      let secondIndex
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
      return playerHandsValues
    }
    //Creates the final ouput, using previously calculated values and some template sentences
    function formatOutput(noOfPlayers, noOfCards, sortedPlayerArray, playerHandsValues){
      let finalOutputString = ""
      for (let k = 0; k < noOfPlayers; k += 1) {
        finalOutputString = `${finalOutputString}Player ${k + 1}'s hand is: `;
        for (let l = 0; l < noOfCards; l += 1) {
          finalOutputString = `${finalOutputString}${sortedPlayerArray[k][l].number} of 
                              ${sortedPlayerArray[k][l].suit}`;
          if (l === (noOfCards - 1)) {
            finalOutputString = `${finalOutputString}. The value of their hand is 
                                ${playerHandsValues[k]}. \n`;
          } else {
            finalOutputString = `${finalOutputString}, `;
          }
        }
      }
      return finalOutputString;
    }
    // Calculates the winner based on value of the hand and, in the case of a draw, the suit
    function calculateWinner(playerHandsValues, winningPlayers, finalOutputString, noOfPlayers, 
                            noOfCards, values, sortedPlayerArray, suit){
      let currentHighestCardString = ""
      let currentHighestSuit = 0
      let highestScore
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
            if ((values.indexOf(sortedPlayerArray[i][j].number) + 1) === highestScore && 
                suits.indexOf(sortedPlayerArray[i][j].suit) > currentHighestSuit) {
                currentHighestSuit = suits.indexOf(sortedPlayerArray[i][j].suit);
                currentHighestCardString = `The winning player is Player ${(i + 1)} as they have 
                                            the highest card by suit, the 
                                            ${sortedPlayerArray[i][j].number} of 
                                            ${sortedPlayerArray[i][j].suit}.`;
            }
          }
        }
      }
      finalOutputString += currentHighestCardString
      return finalOutputString
    }
    // This function defines the order of the functions above and runs them all
    function beginDealing(playerArray, playerArrayValue, playerHandsValues, fullDeck, suits, values) {
      let ignoreArray = []
      let deckCreationObj = deckCreation(values, suits, fullDeck); //deckCreationObj contain fullDeck, noOfCardsInDeckCurrently, noOfPlayers, and noOfCards
      let playerHandInitialisationObj = playerHandInitialisation(deckCreationObj.noOfPlayers); //playerHandInitialisationObj contains playerArray, sortedPlayerArray, playerArrayValue and playerHandsValues
      let impossibleCombination = checkIfTooManyCardOrPlayersInGame(deckCreationObj.noOfCards, 
                                  deckCreationObj.noOfPlayers);
      let assignHandsObj = assignHands(deckCreationObj.noOfCards, deckCreationObj.noOfPlayers, 
                           deckCreationObj.noOfCardsInDeckCurrently, 
                           playerHandInitialisationObj.playerArray, 
                           playerHandInitialisationObj.playerArrayValue, 
                           deckCreationObj.fullDeck, 
                           playerHandInitialisationObj.playerHandsValues); //assignHandsObj contains noOfCardsInDeckCurrently, playerArray, playerArrayValue, playerHandsValues, fullDeck
      console.log(assignHandsObj.playerHandsValues[0])
      let sortedPlayerArray = sortHandBySuit(deckCreationObj.noOfPlayers, 
                              deckCreationObj.noOfCards, 
                              suits, 
                              assignHandsObj.playerArray, 
                              playerHandInitialisationObj.sortedPlayerArray);
      sortedPlayerArray = sortHandByNumber(deckCreationObj.noOfPlayers, 
                          deckCreationObj.noOfCards, 
                          values, 
                          sortedPlayerArray);
      playerHandsValues = checkForStraights(deckCreationObj.noOfPlayers, 
                          deckCreationObj.noOfCards, 
                          assignHandsObj.playerArrayValue, 
                          assignHandsObj.playerHandsValues);
      for (let x = 0; x < deckCreationObj.noOfPlayers; x += 1) {
        if (assignHandsObj.playerHandsValues[x] != 40) {
          playerHandsValues = checkForPairsAndThreeOfAKinds(x, 
                              deckCreationObj.noOfCards, 
                              assignHandsObj.playerArrayValue, 
                              ignoreArray, 
                              assignHandsObj.playerHandsValues)
        }
      }
      if (impossibleCombination == true) {
        $scope.output = 'You\'ve given me a combination that\'s impossible with a 52 card deck! Try something else.';
      } else {
        let finalOutputString = formatOutput(deckCreationObj.noOfPlayers, 
                                deckCreationObj.noOfCards, 
                                sortedPlayerArray, 
                                assignHandsObj.playerHandsValues)

        finalOutputString = calculateWinner(assignHandsObj.playerHandsValues, 
                            winningPlayers, 
                            finalOutputString,
                            deckCreationObj.noOfPlayers, 
                            deckCreationObj.noOfCards, 
                            values, 
                            sortedPlayerArray, 
                            suits)
        $scope.output = finalOutputString
      }
    }
    // Calls our main function to run it all
    beginDealing(playerArray, 
    playerArrayValue, 
    playerHandsValues, 
    fullDeck, 
    suits, 
    values);
  }
});