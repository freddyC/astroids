MYGAME.playerShip = function(spec, graphics) {
	'use strict';
	
	var that = {},
		isAccelerating = false,
		isTurningLeft = false,
		isTurningRight = false,
		
		myKeyboard = MYGAME.input.Keyboard(),
		
		ship = { image: spec.image,
				 size: {width: spec.width, height: spec.height},
				 center: {x: spec.center.x, y: spec.center.y},
				 acceleration: spec.acceleration,
				 direction: 0,
				 speed: 0,
				 rotation: 0 },
				 
		shipShouldAccel = function() {
			isAccelerating = true;
		},
		
		shipShouldTurnRight = function(elapsedTime) {
			isTurningRight = true;
		},
		
		shipShouldTurnLeft = function(elapsedTime) {
			isTurningLeft = true;
		},
		
		moveShip = function(elapsedTime) {
			
			var elapsedSeconds = elapsedTime / 1000;
			
			if (isTurningLeft) {
				ship.rotation -= elapsedSeconds * 4;
			}
			
			if (isTurningRight) {
				ship.rotation += elapsedSeconds * 4;
			}
			
			if (isAccelerating) {
				
				var Xspeed = Math.sin(ship.direction) * ship.speed,
					Yspeed = Math.cos(ship.direction) * ship.speed,
					Xforce = Math.sin(ship.rotation) * ship.acceleration * elapsedSeconds,
					Yforce = Math.cos(ship.rotation) * ship.acceleration * elapsedSeconds;

				ship.speed = Math.sqrt(Math.pow((Xspeed + Xforce),2) + Math.pow((Yspeed + Yforce),2));
				console.log('speed: ' + ship.speed);
				ship.direction = Math.atan((Xspeed + Xforce)/(Yspeed + Yforce));
				
				if (Yspeed + Yforce < 0) {
					ship.direction = ship.direction + Math.PI;
				}
				
			} else {
				ship.speed = ship.speed - ship.acceleration * elapsedSeconds / 8;
				if (ship.speed < 0) {
					ship.speed = 0;
				}
			}
			
			ship.center.x += Math.sin(ship.direction) * ship.speed;
			ship.center.y -= Math.cos(ship.direction) * ship.speed;
			
			if (ship.center.y - ship.size.height/2 >= window.innerHeight) {
				ship.center.y =  -ship.size.height/2;
			} else if (ship.center.y + ship.size.height/2 <= 0) {
				ship.center.y = window.innerHeight + ship.size.height/2;
			}
			
			if (ship.center.x - ship.size.width/2 >= window.innerWidth) {
				ship.center.x =  -ship.size.width/2;
			} else if (ship.center.x + ship.size.width/2 <= 0) {
				ship.center.x = window.innerWidth + ship.size.width/2;
			}
			
		};

	myKeyboard.registerCommand(KeyEvent.DOM_VK_W, shipShouldAccel);
	myKeyboard.registerCommand(KeyEvent.DOM_VK_A, shipShouldTurnLeft);
	myKeyboard.registerCommand(KeyEvent.DOM_VK_D, shipShouldTurnRight);
		
	that.update = function(elapsedTime) {
		// Update ship code here
		isAccelerating = false;
		isTurningLeft = false;
		isTurningRight = false;
		myKeyboard.update(elapsedTime);
		moveShip(elapsedTime);
	};
	
	that.render = function() {
		graphics.drawImage(ship);
	};
	
	return that;
};