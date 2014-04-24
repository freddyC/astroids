MYGAME.playerShip = function(spec, graphics) {
  'use strict';

  var that = {}
    , isAccelerating = false
    , isTurningLeft = false
    , isTurningRight = false
    , shouldTryToHyperJump = false
    , isPlayingRocketSound = false
    , shouldTryToFireLaser = false
    , rocketSoundSecondsPlayed = 0
    , timeSinceLastJump = 5
    , hyperParticles = null
    , hyperSpec
    , hyperCenter
    , secondsSinceLastLaserFired = 100 // Just some really big number to allow it to fire right away
    , engineSpec
    , engine1
    , engine2
    , shieldSpec
    , shieldSize
    , shieldsRemaining = 3
    , shieldHitsRemaining = 0
    , shieldIsActive = true
    , secondsShieldHasBeenActive
    , hyperSnd = new Audio('sounds/hypersound.mp3')
    , laserSnd = new Audio('sounds/pew.mp3')
    , rocketSnd = new Audio('sounds/rocket.mp3')
    , myKeyboard = MYGAME.input.Keyboard()
    , ship = {
        image: spec.image,
        acceleration: spec.acceleration,
        direction: 0,
        speed: 0,
        rotation: 0,
        polyPoints: spec.polyPoints,
        size: {
          width: spec.width,
          height: spec.height
        },
        center: {
          x: spec.center.x,
          y: spec.center.y
        },
        fade: 1.0
      }
    ;

  if (spec.width > spec.height) {
	  shieldSize = spec.width * 2
  } else {
	  shieldSize = spec.height * 2
  }
  
  shieldSpec = {
    image: MYGAME.images['images/shield.png'],
    fade: 0.6,
	center: ship.center,
	size: {
		width: shieldSize,
		height: shieldSize
	},
	rotation: 0
  };
  
  hyperSnd.volume = 0.5;
  laserSnd.volume = 0.3;
  rocketSnd.volume = 0.4;
  
  that.mass = 2;
  
  that.shieldDidCollide = function() {
	 
  };
  
  that.setNewVector = function(v) {
	  ship.direction = v.direction;
	  ship.speed = v.magnitude / 100;
  };
  
  that.setDirection = function(angle) {
	  ship.direction = angle;
  };
  
  that.setSpeed = function(speed) {
	  ship.speed = speed;
  };
  
  that.nudgeUp = function() {
	  ship.center.y -= 1;
  };
  
  that.nudgeDown = function() {
	  ship.center.y += 1;
  };
  
  that.nudgeRight = function() {
	  ship.center.x += 1;
  };
  
  that.nudgeLeft = function() {
	  ship.center.x -= 1;
  };
  
  that.getShieldCircle = function() {
	  return {
		  point: JSON.parse(JSON.stringify(ship.center)),
		  radius: shieldSize / 2
	  };
  };
  
  that.isShieldActive = function() {
	  return shieldIsActive;
  };
  
  that.shipShouldAccel = function() {
    isAccelerating = true;
  };

  that.shipShouldTurnRight = function() {
    isTurningRight = true;
  };

  that.shipShouldTurnLeft = function() {
    isTurningLeft = true;
  };

  that.fireLaserKeyPressed = function() {
    shouldTryToFireLaser = true;
  };

  that.hyperJumpKeyPressed = function () {
    if (timeSinceLastJump > 5) {
      shouldTryToHyperJump = true;
    }
  };

  var laserHandler = function(elapsedTime) {
    secondsSinceLastLaserFired += (elapsedTime / 1000);
    if (shouldTryToFireLaser) {
      shouldTryToFireLaser = false;
      if (!MYGAME.gameController.playerShipIsInvincible && MYGAME.gameController.lasers.length < 6) {
        if (secondsSinceLastLaserFired >= 0.3) {
          secondsSinceLastLaserFired = 0;
          var laserSpec = {
            image: MYGAME.images['images/pew.png'],
            speed: 700 + (ship.speed * 50 * Angles.halfAngleRatio(ship.direction, ship.rotation)),
            direction: ship.rotation,
            lifetime: 2,
            size: {
              width: 6,
              height: 34
            },
            center: {
              x: ship.center.x + (Math.sin(ship.rotation) * (ship.size.width / 2 + 3)),
              y: ship.center.y - (Math.cos(ship.rotation) * (ship.size.height / 2 + 14))
            }
          };
          MYGAME.gameController.lasers.push(MYGAME.laser(laserSpec, MYGAME.graphics));
          laserSnd.pause();
          laserSnd.currentTime = 0;
          laserSnd.play();
        }
      }
    }
  };

  var moveShip = function(elapsedTime) {
    var elapsedSeconds = elapsedTime / 1000;

    if (isTurningLeft) {
      ship.rotation -= elapsedSeconds * 5;
    }

    if (isTurningRight) {
      ship.rotation += elapsedSeconds * 5;
    }

    if (isAccelerating) {
      var Xspeed = Math.sin(ship.direction) * ship.speed
        , Yspeed = Math.cos(ship.direction) * ship.speed
        , Xforce = Math.sin(ship.rotation) * ship.acceleration * elapsedSeconds
        , Yforce = Math.cos(ship.rotation) * ship.acceleration * elapsedSeconds
        , eSpec
        ;

      ship.speed = Math.sqrt(Math.pow((Xspeed + Xforce),2) + Math.pow((Yspeed + Yforce),2));
      ship.direction = (Math.atan((Xspeed + Xforce)/(Yspeed + Yforce))) % (2*Math.PI);

      if (Yspeed + Yforce < 0) {
        ship.direction = ship.direction + Math.PI;
      }

      var speedOffset = 0;

      if (Angles.halfAngleRatio(ship.direction, ship.rotation) < 0) {
        speedOffset = (ship.speed * 50 * Angles.halfAngleRatio(ship.direction, ship.rotation));
      }

      eSpec = {
        shipFacing: ship.rotation,
        speed: {
          mean: 100 - speedOffset,
          stdev: 25
        },
        center: {
          x: ship.center.x + Math.sin(ship.rotation + (Math.PI * 1.225)) * (ship.size.width / 1.58),
          y: ship.center.y - Math.cos(ship.rotation + (Math.PI * 1.225)) * (ship.size.height / 1.58)
        }
      };

      for (var i = 0; i < 15; ++i) {
        engine1.create(eSpec);
      }

      eSpec = {
        shipFacing: ship.rotation,
        speed: {
          mean: 100 - speedOffset,
          stdev: 25
        },
        center: {
          x: ship.center.x + Math.sin(ship.rotation - Math.PI * 4.9 / 4) * ship.size.width/1.58,
          y: ship.center.y - Math.cos(ship.rotation - Math.PI * 4.9 / 4) * ship.size.height/1.58
        }
      };

      for (var i = 0; i < 15; ++i) {
        engine2.create(eSpec);
      }

    } else {
      //ship.speed = ship.speed - ship.acceleration * elapsedSeconds / 8;
      if (ship.speed < 0) {
        ship.speed = 0;
      }
    }

    if (ship.speed > 10) {
    ship.speed = 10;
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

  engineSpec = {
    image: MYGAME.images['images/blue.png'],
    lifetime: { mean: 1.0, stdev: 0.5 }
  };

  engine1 = MYGAME.playerShipEngine(engineSpec, MYGAME.graphics);
  engine2 = MYGAME.playerShipEngine(engineSpec, MYGAME.graphics);
  
  var hyperParticlesSpec = {
    image: MYGAME.images['images/whitestar.png'],
    lifetime: { mean: .3, stdev: 0.1 }
  };
  
  hyperParticles = MYGAME.hyperParticles(hyperParticlesSpec, MYGAME.graphics);

  var originalKeys = {
    accel: KeyEvent.DOM_VK_W,
    left: KeyEvent.DOM_VK_A,
    right: KeyEvent.DOM_VK_D,
    shoot: KeyEvent.DOM_VK_SPACE,
    jump: KeyEvent.DOM_VK_S
  }

  that.setInputListeners = function (isHumanPlayer) {
    if (!MYGAME.keys.accel) {
      MYGAME.keys.accel = originalKeys.accel
    }
    if (!MYGAME.keys.left) {
      MYGAME.keys.left = originalKeys.left
    }
    if (!MYGAME.keys.right) {
      MYGAME.keys.right = originalKeys.right
    }
    if (!MYGAME.keys.shoot) {
      MYGAME.keys.shoot = originalKeys.shoot
    }
    if (!MYGAME.keys.jump) {
      MYGAME.keys.jump = originalKeys.jump
    }

    if (isHumanPlayer) {
      myKeyboard.registerCommand(MYGAME.keys.accel, that.shipShouldAccel);
      myKeyboard.registerCommand(MYGAME.keys.left, that.shipShouldTurnLeft);
      myKeyboard.registerCommand(MYGAME.keys.right, that.shipShouldTurnRight);
      myKeyboard.registerCommand(MYGAME.keys.shoot, that.fireLaserKeyPressed);
      myKeyboard.registerCommand(MYGAME.keys.jump, that.hyperJumpKeyPressed);
    }
    //console.log('the keybaord object', myKeyboard)
  };

  that.stopSound = function() {
    isAccelerating = false;
    isPlayingRocketSound = false;
    rocketSnd.pause();
    rocketSnd.currentTime = 0;
    rocketSoundSecondsPlayed = 0;
  };

  that.getShipCenter = function () {
    // copy an object content to new object
	  
    return JSON.parse(JSON.stringify(ship.center));
  };
  
  that.getCenter = function () {
	    // copy an object content to new object
	  if(!ship.center.x || !ship.center.y) {
		  debugger;
	  }
	    return JSON.parse(JSON.stringify(ship.center));
	  };

  that.getShipVector = function () {
	    // copy an object content to new object
	  return JSON.parse(JSON.stringify({direction: ship.direction, point: ship.center}));
	  };

  that.getShipRotation = function() {
	  return JSON.parse(JSON.stringify(ship.rotation));
  };

  that.getShipDirection = function() {
	  return JSON.parse(JSON.stringify(ship.direction));
  };

  that.getShipSpeed = function() {
	  return JSON.parse(JSON.stringify(ship.speed));
  };
  
  that.getSpeed = function(speed) {
		 return JSON.parse(JSON.stringify(ship.speed));
	  };

  that.getHyperAvail = function() {
	  return timeSinceLastJump > 5;
  };
  
  that.getHyperCooldownPercent = function() {
	  var percent = timeSinceLastJump / 5;
	  if (percent > 1) {
		  percent = 1;
	  }
	  return percent;
  };
  
  that.resetShip = function() {
    that.stopSound();
    ship.rotation = 0;
    ship.direction = 0;
    ship.speed = 0;
    ship.center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  };

  that.getShipPolygon = function() {
    var poly = [], i, x, y;
    for(i = 0; i < ship.polyPoints.length;i++ ) {
      x = ship.center.x + Math.sin(ship.rotation + ship.polyPoints[i].angle) * ship.polyPoints[i].distance;
      y = ship.center.y + Math.cos(ship.rotation + ship.polyPoints[i].angle) * ship.polyPoints[i].distance;
      poly.push({x:x,y:y});
    }
    return poly;
  };

  that.getComponentVector = function() {
	  var vector = {
		    magnitude: ship.speed * 100,
		    angle: ship.direction
	  };
	  return componentVector(vector);
  };
  
  that.update = function(elapsedTime) {
    if(!MYGAME.gameController.playerShipShouldAppear) {
      engine1.update(elapsedTime/1000);
        engine2.update(elapsedTime/1000);
        hyperParticles.update(elapsedTime/1000);
      return;
    }

    // Update ship code here
//    isAccelerating = false;
//    isTurningLeft = false;
//    isTurningRight = false;
    myKeyboard.update(elapsedTime);
    moveShip(elapsedTime);
    engine1.update(elapsedTime/1000);
    engine2.update(elapsedTime/1000);
    hyperParticles.update(elapsedTime/1000);
    timeSinceLastJump += elapsedTime/1000;
    
    shieldSpec.center = that.getShipCenter();
    shieldSpec.rotation = (shieldSpec.rotation + elapsedTime / 1000 * Math.PI) % (2 * Math.PI);

    if (shouldTryToHyperJump && timeSinceLastJump > 3) {
      shouldTryToHyperJump = false;
      hyperCenter = JSON.parse(JSON.stringify(ship.center));
      hyperParticles.setRandDirections();
      timeSinceLastJump = 0;
      ship.speed = 0;
      hyperSnd.play();
      hyperdriveHandler();
    }

    if (timeSinceLastJump < 0.25) {
    	var newHyperSpec = {
    	        speed: {
    	          mean: 600,
    	          stdev: 100
    	        },
    	        center: hyperCenter
    	      };
    	var newHyperSpec2 = {
    	        speed: {
    	          mean: 400,
    	          stdev: 100
    	        },
    	        center: JSON.parse(JSON.stringify(ship.center))
    	      };

    	      for (var i = 0; i < 60; ++i) {
    	    	  hyperParticles.create(newHyperSpec);
    	      }
    	      for (var i = 0; i < 30; ++i) {
    	    	  hyperParticles.create(newHyperSpec2);
    	      }

    }
    
    

    if (isAccelerating !== isPlayingRocketSound) {
      isPlayingRocketSound = isAccelerating;
      if (isPlayingRocketSound) {
        rocketSnd.play();
      } else {
        rocketSnd.pause();
        rocketSnd.currentTime = 0;
        rocketSoundSecondsPlayed = 0;
      }
    }

    if (isPlayingRocketSound) {
      rocketSoundSecondsPlayed += elapsedTime/1000;
      if (rocketSoundSecondsPlayed >= 20) {
        rocketSoundSecondsPlayed = 0;
        rocketSnd.pause();
        rocketSnd.currentTime = 0;
        rocketSnd.play();
      }
    }

    laserHandler(elapsedTime);
    isAccelerating = false;
    isTurningLeft = false;
    isTurningRight = false;
  };

  var hyperdriveHandler = function () {
    ship.center = MYGAME.HyperJump.whereToJump(ship.size.length > ship.size.width ? ship.size.length : ship.size.width);
  };

  that.render = function() {

    hyperParticles.render();
    engine1.render();
    engine2.render();
    if (MYGAME.gameController.playerShipShouldAppear) {
	    if (MYGAME.gameController.playerShipIsInvincible) {
	      ship.fade = 0.5;
	    } else {
	      ship.fade = 1.0;
	    }
	    graphics.drawImage(ship);
	    if (shieldIsActive) {
	    	graphics.drawImage(shieldSpec);
	    }
	}
    
  
  };

  return that;
};
