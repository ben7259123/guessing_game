var gameModel = (function() {
  var Game = function(answer, numOfGuesses) {
    this.name = answer.name.toUpperCase();
    this.hint = answer.hint;
    this.lettersLeft = answer.name.length;
    this.guessedLetters = [];
    this.guessesLeft = numOfGuesses;
    this.gameOver = false;
  };

  Game.prototype.checkGuessedLetters = function(letter) {
    for (var i = 0; i < this.guessedLetters.length; i++) {
      if (letter === this.guessedLetters[i]) {
        return true;
      }
    }
    return false;
  };

  Game.prototype.searchForLetter = function(letter) {
    var matchedIndexes = [];
    for (var i = 0; i < this.name.length; i++) {
      if (this.name.charAt(i) === letter) {
        matchedIndexes.push(i);
      }
    }
    return matchedIndexes;
  };

  var answers = {
    selection: [
      {name: 'Twain', hint: 'Huckleberry Finn'},
      {name: 'Woolf', hint: 'To The Lighthouse'},
      {name: 'Wilde', hint: 'Picture of Dorian Gray'},
      {name: 'Orwell', hint: '1984'},
      {name: 'Joyce', hint: 'Ulysses'},
      {name: 'Austen', hint: 'Pride and Prejudice'}
    ],
    randomSelect: function() {
      var newAnswer =
      this.selection[Math.floor(Math.random() * this.selection.length)];
      return newAnswer;
    }
  };

  return {
    selectAnswer: function() {
      return answers.randomSelect();
    },
    createGame: function(answer, numOfGuesses) {
      return new Game(answer, numOfGuesses);
    }
  };
})();

var gameUI = (function() {
  var domStrings = {
    squaresContainer: '.squares-container',
    square: '.square',
    hintField: 'hint-field',
    guessesLeft: 'guesses-left',
    title: 'title',
    letter: '.letter',
    submitButton: 'submit-button',
    guessInput: 'guess-input'
  };

  var displaySquares = function(wordLength) {
    for (var i = 0; i < wordLength; i++) {
      document.querySelector(domStrings.squaresContainer)
      .insertAdjacentHTML('beforeend', '<div class="square margin-left"></div>');
    }
  };

  var addLettersToSquares = function(word) {

    var letterContainers = document.querySelectorAll(domStrings.square);
    for (var i = 0; i < letterContainers.length; i++) {
      var letterHTML = '<span class="letter">' + word.charAt(i) + '</span';
      letterContainers[i].innerHTML = letterHTML;
      letterContainers[i].firstElementChild.style.visibility = "hidden";
    }
  };

  var displayContent = function(id, content) {
    document.getElementById(id).textContent = content;
  };

  var changeVisibility= function(indexes) {
    var wordEls = document.querySelectorAll(domStrings.letter);
    indexes.forEach(function(index) {
      wordEls[index].style.visibility = "visible";
    });
  };

  var setupInput = function(inputId) {
    var guessInput = document.getElementById(inputId);
    guessInput.value = '';
    guessInput.focus();
  };

  return {
    displayBoard: function(name) {
      displaySquares(name.length);
      addLettersToSquares(name);
    },
    displayHint: function(hint) {
      displayContent(domStrings.hintField, hint);
    },
    displayGuessesLeft: function(guessesLeft) {
      displayContent(domStrings.guessesLeft, guessesLeft);
    },
    displayGameMessage: function(message) {
      displayContent(domStrings.title, message);
    },
    displayLetters: function(indexArray) {
      changeVisibility(indexArray);
    },
    returnDomStrings: function() {
      return domStrings;
    },
    setupInput: function(id) {
      setupInput(id);
    }
  };
})();


var gameController = (function(userInterface, model) {
  var dom = userInterface.returnDomStrings();


  var setupEventListeners = function(gameInfo) {
    document.getElementById(dom.submitButton)
    .addEventListener('click', function() {
      if (gameInfo.gameOver === false) {
        var enteredLetter = document.getElementById(dom.guessInput).value.toUpperCase();
        //if letter has not been guessed
        if (!gameInfo.checkGuessedLetters(enteredLetter)) {
          gameInfo.guessedLetters.push(enteredLetter);

          var letterIndexes = gameInfo.searchForLetter(enteredLetter, gameInfo.name)
         //if letter is in the word
          if (letterIndexes.length >= 1) {
            gameInfo.lettersLeft -= letterIndexes.length;
            userInterface.displayLetters(letterIndexes);
            //if there are no letters left to guess
            if (gameInfo.lettersLeft === 0) {
              userInterface.displayGameMessage('You Win');
              gameInfo.gameOver = true;
            }
            //if letter is not in word
          } else if (letterIndexes.length === 0) {
            gameInfo.guessesLeft -= 1;
            userInterface.displayGuessesLeft(gameInfo.guessesLeft);
            //if no more guesses left
            if (gameInfo.guessesLeft === 0) {
              userInterface.displayGameMessage('Game Over');
              gameInfo.gameOver = true;
            }
          }
        }
        userInterface.setupInput(dom.guessInput);
      }
    }, false);


  };

  return {
    init: function() {
      var guessNumber = 5;
      var currentGame = model.createGame(model.selectAnswer(), guessNumber);
      userInterface.setupInput(dom.guessInput);
      userInterface.displayBoard(currentGame.name);
      userInterface.displayGuessesLeft(guessNumber);
      setupEventListeners(currentGame);
    }
  };
})(gameUI, gameModel);

gameController.init();
