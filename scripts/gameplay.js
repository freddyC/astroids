/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME, console, KeyEvent, requestAnimationFrame, performance */
MYGAME.screens['game-play'] = (function() {
	'use strict';
	
	var myMouse = MYGAME.input.Mouse(),
		cancelNextRequest = false,
		playerShip = null;
	
	window.onscroll = function () { window.scrollTo(0, 0); };
	
	
	function initialize() {
		console.log('game initializing...');

		document.getElementById('canvas-main').height = window.innerHeight;
		document.getElementById('canvas-main').width = window.innerWidth;
		document.getElementById('canvas-main').style.height = '100%';
		document.getElementById('canvas-main').style.width = '100%';

		/*
		myMouse.registerCommand('mouseup', function(e) {
			if (levelHandler !== null) {
				levelHandler.mouseClicks.push(e);
			}
		});
		*/
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		MYGAME.elapsedTime = time - MYGAME.lastTimeStamp;
		MYGAME.lastTimeStamp = time;

		//myMouse.update(MYGAME.elapsedTime);

		MYGAME.graphics.clear();
		
		// Do updates and render here
		playerShip.update(MYGAME.elapsedTime);
		playerShip.render();
		
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		MYGAME.lastTimeStamp = performance.now();
		
		//Create the new game here
		var spec = { image: MYGAME.images['images/ship.png'],
					 width: 50,
					 height: 50,
					 acceleration: 10,
					 center: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
		};
		
		playerShip = MYGAME.playerShip(spec, MYGAME.graphics);
		
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
