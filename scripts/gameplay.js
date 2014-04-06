/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME, console, KeyEvent, requestAnimationFrame, performance */
MYGAME.screens['game-play'] = (function() {
  'use strict';

  var myMouse = MYGAME.input.Mouse()
    , cancelNextRequest = false
    , lastTimeStamp
    , humanPlayer = true
    ;

  window.onscroll = function () {
    window.scrollTo(0, 0);
  };

  function setHumanPlayer (isHuman) {
	  humanPlayer = isHuman;
  }
  
  function initialize() {
    document.getElementById('canvas-main').height = window.innerHeight;
    document.getElementById('canvas-main').width = window.innerWidth;
    document.getElementById('canvas-main').style.height = '100%';
    document.getElementById('canvas-main').style.width = '100%';
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
    	if (humanPlayer) {
    		MYGAME.game.showScreen('get-player');
    	}
      }
    });
  }
  
  function startInputListeners () {
	  window.onkeypress = function(){ stopAttractMode(); };
	  window.onmousemove = function(){ stopAttractMode(); };
	  window.mousedown = function(){ stopAttractMode(); };
	  window.mouseup = function(){ stopAttractMode(); };
  }

  function stopInputListeners () {
	  window.onkeypress = null;
      window.onmousemove = null;
	  window.mousedown = null;
      window.mouseup = null;
  }
  
  function stopAttractMode () {
	  console.log('input detected!');
	  stopInputListeners ();
	  MYGAME.gameController.clearGame();
	  MYGAME.gameController.gameInProgress = false;
	  MYGAME.game.showScreen('main-menu');
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
    if (!humanPlayer) {
    	startInputListeners ();
    }
    MYGAME.gameController.run(humanPlayer);
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize : initialize,
    run : run,
    setHumanPlayer : setHumanPlayer
  };
}());