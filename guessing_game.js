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
      {name: 'Austen', hint: 'Pride and Prejudice'},
      {name: 'Marquez', hint: '100 Years of Solitude'}
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
    body: 'body',
    squaresContainer: '.squares-container',
    square: '.square',
    hintField: 'hint-field',
    guessesLeft: 'guesses-left',
    title: 'title',
    letter: '.letter',
    submitButton: 'submit-button',
    guessInput: 'guess-input',
    restartButton: 'restart-button',
    info: '.info',
    letterInput: '.letter-input',
    zeroPadding: 'zero-padding',
    inputContents: '.input-contents',
    restartField: 'restart-field'
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

  var displayMatches = function(indexes, allLetters) {
    var letterEls = document.querySelectorAll(allLetters);
    indexes.forEach(function(index) {
      letterEls[index].style.visibility = "visible";
    });
  };

  var setupInput = function(inputId) {
    var guessInput = document.getElementById(inputId);
    guessInput.value = '';
    guessInput.focus();
  };

  var displayAllLetters = function(domString) {
    document.querySelectorAll(domString).forEach(function(letter) {
      if (letter.style.visibility === 'hidden') letter.style.visibility = 'visible';
    });
  };

  var toggleHideClass = function(els) {
    document.querySelectorAll(els).forEach(function(el) {
      el.classList.toggle('hide');
    });
  };

  var displayRestart = function() {
    toggleHideClass(domStrings.info + ', #' + domStrings.hintField);
    var letterInput = document.querySelector(domStrings.letterInput);
    letterInput.classList.add(domStrings.zeroPadding);
    document.querySelector(domStrings.inputContents).style.display = "none";
    var restartEl = document.getElementById('restart-field');
    restartEl.style.display = 'block';
    restartEl.innerHTML =
    '<label class="restart-button">Click to start a new game:</label><button id="restart-button">restart</button>';
  };

  var displayNewGame = function() {
    toggleHideClass(domStrings.info + ', #' + domStrings.hintField);
    var letterInput = document.querySelector(domStrings.letterInput);
    letterInput.classList.remove(domStrings.zeroPadding);
    document.querySelector(domStrings.inputContents).style.display = "block";
    document.getElementById(domStrings.restartField).innerHTML = '';
    document.getElementById(domStrings.restartField).style.display = 'none';
    document.querySelector(domStrings.squaresContainer).innerHTML = '';
    document.getElementById(domStrings.title).textContent = "Guess the Author";
    document.getElementById(domStrings.hintField).innerHTML =
    '<p id="hint-field">click <span id="hint">here</span> for a hint</p>';
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
    returnDomStrings: function() {
      return domStrings;
    },
    displayMatches: displayMatches,
    displayAllLetters: displayAllLetters,
    setupInput: setupInput,
    displayRestart: displayRestart,
    displayNewGame: displayNewGame
  };
})();


var gameController = (function(userInterface, model) {
  var dom = userInterface.returnDomStrings();

  var setupEventListeners = function(gameInfo) {
    var hintHandler = function() {
      userInterface.displayHint(gameInfo.hint);
    };

    var restartHandler = function(e) {
      if (e.target.id === dom.restartButton) {
        userInterface.displayNewGame();
        document.querySelector(dom.body).removeEventListener('click', restartHandler, false);
        playGame();
      }
    };

    var submitHandler = function(e) {
      var enteredLetter = document.getElementById(dom.guessInput).value.toUpperCase();
      //if letter has not been guessed
      if (!gameInfo.checkGuessedLetters(enteredLetter)) {
        var endGame = function(gameMessage) {
          document.getElementById(dom.submitButton).removeEventListener('click', submitHandler, false);
          userInterface.displayGameMessage(gameMessage);
          userInterface.displayRestart();
          gameInfo.gameOver = true;
        };

        gameInfo.guessedLetters.push(enteredLetter);
        var letterIndexes = gameInfo.searchForLetter(enteredLetter, gameInfo.name);
        //if letter is in the word
        if (letterIndexes.length >= 1) {
          gameInfo.lettersLeft -= letterIndexes.length;
          userInterface.displayMatches(letterIndexes, dom.letter);
          //if there are no letters left to guess
          if (gameInfo.lettersLeft === 0) {
            endGame('You Win')
          }
          //if letter is not in word
        } else if (letterIndexes.length === 0) {
          gameInfo.guessesLeft -= 1;
          userInterface.displayGuessesLeft(gameInfo.guessesLeft);
          //if there are no guesses left
          if (gameInfo.guessesLeft === 0) {
            userInterface.displayAllLetters(dom.letter);
            endGame('Game Over');
          }
        }
      }
      if (!gameInfo.gameOver) userInterface.setupInput(dom.guessInput);
    };

    document.getElementById(dom.submitButton)
    .addEventListener('click', submitHandler, false);

    document.getElementById(dom.hintField)
    .addEventListener('click', hintHandler, false);

    document.querySelector('body')
    .addEventListener('click', restartHandler, false);
  };

  var playGame = function() {
     var guessNumber = 3;
      var currentGame = model.createGame(model.selectAnswer(), guessNumber);
      console.log(currentGame);
      userInterface.setupInput(dom.guessInput);
      userInterface.displayBoard(currentGame.name);
      userInterface.displayGuessesLeft(guessNumber);
      setupEventListeners(currentGame);
  };

  return {
    init: function() {
     playGame();
    }
  };
})(gameUI, gameModel);

gameController.init();
