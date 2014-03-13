/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME, console, KeyEvent, requestAnimationFrame, performance */
MYGAME.screens['game-play'] = (function() {
	'use strict';
	
	var myMouse = MYGAME.input.Mouse(),
		cancelNextRequest = false,
		playerShip = null,
		mediumAsteroids = [],
		largeAsteroids = [],
		backgroundSnd = new Audio('sounds/background.mp3'),
		soundSecondsPlayed = 0;
	
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
	
	function backgroundSound(elapsedSeconds) {
		soundSecondsPlayed += elapsedSeconds;
		if (soundSecondsPlayed >= 70) {
			soundSecondsPlayed = 0;
			backgroundSnd.pause();
			backgroundSnd.currentTime = 0;
			backgroundSnd.play();
		} 
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

		backgroundSound(MYGAME.elapsedTime / 1000);
		
		MYGAME.graphics.clear();
		
		// Do updates and render here
		playerShip.update(MYGAME.elapsedTime);
		playerShip.render();
		
		var i;
		for (i = 0; i < mediumAsteroids.length; i++) {
			mediumAsteroids[i].update(MYGAME.elapsedTime);
			mediumAsteroids[i].render();
		}
		
		for (i = 0; i < largeAsteroids.length; i++) {
			largeAsteroids[i].update(MYGAME.elapsedTime);
			largeAsteroids[i].render();
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
		
		var i, 
			asteroidSpec,
			mediumAsteroidImageArray = [],
			largeAsteroidImageArray = [],
			imageName;
		
		for (i = 1; i <= 64; i++) {
			imageName = 'images/asteroid_medium/medium' + i + '.png';
			mediumAsteroidImageArray.push(MYGAME.images[imageName]);
		}
		
		
		for (i = 0; i < 8; i++) {
			asteroidSpec = { imageArray: mediumAsteroidImageArray,
							  size: { width: 52, height: 52 },
							  center: { x: Random.nextRange(0, window.innerWidth) , y: Random.nextRange(0, window.innerHeight) },
							  speed: Random.nextRange(100, 300),
							  secondsToCycle: (Math.random() + 1)
							};
		
			mediumAsteroids.push(MYGAME.asteroid(asteroidSpec, MYGAME.graphics));
		}
		
		for (i = 1; i <= 60; i++) {
			imageName = 'images/asteroid_large/large' + i + '.png';
			largeAsteroidImageArray.push(MYGAME.images[imageName]);
		}
		
		
		for (i = 0; i < 5; i++) {
			asteroidSpec = { imageArray: largeAsteroidImageArray,
							  size: { width: 110, height: 110 },
							  center: { x: Random.nextRange(0, window.innerWidth) , y: Random.nextRange(0, window.innerHeight) },
							  speed: Random.nextRange(100, 300),
							  secondsToCycle: (Math.random() + 1)
							};
		
			largeAsteroids.push(MYGAME.asteroid(asteroidSpec, MYGAME.graphics));
		}
		
		backgroundSnd.play();
		
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
