/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['configure-controls'] = (function() {
  'use strict';

  function initialize() {
    document.getElementById('id-controls-back').addEventListener(
      'click',
      function() { MYGAME.game.showScreen('main-menu'); },
      false);
  }

  function run() {
    //check for saved controlles in local storage
      // if none set to default

    // I know this is empty, there isn't anything to do.
  }

  return {
    initialize : initialize,
    run : run
  };
}());