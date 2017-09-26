var gameModel = (function() {
  var Game = function(answer, numOfGuesses) {
    this.name = answer.name;
    this.hint = answer.hint;
    this.lettersLeft = answer.name.length;
    this.guessedLetters = [];
    this.guessesLeft = numOfGuesses;
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
  var displaySquares = function(wordLength) {
    for (var i = 0; i < wordLength; i++) {
      document.querySelector('.squares-container')
      .insertAdjacentHTML('beforeend', '<div class="square margin-left"></div>');
    }
  };

  var addLettersToSquares = function(word) {
    var letterContainers = document.querySelectorAll('.square');
    for (var i = 0; i < letterContainers.length; i++) {
      var letterHTML = '<span class="letter">' + word.charAt(i) + '</span';
      letterContainers[i].innerHTML = letterHTML;
    }
  };













  return {
    displayBoard: function(name) {
      displaySquares(name.length);
      addLettersToSquares(name);
    },
    displayHint: function() {
    },
    displayGuessesLeft: function() {
    },
    displayLetters: function() {
    },
    displayGameMessage: function() {

    },
    /*validateEntry:*/

  }



})();


var gameController = (function() {

})();
