/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME, console, KeyEvent, requestAnimationFrame, performance */
MYGAME.screens['game-play'] = (function() {
  'use strict';

  var myMouse = MYGAME.input.Mouse()
    , cancelNextRequest = false
    , lastTimeStamp
    ;

  window.onscroll = function () {
    window.scrollTo(0, 0);
  };

  function initialize() {
    $('#canvas-main').height = window.innerHeight;
    $('#canvas-main').width = window.innerWidth;
    $('#canvas-main').style.height = '100%';
    $('#canvas-main').style.width = '100%';
    MYGAME.gameController.init();
  }

  //------------------------------------------------------------------
  // This is the Game Loop function!
  //------------------------------------------------------------------
  function gameLoop(time) {
    var elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    update(elapsedTime, function () {
      if(MYGAME.gameController.gameInProgress) {
        render(function () {
          requestAnimationFrame(gameLoop);
        });
      } else {
        MYGAME.game.showScreen('get-player');
      }
    });
  }

  function update (elapsedTime, cb) {
    MYGAME.gameController.update(elapsedTime);
    cb();
  }

  function render (cb) {
    MYGAME.graphics.clear();
    MYGAME.gameController.render();
    cb();
  }

  function run() {
    lastTimeStamp = performance.now();
    MYGAME.gameController.run();

    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize : initialize,
    run : run
  };
}());