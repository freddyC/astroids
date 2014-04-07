MYGAME.playerShip = function(spec, graphics) {
  'use strict';

  var that = {}
    , left
    , right
    , accelerate
    , shoot
    , hyperdrive
    , isAccelerating = false
    , isTurningLeft = false
    , isTurningRight = false
    , shouldTryToHyperJump = false
    , isPlayingRocketSound = false
    , shouldTryToFireLaser = false
    , rocketSoundSecondsPlayed = 0
    , timeSinceLastJump = 0
    , secondsSinceLastLaserFired = 100 // Just some really big number to allow it to fire right away
    , engineSpec
    , engine1
    , engine2
    , rocketSnd
    , myKeyboard = MYGAME.input.Keyboard
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

  that.shipShouldAccel = function() {
    isAccelerating = true;
  };

  that.shipShouldTurnRight = function(elapsedTime) {
    isTurningRight = true;
  };

  that.shipShouldTurnLeft = function(elapsedTime) {
    isTurningLeft = true;
  };

  that.fireLaserKeyPressed = function() {
    shouldTryToFireLaser = true;
  };

  that.hyperJumpKeyPressed = function () {
    if (timeSinceLastJump > 3) {
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

          var laserSnd = new Audio('sounds/pew.mp3');
          laserSnd.volume = 0.3;
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

  rocketSnd = new Audio('sounds/rocket.mp3');
  rocketSnd.volume = 0.4;

  engineSpec = {
    image: MYGAME.images['images/blue.png'],
    lifetime: { mean: 1.0, stdev: 0.5 }
  };

  engine1 = MYGAME.playerShipEngine(engineSpec, MYGAME.graphics);
  engine2 = MYGAME.playerShipEngine(engineSpec, MYGAME.graphics);

  var originalKeys = {
    accel: KeyEvent.DOM_VK_W,
    left: KeyEvent.DOM_VK_A,
    right: KeyEvent.DOM_VK_D,
    shoot: KeyEvent.DOM_VK_SPACE,
    hyperdrive: KeyEvent.DOM_VK_S
  }
  that.keys = {};

  that.setInputListeners = function (isHumanPlayer) {
    console.log('you are setting input listeners');
    console.log(originalKeys);
    if (!that.keys.accelerate) {
      that.keys.accelerate = originalKeys.accel
    }
    if (!that.keys.left) {
      that.keys.left = originalKeys.left
    }
    if (!that.keys.right) {
      that.keys.right = originalKeys.right
    }
    if (!that.keys.shoot) {
      that.keys.shoot = originalKeys.shoot
    }
    if (!that.keys.hyperdrive) {
      that.keys.hyperdrive = originalKeys.hyperdrive
    }
    console.log(that.keys);

    if (isHumanPlayer) {
      myKeyboard.registerCommand(that.keys.accelerate, that.shipShouldAccel);
      myKeyboard.registerCommand(that.keys.left, that.shipShouldTurnLeft);
      myKeyboard.registerCommand(that.keys.right, that.shipShouldTurnRight);
      myKeyboard.registerCommand(that.keys.shoot, that.fireLaserKeyPressed);
      myKeyboard.registerCommand(that.keys.hyperdrive, that.hyperJumpKeyPressed);
    }
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

  that.update = function(elapsedTime) {
    if(!MYGAME.gameController.playerShipShouldAppear) {
      engine1.update(elapsedTime/1000);
        engine2.update(elapsedTime/1000);
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
    timeSinceLastJump += elapsedTime/1000;

    if (shouldTryToHyperJump && timeSinceLastJump > 3) {
      shouldTryToHyperJump = false;
      timeSinceLastJump = 0;
      ship.speed = 0;
      hyperdriveHandler();
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
  if (MYGAME.gameController.playerShipShouldAppear) {
    if (MYGAME.gameController.playerShipIsInvincible) {
    ship.fade = 0.5;
    } else {
    ship.fade = 1.0;
    }
      graphics.drawImage(ship);

  }
  engine1.render();
  engine2.render();
  };

  return that;
};