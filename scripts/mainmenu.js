/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['main-menu'] = (function() {
  'use strict';
  
  var secondsIdle
  , lastTimeStamp
  ;
  
  function initialize() {
    // Setup each of menu events for the screens
    document.getElementById('id-new-game').addEventListener(
      'click',
      function() { MYGAME.game.showScreen('game-play'); },
      false);

    document.getElementById('id-controls').addEventListener('click', function() {
      MYGAME.game.showScreen('configure-controls');
    }, false);

    document.getElementById('id-high-scores').addEventListener('click', function() {
      MYGAME.game.showScreen('high-scores');
    }, false);

    document.getElementById('id-help').addEventListener('click', function() {
      MYGAME.game.showScreen('help');
    }, false);

    document.getElementById('id-about').addEventListener('click', function() {
      MYGAME.game.showScreen('about');
    }, false);
  }

  function idleLoop(time) {
	  
	secondsIdle += (time - lastTimeStamp) / 1000;
	lastTimeStamp = time;
	
	if (secondsIdle <  10) {
		requestAnimationFrame(idleLoop);
	} else {
		window.onkeypress = null;
		window.onmousemove = null;
		window.mousedown = null;
		window.mouseup = null;
		MYGAME.game.showScreen('game-play');
	}
  }
  
  
  function run() {
    // I know this is empty, there isn't anything to do.
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
    run : run
  };
}());
