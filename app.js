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
    let playerArrayValues = []
    let winningPlayers = [];
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    const suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts'];
    let ignoreArray = [];
    let sortedPlayerArray = [];
    let playerArray = [];
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
    let noOfCardsInDeckCurrently = 0;
    let currentHighestCardString = '';
    let noOfPlayers = 0;
    let noOfCards = 0;

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
    // var playerArray, sortedPlayerArray, playerArrayValue, playerHandsValues = playerHandInitialisation(noOfPlayers);
    
    // This checks if you've put an impossible combo in - if you have 20 players with 3 cards
    // each, you'd run out of cards before dealing them all.
    function checkIfTooManyCardOrPlayersInGame(noOfCards, noOfPlayers){
      if ((noOfCards * noOfPlayers) > 52) {
        return impossibleCombination = true;
      } else {
        return false
      }
    }
    function assignHands(noOfCards, noOfPlayers, noOfCardsInDeckCurrently, playerArray, playerArrayValue, playerArrayValues, fullDeck, playerHandsValues) {
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
      return {
        noOfCardsInDeckCurrently : noOfCardsInDeckCurrently,
        playerArray : playerArray,
        playerArrayValue: playerArrayValue,
        playerHandsValues : playerHandsValues,
        fullDeck :fullDeck
        
      }
    }
    function sortHandBySuit(noOfPlayers, noOfCards, suits, playerArray, sortedPlayerArray) {
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
    
    function sortHandByNumber(noOfPlayers, noOfCards, values, sortedPlayerArray){
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
      return sortedPlayerArray
    }
    function checkForStraights(noOfPlayers, noOfCards, playerArrayValue, playerHandsValues) {
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
          playerHandsValues[h] = 40;
        }
        else playerArrayValues[h] = 0
      }
      return playerHandsValues
    }
    function checkForPairsAndThreeOfAKinds(h, noOfCards, playerArrayValue, ignoreArray, playerHandsValues){
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
    function formatOutput(noOfPlayers, noOfCards, sortedPlayerArray, playerHandsValues){
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
      return finalOutputString;
    }
    function calculateWinner(playerHandsValues, winningPlayers, finalOutputString, noOfPlayers, noOfCards, values, sortedPlayerArray, suit){
      currentHighestCardString = ""
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
            if ((values.indexOf(sortedPlayerArray[i][j].number) + 1) === highestScore && suits.indexOf(sortedPlayerArray[i][j].suit) > currentHighestSuit) {
                currentHighestSuit = suits.indexOf(sortedPlayerArray[i][j].suit);
                currentHighestCardString = `The winning player is Player ${(i + 1)} as they have the highest card by suit, the ${sortedPlayerArray[i][j].number} of ${sortedPlayerArray[i][j].suit}.`;
            }
          }
        }
      }
      finalOutputString += currentHighestCardString
      return finalOutputString
    }
    function beginDealing(playerArray, playerArrayValue, playerArrayValues, fullDeck, suits, values) {
      var deckCreationObj = deckCreation(values, suits, fullDeck); //deckCreationObj contain fullDeck, noOfCardsInDeckCurrently, noOfPlayers, and noOfCards
      var playerHandInitialisationObj = playerHandInitialisation(deckCreationObj.noOfPlayers); //playerHandInitialisationObj contains playerArray, sortedPlayerArray, playerArrayValue and playerHandsValues
      impossibleCombination = checkIfTooManyCardOrPlayersInGame(deckCreationObj.noOfCards, deckCreationObj.noOfPlayers);
      var assignHandsObj = assignHands(deckCreationObj.noOfCards, deckCreationObj.noOfPlayers, deckCreationObj.noOfCardsInDeckCurrently, playerHandInitialisationObj.playerArray, playerHandInitialisationObj.playerArrayValue, playerHandInitialisationObj.playerArrayValues, deckCreationObj.fullDeck, playerHandInitialisationObj.playerHandsValues); //assignHandsObj contains noOfCardsInDeckCurrently, playerArray, playerArrayValue, playerHandsValues, fullDeck
      sortedPlayerArray = sortHandBySuit(deckCreationObj.noOfPlayers, deckCreationObj.noOfCards, suits, assignHandsObj.playerArray, playerHandInitialisationObj.sortedPlayerArray);
      sortedPlayerArray = sortHandByNumber(deckCreationObj.noOfPlayers, deckCreationObj.noOfCards, values, sortedPlayerArray);
      playerHandsValues = checkForStraights(deckCreationObj.noOfPlayers, deckCreationObj.noOfCards, assignHandsObj.playerArrayValue, assignHandsObj.playerHandsValues);
      for (let x = 0; x < noOfPlayers; x += 1) {
        if (playerHandsValues[x] != 40) {
          playerHandsValues = checkForPairsAndThreeOfAKinds(x, deckCreationObj.noOfCards, assignHandsObj.playerArrayValue, ignoreArray, assignHandsObj.playerHandsValues)
        }
      }
      if (impossibleCombination == true) {
        $scope.output = 'You\'ve given me a combination that\'s impossible with a 52 card deck! Try something else.';
      } else {
        finalOutputString = formatOutput(deckCreationObj.noOfPlayers, deckCreationObj.noOfCards, sortedPlayerArray, assignHandsObj.playerHandsValues)

        finalOutputString = calculateWinner(assignHandsObj.playerHandsValues, winningPlayers, finalOutputString, deckCreationObj.noOfPlayers, deckCreationObj.noOfCards, values, sortedPlayerArray, suits)
        console.log(finalOutputString)  
        $scope.output = finalOutputString
      }
    }
    beginDealing(playerArray, playerArrayValue, playerArrayValues, fullDeck, suits, values);
  }
});