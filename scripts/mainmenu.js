/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['main-menu'] = (function() {
  'use strict';
  
  var secondsIdle
  , lastTimeStamp
  , inMainMenu
  ;
  
  function stopIdleLoop () {
	  inMainMenu = false;
  }
  
  function initialize() {
    // Setup each of menu events for the screens
    document.getElementById('id-new-game').addEventListener(
      'click',
      function() {
    	  MYGAME.screens['main-menu'].stopIdleLoop();
    	  MYGAME.screens['game-play'].setHumanPlayer(true);
    	  MYGAME.game.showScreen('game-play'); },
      false);

    document.getElementById('id-controls').addEventListener('click', function() {
      MYGAME.screens['main-menu'].stopIdleLoop();
      MYGAME.game.showScreen('configure-controls');
    }, false);

    document.getElementById('id-high-scores').addEventListener('click', function() {
      MYGAME.screens['main-menu'].stopIdleLoop();
      MYGAME.game.showScreen('high-scores');
    }, false);

    document.getElementById('id-help').addEventListener('click', function() {
      MYGAME.screens['main-menu'].stopIdleLoop();
      MYGAME.game.showScreen('help');
    }, false);

    document.getElementById('id-about').addEventListener('click', function() {
      MYGAME.screens['main-menu'].stopIdleLoop();
      MYGAME.game.showScreen('about');
    }, false);
  }

  function idleLoop(time) {
	  
	secondsIdle += (time - lastTimeStamp) / 1000;
	lastTimeStamp = time;
	
	if (secondsIdle <  10 && inMainMenu) {
		requestAnimationFrame(idleLoop);
	} else {
		if (inMainMenu) {
		  MYGAME.screens['game-play'].setHumanPlayer(false);
		  MYGAME.game.showScreen('game-play');
		}
	}
  }
 
  function run() {
    // I know this is empty, there isn't anything to do.
	  inMainMenu = true;
	  secondsIdle = 0;
	  lastTimeStamp = performance.now();
	  
	  window.onkeypress = function(){ secondsIdle = 0; };
	  window.onmousemove = function(){ secondsIdle = 0; };
	  window.mousedown = function(){ secondsIdle = 0; };
	  window.mouseup = function(){ secondsIdle = 0; };
	  
	  requestAnimationFrame(idleLoop);
	 // MYGAME.game.showScreen('game-play');
  }

  return {
    initialize : initialize,
    run : run,
    stopIdleLoop : stopIdleLoop
  };
}());
