// 0.7155849933187

MYGAME.gameController = (function() {
  'use strict';

  var asteroids
    , alldone
    , largeAsteroidRadius
    , mediumAsteroidRadius
    , smallAsteroidRadius
    , backgroundSnd
    , shipBoomSound
    , asteroidBoomSound
    , soundSecondsPlayed
    , timeSinceShipWasDestroyed
    , smallAsteroidImageArray
    , reverseSmallAsteroidImageArray
    , mediumAsteroidImageArray
    , reverseMediumAsteroidImageArray
    , largeAsteroidImageArray
    , reverseLargeAsteroidImageArray
    , remainingShips
    , pointsSinceLastAlien
    , alienBoomSnd
    , isHumanPlayer
    , hyperBar
    , shieldBar
    , sheildIsActive
    , that = {
        asteroids: null,
        wave: 0,
        playerShip: null,
        playerShipIsInvincible: null,
        playerShipShouldAppear: null,
        alienShips: null,
        shipExploder: null,
        lasers: null,
        alienLasers: null,
        asteroidExploder: null,
        gameInProgress: null,
        score: 0,
        alienPewSound: null
      }
    ;

  that.clearGame = function () {
    backgroundSnd.currentTime = 0;
    backgroundSnd.pause();
    that.playerShip.stopSound();
    timeSinceShipWasDestroyed = 0;
    asteroids = [];
    that.lasers = [];
    that.playerShip = initPlayerShip();
    that.wave = 0;
  }

  that.init = function () {
    backgroundSnd = new Audio('sounds/background.mp3');
    backgroundSnd.volume = 0.5;
    that.alienPewSound = new Audio('sounds/alienshot.mp3');
    alienBoomSnd = new Audio('sounds/alienboom.mp3');
    shipBoomSound = new Audio('sounds/bang.mp3');
    shipBoomSound.volume = 0.6;
    asteroidBoomSound = new Audio('sounds/asteroid-bang.mp3');
    asteroidBoomSound.volume = 0.8;
    smallAsteroidImageArray = [];
    mediumAsteroidImageArray = [];
    largeAsteroidImageArray = [];
    reverseSmallAsteroidImageArray = [];
    reverseMediumAsteroidImageArray = [];
    reverseLargeAsteroidImageArray = [];
    hyperBar = MYGAME.hyperBar({ x: window.innerWidth - 200, y: 20 });
    shieldBar = MYGAME.shieldBar({ x: window.innerWidth - 200, y: 60 });
    initAsteroidsImgs();
    that.shipExploder = MYGAME.shipexplosion();
    that.asteroidExploder = MYGAME.asteroidexplosion();
    that.playerShip = initPlayerShip();
  };

  that.run = function (humanPlayer) {
    that.alienShips = [];
    that.alienLasers = [];
    that.alienShips = [];
    that.alienLasers = [];
    pointsSinceLastAlien = 0;
    isHumanPlayer = true;
    sheildIsActive = false;
    isHumanPlayer = humanPlayer;
    that.playerShip.setInputListeners(isHumanPlayer);
    alldone = 0;
    that.score = 0;
    soundSecondsPlayed = 0;
    timeSinceShipWasDestroyed = 0;
    asteroids = [];
    remainingShips = 3;
    backgroundSnd.play();
    that.lasers = [];
    that.asteroids = asteroids;
    that.playerShipIsInvincible = false;
    that.playerShipShouldAppear = true;
    that.gameInProgress = true;
    that.wave = 0;
  };

  that.update = function (elapsedTime) {
    if (!that.gameInProgress) {
      return;
    }

    if (alldone > 80) {
      that.gameInProgress = false;
      that.clearGame();
      return;
    }
    if (remainingShips < 0) {
      ++alldone;
    }
    if (!isHumanPlayer) {
      AIUpdate();
    }

    hyperBar.update(that.playerShip.getHyperCooldownPercent());
    shieldBar.update(that.playerShip.getShieldCooldownPercent());

    that.playerShip.update(elapsedTime);
    that.shipExploder.update(elapsedTime);
    that.asteroidExploder.update(elapsedTime);
    updateDestroyedShip(elapsedTime);
    if (backgroundSnd.paused) {
      backgroundSnd.play();
    }
    updateAsteroids(elapsedTime);
    updateLasers(elapsedTime);
    updateAlienPews(elapsedTime);
    updateShipCollision(elapsedTime);
    updateAsteroidCollision(elapsedTime);
    updateAlienShips(elapsedTime);
    updateAlienCollision();
    if (asteroids.length == 0) {
      addAsteroid();
    }
  };

  that.render = function () {
  if (remainingShips >= 0) {
      that.playerShip.render();
  }
    renderLasers();
    that.asteroidExploder.render();
    renderAsteroids();
    that.shipExploder.render();
    renderAlienShips();
    renderAlienPews();
    if (remainingShips >= 0) {
      drawRemainingShips();
      renderGameInfo();
      hyperBar.render();
      shieldBar.render(that.playerShip.getShieldsRemaining());
    }
  };

  var renderGameInfo = function () {
    var scoreSpec = {
     text: 'Score: ' + that.score + '   Level: ' + that.wave,
     font: '18pt Calibri',
     color: '#87D1F3',
     x: remainingShips * 30 + 20,
     y: 41
    };
    MYGAME.graphics.drawText(scoreSpec);
  };

  var updateDestroyedShip = function (elapsedSeconds) {
    elapsedSeconds /= 1000;
    timeSinceShipWasDestroyed += elapsedSeconds;
    if (timeSinceShipWasDestroyed >= 1) {
      that.playerShipShouldAppear = true;
    }
    if (timeSinceShipWasDestroyed >= 4) {
      that.playerShipIsInvincible = false;
    }
  };

  var updateAlienPews = function (elapsedTime) {
    that.alienLasers.forEach(function (alienLaser) {
      alienLaser.update(elapsedTime);
      });
    that.alienLasers = that.alienLasers.filter(function (pew) {
        return !pew.shouldBeDeleted;
      });
  };

  var renderAlienPews = function () {
    that.alienLasers.forEach(function (alienLasers) {
      alienLasers.render();
      });
  };

  var updateAlienShips = function (elapsedTime) {
    if (pointsSinceLastAlien >= 5000) {
      pointsSinceLastAlien = 0;
      if (that.score < 15000) {
        createLargeAlienShip();
      } else {
        createSmallAlienShip();
      }
    }

    that.alienShips.forEach(function (alienShip) {
      alienShip.update(elapsedTime);
      });
    that.alienShips = that.alienShips.filter(function (alien) {
        return !alien.shouldBeDeleted;
      });
  };

  var renderAlienShips = function () {
    that.alienShips.forEach(function (alienShip) {
      alienShip.render();
    });
  };

  var createSmallAlienShip = function () {

    var spec = {
      image: MYGAME.images['images/ufo1.png'],
      size: {
        width: 60,
        height: 30
      },
      center: {
        x: (that.playerShip.getShipCenter().x >= window.innerWidth / 2) ?  40 : (window.innerWidth - 40),
        y: (that.playerShip.getShipCenter().y <= window.innerHeight / 2) ? (window.innerHeight - 60) : 60
      },
      direction: (that.playerShip.getShipCenter().x >= window.innerWidth / 2) ? (Math.PI / 2) : (Math.PI * 3 / 2),
      rotation: 0,
      speed: 125,
      shotFreqency: {
        mean: 3,
        stdDev: 1
      },
      shotAccuracy: Math.PI / 16,
      shotSpeed: 400,
      shotLifetime: 1.2,
      points: 1000,
      collisionCircles: [
        {
          angle: Math.PI / 2,
          distance: 15,
          radius: 17
        }, {
          angle: Math.PI * 3 / 2,
          distance: 15,
          radius: 17
        }
      ]
    };
    that.alienShips.push(MYGAME.alienShip(spec, MYGAME.graphics));
  };

  var createLargeAlienShip = function () {

    var spec = {
      image: MYGAME.images['images/ufo2.png'],
      size: {
        width: 150,
        height: 63
      },
      center: {
        x: (that.playerShip.getShipCenter().x >= window.innerWidth / 2) ?  80 : (window.innerWidth - 80),
        y: (that.playerShip.getShipCenter().y <= window.innerHeight / 2) ? (window.innerHeight - 80) : 80
      },
      direction: (that.playerShip.getShipCenter().x >= window.innerWidth / 2) ? (Math.PI / 2) : (Math.PI * 3 / 2),
      rotation: 0,
      speed: 75,
      shotFreqency: {
        mean: 3,
        stdDev: 1
      },
      shotAccuracy: Math.PI / 4,
      shotSpeed: 300,
      shotLifetime: 1.4,
      points: 500,
      collisionCircles: [
        {
          angle: Math.PI / 1.9,
          distance: 60,
          radius: 20
        }, {
          angle: Math.PI * 1.4,
          distance: 60,
          radius: 20
        }, {
          angle: 0,
          distance: 0,
          radius: 30
        }
      ]
    };
    that.alienShips.push(MYGAME.alienShip(spec, MYGAME.graphics));
  };

  that.getAsteroids = function () {
  return asteroids;
  };

  var addAsteroid = function () {
    ++that.wave;
    for (var i = 0; i < that.wave + that.wave/2; ++i) {
      asteroids.push(createLargeAsteroid());
    }
  }

  var createLargeAsteroid = function (center) {
    var fromTop = (Math.random() < 0.5)
      , reverse = (Math.random() < 0.5)
      , sideLength = 175
      , radius = sideLength / 2
      ;

    largeAsteroidRadius = radius;

    if (!center) {
      center = {
        x: (fromTop) ? Random.nextRange(0, window.innerWidth) : 0 - radius,
        y: (fromTop) ? 0 - radius: Random.nextRange(0, window.innerHeight)
      };
    }

    var asteroidSpec = {
      imageArray: (reverse) ? reverseLargeAsteroidImageArray : largeAsteroidImageArray,
      size: {
        width: sideLength,
        height: sideLength
      },
      radius: radius,
      center: center,
      speed: Random.nextRange(50, 125),
      secondsToCycle: (Math.random() + 1),
      mass: 1
    };

    return MYGAME.asteroid(asteroidSpec, MYGAME.graphics);
  }

  var createMediumAsteroid = function (center) {
    var fromTop = (Math.random() < 0.5)
      , reverse = (Math.random() < 0.5)
      , sideLength = 85
      , radius = sideLength / 2
      ;

    mediumAsteroidRadius = radius;

    if (!center) {
      center = {
        x: (fromTop) ? Random.nextRange(0, window.innerWidth) : 0 - radius,
        y: (fromTop) ? 0 - radius: Random.nextRange(0, window.innerHeight)
      };
    }

    var asteroidSpec = {
      imageArray: (reverse) ? reverseMediumAsteroidImageArray : mediumAsteroidImageArray,
      size: {
        width: sideLength,
        height: sideLength
      },
      radius: radius,
      center: center,
      speed: Random.nextRange(100, 175),
      secondsToCycle: (Math.random() + 0.8),
      mass: 1
    };

    return MYGAME.asteroid(asteroidSpec, MYGAME.graphics);
  }

  var createSmallAsteroid = function (center) {
    var fromTop = (Math.random() < 0.5)
      , reverse = (Math.random() < 0.5)
      , sideLength = 45
      , radius = sideLength / 2
      ;

    smallAsteroidRadius = radius;

    if (!center) {
      center = {
        x: (fromTop) ? Random.nextRange(0, window.innerWidth) : 0 - radius,
        y: (fromTop) ? 0 - radius: Random.nextRange(0, window.innerHeight)
      };
    }

    var asteroidSpec = {
      imageArray: (reverse) ? reverseSmallAsteroidImageArray : smallAsteroidImageArray,
      size: {
        width: sideLength,
        height: sideLength
      },
      radius: radius,
      center: center,
      speed: Random.nextRange(150, 200),
      secondsToCycle: (Math.random() + 0.25),
      mass: 1
    };

    return MYGAME.asteroid(asteroidSpec, MYGAME.graphics);
  }

  var explodeLargeAsteroid = function (center) {
    var a = [];
    a.push(createMediumAsteroid(center));
    a.push(createMediumAsteroid(center));
    a.push(createMediumAsteroid(center));
    return a;
  }

  var explodeMediumAsteroid = function (center) {
    var a = [];
    a.push(createSmallAsteroid(center));
    a.push(createSmallAsteroid(center));
    a.push(createSmallAsteroid(center));
    a.push(createSmallAsteroid(center));
    return a;
  }

  var updateAsteroids = function (elapsedTime) {
    asteroids.forEach(function (asteroid) {
      asteroid.update(elapsedTime);
    })
  };

  var renderAsteroids = function () {
    asteroids.forEach(function (asteroid) {
      asteroid.render();
    })
  };

  var updateLasers = function (elapsedTime) {
    for (var i = 0; i < that.lasers.length; i++) {
      that.lasers[i].update(elapsedTime);
    }
  };

  var renderLasers = function () {
    for (var i = 0; i < that.lasers.length; i++) {
      that.lasers[i].render();
    }
  };

  var destroyPlayerShip = function() {
    remainingShips -= 1;
    timeSinceShipWasDestroyed = 0;
    that.playerShipIsInvincible = true;
    that.playerShipShouldAppear = false;
    that.playerShip.resetShip();
//    var shipBoomSound = new Audio('sounds/bang.mp3');
//    shipBoomSound.volume = 0.6;
    shipBoomSound.play();
  };

  var updateShipCollision = function (elapsedTime) {
    if (that.playerShipIsInvincible) {
      return;
    }
    
    if (that.playerShip.isShieldActive()) {
    	asteroids.forEach(function (asteroid) {
    		if (isCirclesColliding(asteroid.getAsteroidCircle(), that.playerShip.getShieldCircle())) {
    			console.log('collision');
    			
    			that.playerShip.shieldDidCollide();
    			
    			while(isCirclesColliding(asteroid.getAsteroidCircle(), that.playerShip.getShieldCircle())) {
    				if (asteroid.getCenter().y < that.playerShip.getCenter().y) {
    					asteroid.nudgeUp();
    					that.playerShip.nudgeDown();
    				} else {
    					asteroid.nudgeDown();
    					that.playerShip.nudgeUp();
    				}
    				
    				if (asteroid.getCenter().x < that.playerShip.getCenter().x) {
    					asteroid.nudgeLeft();
    					that.playerShip.nudgeRight();
    				} else {
    					asteroid.nudgeRight();
    					that.playerShip.nudgeLeft();
    				}
    				console.log('nudged');
    			}

    			var shipCenter = that.playerShip.getCenter()
    			  , asteroidCenter = asteroid.getCenter()
    			  , xComponent = asteroidCenter.x - shipCenter.x
    			  , yComponent = asteroidCenter.y - shipCenter.y
    			  ;
    			
    			var slope = (yComponent / xComponent);
    			
    			var newDirection;
    			if(slope > 0) {
    				newDirection = Math.atan(slope) - (Math.PI / 2);
    			} else {
    				newDirection = Math.atan(slope) + (Math.PI / 2);
    			}

    			if (that.playerShip.getCenter().y < asteroid.getCenter().y) {
    				that.playerShip.setDirection(newDirection);
    				asteroid.setDirection(newDirection + Math.PI);
    			} else {
    				that.playerShip.setDirection(newDirection + Math.PI);
    				asteroid.setDirection(newDirection);
    			}
    		} 
    	});
    } else {
      var shipPoly = that.playerShip.getShipPolygon();
      asteroids.forEach(function (asteroid) {
        var specs = {
          point: asteroid.center,
          radius: asteroid.radius
        };
        if ( isPolygonInCircle(shipPoly, specs) ) {
          that.shipExploder.explode(that.playerShip.getShipCenter());
          destroyPlayerShip();
        }
      });
    }

    that.alienLasers.forEach(function (pew) {
      if (isPolygonInCircle(shipPoly, pew.getPewCircle()) || isPointInPolygon(pew.getPewCenter(), shipPoly)) {
        pew.shouldBeDeleted = true;
        that.shipExploder.explode(that.playerShip.getShipCenter());
            destroyPlayerShip();
      }
    });

  };

  var updateAlienCollision = function () {
    that.lasers.forEach(function (laser) {
      var poly = laser.getLaserRect();
      that.alienShips.forEach(function (alien) {
        alien.getShipCollisionCircles().forEach(function (circle) {
          if(isPolygonInCircle(poly, circle)) {
            that.shipExploder.explode(alien.getShipCenter());
            addPointsToScore(alien.points);
            alien.shouldBeDeleted = true;
            alienBoomSnd.pause();
            alienBoomSnd.currentTime = 0;
            alienBoomSnd.play();
          }
        });
      });
    });
  };

  function checkAsteroidLaserCollision (laser, poly, asteroid) {
    var obj = {
      point: asteroid.center,
      radius: asteroid.radius
    };
    if (!laser.shouldBeDeleted && isPolygonInCircle(poly, obj)) {
      laser.shouldBeDeleted = true;
      asteroid.shouldBeDeleted = true;
      that.asteroidExploder.explode(asteroid.getAsteroidCenter());
      asteroidBoomSound.play();
    }
  }

  var updateAsteroidCollision = function (elapsedTime) {
    that.lasers.forEach(function (laser) {
      var poly = laser.getLaserRect();
      asteroids.forEach(function (asteroid) {
        checkAsteroidLaserCollision(laser, poly, asteroid);
      })
    })

    that.lasers = that.lasers.filter(function (laser) {
      return !laser.shouldBeDeleted;
    })

    var babyRoids = [];

    asteroids = asteroids.filter(function (asteroid) {
      if (asteroid.shouldBeDeleted) {
        if (asteroid.radius == largeAsteroidRadius) {
          addPointsToScore(100);
          babyRoids = babyRoids.concat(explodeLargeAsteroid(asteroid.center));
        } else if (asteroid.radius == mediumAsteroidRadius) {
          addPointsToScore(200);
          babyRoids = babyRoids.concat(explodeMediumAsteroid(asteroid.center));
        } else {
          addPointsToScore(200);
        }
      }
      return !asteroid.shouldBeDeleted;
    })
    asteroids = asteroids.concat(babyRoids);
  };

  var addPointsToScore = function (points) {
    if (((that.score % 10000) + points) >= 10000) {
      remainingShips += 1;
    }
    pointsSinceLastAlien += points;
    that.score += points;
  }

  var initAsteroidsImgs = function () {
    var i
      , asteroidSpec
      , imageName
      ;

    for (i = 1; i <= 19; i++) {
      imageName = 'images/asteroid_small/small' + i + '.png';
      smallAsteroidImageArray.push(MYGAME.images[imageName]);
    }

    for (i = 1; i <= 64; i++) {
      imageName = 'images/asteroid_medium/medium' + i + '.png';
      mediumAsteroidImageArray.push(MYGAME.images[imageName]);
    }

    for (i = 1; i <= 60; i++) {
      imageName = 'images/asteroid_large/large' + i + '.png';
      largeAsteroidImageArray.push(MYGAME.images[imageName]);
    }

    // concatting to not reverse the original objects
    reverseSmallAsteroidImageArray = smallAsteroidImageArray.concat([]).reverse();
    reverseMediumAsteroidImageArray = mediumAsteroidImageArray.concat([]).reverse();
    reverseLargeAsteroidImageArray = largeAsteroidImageArray.concat([]).reverse();
  }

  var drawRemainingShips = function () {
    var center = {
      x: 20,
      y: 30
    };
    for (var i = 0; i < remainingShips; i++) {
      center.x += i;

      var spec = {
        image: MYGAME.images['images/klingon_raptor.png'],
        center: center,
        size: {
          width: 20,
          height: 24
        },
        rotation: 0
      };

      MYGAME.graphics.drawImage(spec);
      center.x += 30;
    }
  };

  window.onkeyup = function(event) {
  if (that.gameInProgress && event.keyCode == KeyEvent.DOM_VK_ESCAPE) {
    that.gameInProgress = false;
      that.clearGame();
      MYGAME.screens['game-play'].setHumanPlayer(false);
  }
  };

  var initPlayerShip = function () {
    var shipSpec = {
      image: MYGAME.images['images/klingon_raptor.png'],
      width: 65,
      height: 76,
      acceleration: 10,
      center: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      },
      polyPoints : [
        {
          angle: 0,
          distance: 38
        }, {
          angle: Math.PI / 2,
          distance: 32.5
        }, {
          angle: Math.PI - 0.7156,
          distance: 47
        }, {
          angle: Math.PI + 0.7156,
          distance: 47
        }, {
          angle: Math.PI * 3 / 2,
          distance: 32.5
        }
      ]
    };
    return MYGAME.playerShip(shipSpec, MYGAME.graphics);
  };

  var AIUpdate = function () {

    var closestRoid = closestAsteroid();

    if (closestRoid.asteroid && closestRoid.distance < 50) {
      that.playerShip.hyperJumpKeyPressed();
      //console.log('hyper jump');
      return;
    }

    if (closestRoid.asteroid && closestRoid.distance < 150 && that.playerShip.getShipSpeed() < 3) {

      var targetDirection = Angles.normalizer(angleFromTwoPoints(closestRoid.asteroid.getAsteroidCenter(), that.playerShip.getShipCenter()) - Angles.normalizer(that.playerShip.getShipRotation()));
      if (targetDirection <= (Math.PI / 32)) {
         that.playerShip.shipShouldAccel();
      } else if (targetDirection > Math.PI) {
         that.playerShip.shipShouldTurnLeft();
      } else {
         that.playerShip.shipShouldTurnRight();
       }

      return;
    }

    if (that.playerShip.getShipSpeed() > 1) {
       var targetDirection = Angles.normalizer(Angles.normalizer(that.playerShip.getShipDirection() + Math.PI) - Angles.normalizer(that.playerShip.getShipRotation()));
        if (targetDirection <= (Math.PI / 32)) {
         that.playerShip.shipShouldAccel();
       } else if (targetDirection > Math.PI) {
         that.playerShip.shipShouldTurnLeft();
       } else {
         that.playerShip.shipShouldTurnRight();
       }
     return;
    }

    if (that.playerShip.getShipSpeed() < 0.75) {
      that.playerShip.shipShouldAccel();
    }

    if (that.alienShips.length > 0) {
         var targetDirection = Angles.normalizer((angleFromTwoPoints(that.alienShips[0].getShipCenter(), that.playerShip.getShipCenter()) + (that.alienShips[0].getShipCenter().y > that.playerShip.getShipCenter().y ? Math.PI : 0)) - Angles.normalizer(that.playerShip.getShipRotation()));
        if (targetDirection <= (Math.PI / 32)) {
         that.playerShip.fireLaserKeyPressed();
       } else if (targetDirection > Math.PI) {
         that.playerShip.shipShouldTurnLeft();
       } else {
         that.playerShip.shipShouldTurnRight();
       }
      return;
    }

    if (closestRoid.asteroid) {
        var targetDirection = Angles.normalizer((angleFromTwoPoints(closestRoid.asteroid.getAsteroidCenter(), that.playerShip.getShipCenter()) + (closestRoid.asteroid.getAsteroidCenter().y > that.playerShip.getShipCenter().y ? Math.PI : 0)) - Angles.normalizer(that.playerShip.getShipRotation()));
        if (targetDirection <= (Math.PI / 32)) {
         that.playerShip.fireLaserKeyPressed();
       } else if (targetDirection > Math.PI) {
         that.playerShip.shipShouldTurnLeft();
       } else {
         that.playerShip.shipShouldTurnRight();
       }

      }

};

  var closestAsteroid = function() {
    var shipCenter = that.playerShip.getShipCenter()
      , minAsteroid = null
      , minDistance = null
      ;

    if (asteroids.length > 0) {
      minAsteroid = asteroids[0];
      minDistance = distanceBetweenPoints(shipCenter, asteroids[0].getAsteroidCenter()) - asteroids[0].radius;
    }

    asteroids.forEach(function (asteroid) {
      if (distanceBetweenPoints(shipCenter, asteroid.getAsteroidCenter()) - asteroid.radius < minDistance) {
        minAsteroid = asteroid;
        minDistance = distanceBetweenPoints(shipCenter, asteroid.getAsteroidCenter()) - asteroid.radius;
      }
      });
    return {asteroid: minAsteroid, distance: minDistance};
  };


  return that;
}());