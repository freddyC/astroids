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
    $('#you-made-a-high-score').hide();
    $('#players-score').text('Your Score: ' + MYGAME.gameController.score);

    $.ajax({
      url: 'http://localhost:3000/v1/smallest-high-scores',
      cache: false,
      type: 'GET',
      error: function() { alert('GET failed'); },
      success: function(data) {
        console.log(data);
        if (data > MYGAME.gameController.score) {
          $('#you-made-a-high-score').hide();
          $('#submit-score-button').text('Done');
        } else {
          $('#you-made-a-high-score').show();
          $('#submit-score-button').text('Submit');
        }
      }
    })
  }

  return {
    initialize : initialize,
    run : run
  };
}());
