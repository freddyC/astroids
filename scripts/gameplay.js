/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME, console, KeyEvent, requestAnimationFrame, performance */
MYGAME.screens['game-play'] = (function() {
	'use strict';
	
	var myMouse = MYGAME.input.Mouse(),
		cancelNextRequest = false,
		levelHandler = null;
	
	function initialize() {
		console.log('game initializing...');

		myMouse.registerCommand('mouseup', function(e) {
			if (levelHandler !== null) {
				levelHandler.mouseClicks.push(e);
			}
		});
		
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		MYGAME.elapsedTime = time - MYGAME.lastTimeStamp;
		MYGAME.lastTimeStamp = time;

		myMouse.update(MYGAME.elapsedTime);

		MYGAME.graphics.clear();
		
		if(levelHandler.gameInProgress) {
			levelHandler.update(MYGAME.elapsedTime);
			levelHandler.render(MYGAME.elapsedTime);
		} else {
			cancelNextRequest = true;
			MYGAME.game.showScreen('main-menu');
		}

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		MYGAME.lastTimeStamp = performance.now();
		
		MYGAME.score = 0;
		levelHandler = MYGAME.MakeLevelHandler();
		levelHandler.init();
		document.getElementById('score').style.visibility = "visible";
		
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
