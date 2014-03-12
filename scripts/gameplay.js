/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME, console, KeyEvent, requestAnimationFrame, performance */
MYGAME.screens['game-play'] = (function() {
	'use strict';
	
	var myMouse = MYGAME.input.Mouse(),
		cancelNextRequest = false,
		playerShip = null,
		testAsteroids = [];
	
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
		
		var i;
		for (i = 0; i < testAsteroids.length; i++) {
			testAsteroids[i].update(MYGAME.elapsedTime);
			testAsteroids[i].render();
		}
		
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		MYGAME.lastTimeStamp = performance.now();
		
		//Create the new game here
		/*
		var spec = { image: MYGAME.images['images/enterprise.png'],
					 width: 43,
					 height: 100,
					 acceleration: 10,
					 center: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
		};
		*/
		var shipSpec = { image: MYGAME.images['images/klingon_raptor.png'],
				 width: 65,
				 height: 76,
				 acceleration: 10,
				 center: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
		};
		
		playerShip = MYGAME.playerShip(shipSpec, MYGAME.graphics);
		
		
		var imageArray = [], i = 0, imageName;
		for (i = 1; i <= 64; i++) {
			imageName = 'images/asteroid_medium/medium' + i + '.png';
			imageArray.push(MYGAME.images[imageName]);
		}
		
		//console.log(imageArray);
		var i, asteroidSpec;
		for (i = 0; i < 10; i++) {
			asteroidSpec = { imageArray: imageArray,
							  size: { width: 46, height: 46 },
							  center: { x: Random.nextRange(0, window.innerWidth) , y: Random.nextRange(0, window.innerHeight) },
							  speed: Random.nextRange(100, 300),
							  secondsToCycle: (Math.random() + 1)
							};
		
			testAsteroids.push(MYGAME.asteroid(asteroidSpec, MYGAME.graphics));
		}
		
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
