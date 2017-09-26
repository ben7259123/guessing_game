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
      {name: 'Joyce', hint: 'Ulysses'}
    ],
    randomSelect: function() {
      var newAnswer = this.selection[Math.floor(Math.random() * this.selection.length)];
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

})();


var gameController = (function() {

})();
