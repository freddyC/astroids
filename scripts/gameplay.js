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
    document.getElementById('canvas-main').height = window.innerHeight;
    document.getElementById('canvas-main').width = window.innerWidth;
    document.getElementById('canvas-main').style.height = '100%';
    document.getElementById('canvas-main').style.width = '100%';
  }

  //------------------------------------------------------------------
  // This is the Game Loop function!
  //------------------------------------------------------------------
  function gameLoop(time) {
    var elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    update(elapsedTime);
    
    if(MYGAME.gameController.gameInProgress) {
    	render();
    } else {
    	MYGAME.game.showScreen('main-menu');
    }
    if (!cancelNextRequest) {
        requestAnimationFrame(gameLoop);
      }
  }

  function update (elapsedTime) {
    MYGAME.gameController.update(elapsedTime);
  }

  function render () {
    MYGAME.graphics.clear();
    MYGAME.gameController.render();
  }

  function run() {
    lastTimeStamp = performance.now();
    MYGAME.gameController.startNewGame();

    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize : initialize,
    run : run
  };
}());