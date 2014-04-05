/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['get-player'] = (function() {
  'use strict';

  function initialize() {
    document.getElementById('submit-score-button').addEventListener('click', function() {
      MYGAME.screens['high-scores'].addScore();
    }, false);
  }

  function run() {
    console.log('Your Score: ' + MYGAME.gameController.score);
    $('#players-score').text('Your Score: ' + MYGAME.gameController.score);
  }

  return {
    initialize : initialize,
    run : run
  };
}());
