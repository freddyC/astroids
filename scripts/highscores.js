/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['high-scores'] = (function() {
  'use strict';

  function initialize() {
    document.getElementById('id-high-scores-back').addEventListener(
      'click',
      function() { MYGAME.game.showScreen('main-menu'); },
      false);
  }

  function run() {
    //Display high scores code here
  }

  return {
    initialize : initialize,
    run : run
  };
}());
