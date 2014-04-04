// 0.7155849933187

MYGAME.gameController = (function() {
  'use strict';
  var smallAsteroids
    , mediumAsteroids
    , largeAsteroids
    , backgroundSnd
    , soundSecondsPlayed
    , timeSinceLastCollision
    , timeSinceLastAddedAsteroid
    , smallAsteroidImageArray
    , reverseSmallAsteroidImageArray
    , mediumAsteroidImageArray
    , reverseMediumAsteroidImageArray
    , largeAsteroidImageArray
    , reverseLargeAsteroidImageArray
    , that = {
        playerShip: null,
        shipExploder: null,
        lasers: null,
        asteroidExploder: null
      }
    ;

  that.startNewGame = function () {
    backgroundSnd = new Audio('sounds/background.mp3');
    soundSecondsPlayed = 0;
    timeSinceLastCollision = 100;
    timeSinceLastAddedAsteroid = 5000;
    smallAsteroids = [];
    mediumAsteroids = [];
    largeAsteroids = [];
    smallAsteroidImageArray = [];
    mediumAsteroidImageArray = [];
    largeAsteroidImageArray = [];
    reverseSmallAsteroidImageArray = [];
    reverseMediumAsteroidImageArray = [];
    reverseLargeAsteroidImageArray = [];

    initAsteroids();
    backgroundSnd.play();
    that.lasers = [];
    that.shipExploder = MYGAME.shipexplosion();
    that.asteroidExploder = MYGAME.asteroidexplosion();
    that.playerShip = initPlayerShip();
  };

  that.update = function (elapsedTime) {
    that.playerShip.update(elapsedTime);
    that.shipExploder.update(elapsedTime);
    that.asteroidExploder.update(elapsedTime);

    addAsteroid(elapsedTime);
    updateSound(elapsedTime);
    updateAsteroids(elapsedTime);
    updateLasers(elapsedTime);
    updateShipCollision(elapsedTime);
    updateAsteroidCollision(elapsedTime);
  }

  that.render = function () {
    that.playerShip.render();
    renderLasers();
    renderAsteroids();
    that.asteroidExploder.render();
    that.shipExploder.render();
  }

  var updateSound = function (elapsedSeconds) {
    elapsedSeconds /= 1000;
    soundSecondsPlayed += elapsedSeconds;
    if (soundSecondsPlayed >= 70) {
      soundSecondsPlayed = 0;
      backgroundSnd.pause();
      backgroundSnd.currentTime = 0;
      backgroundSnd.play();
    }
  };

  var addAsteroid = function (elapsedTime) {
    timeSinceLastAddedAsteroid += elapsedTime;
    var timeInterval = 5000; // TODO: make a function for this to get harder as game goes on
    if (timeSinceLastAddedAsteroid < timeInterval) return;
    var type = Math.random();
    // Chances for asteroid types:
      // 50% large
      // 30% medium
      // 20% small
    if (type > 0.5) {
      createLargeAsteroid();
    } else if (type > 0.2) {
      createMediumAsteroid();
    } else {
      createSmallAsteroid();
    }
  }

  var createLargeAsteroid = function (center) {
    var fromTop = (Math.random() < 0.5)
      , reverse = (Math.random() < 0.5)
      ;

    if (!center) {
      center = {
        x: (fromTop) ? Random.nextRange(0, window.innerWidth) : 0 - 65,
        y: (fromTop) ? 0 - 65: Random.nextRange(0, window.innerHeight)
      };
    }

    var asteroidSpec = {
      imageArray: (reverse) ? reverseLargeAsteroidImageArray : largeAsteroidImageArray,
      size: {
        width: 130,
        height: 130
      },
      radius: 66,
      center: center,
      speed: Random.nextRange(75, 200),
      secondsToCycle: (Math.random() + 1)
    };

    largeAsteroids.push(MYGAME.asteroid(asteroidSpec, MYGAME.graphics));
    timeSinceLastAddedAsteroid = 0;
  }

  var createMediumAsteroid = function (center) {
    var fromTop = (Math.random() < 0.5)
      , reverse = (Math.random() < 0.5)
      ;

    if (!center) {
      center = {
        x: (fromTop) ? Random.nextRange(0, window.innerWidth) : 0 - 29,
        y: (fromTop) ? 0 - 29: Random.nextRange(0, window.innerHeight)
      };
    }

    var asteroidSpec = {
      imageArray: (reverse) ? reverseMediumAsteroidImageArray : mediumAsteroidImageArray,
      size: {
        width: 60,
        height: 60
      },
      radius: 30,
      center: center,
      speed: Random.nextRange(100, 300),
      secondsToCycle: (Math.random() + 0.75)
    };

    mediumAsteroids.push(MYGAME.asteroid(asteroidSpec, MYGAME.graphics));
    timeSinceLastAddedAsteroid = 0;
  }

  var createSmallAsteroid = function (center) {
    var fromTop = (Math.random() < 0.5)
      , reverse = (Math.random() < 0.5)
      ;

    if (!center) {
      center = {
        x: (fromTop) ? Random.nextRange(0, window.innerWidth) : 0 - 14,
        y: (fromTop) ? 0 - 14: Random.nextRange(0, window.innerHeight)
      };
    }

    var asteroidSpec = {
      imageArray: (reverse) ? reverseSmallAsteroidImageArray : smallAsteroidImageArray,
      size: {
        width: 30,
        height: 30
      },
      radius: 15,
      center: center,
      speed: Random.nextRange(200, 375),
      secondsToCycle: (Math.random() + 0.25)
    };

    smallAsteroids.push(MYGAME.asteroid(asteroidSpec, MYGAME.graphics));
    timeSinceLastAddedAsteroid = 0;
  }

  var explodeLargeAsteroid = function (center) {
    createMediumAsteroid(center);
    createMediumAsteroid(center);
    createMediumAsteroid(center);
  }

  var explodeMediumAsteroid = function (center) {
    createSmallAsteroid(center);
    createSmallAsteroid(center);
    createSmallAsteroid(center);
    createSmallAsteroid(center);
  }

  var updateAsteroids = function (elapsedTime) {
    var i;
    for (i = 0; i < smallAsteroids.length; i++) {
      smallAsteroids[i].update(elapsedTime);
    }

    for (i = 0; i < mediumAsteroids.length; i++) {
      mediumAsteroids[i].update(elapsedTime);
    }

    for (i = 0; i < largeAsteroids.length; i++) {
      largeAsteroids[i].update(elapsedTime);
    }
  };

  var renderAsteroids = function () {
    var i;
    for (i = 0; i < smallAsteroids.length; i++) {
      smallAsteroids[i].render();
    }

    for (i = 0; i < mediumAsteroids.length; i++) {
      mediumAsteroids[i].render();
    }

    for (i = 0; i < largeAsteroids.length; i++) {
      largeAsteroids[i].render();
    }
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

  var updateShipCollision = function (elapsedTime) {
    var shipPoly = that.playerShip.getShipPolygon();

    timeSinceLastCollision += elapsedTime/1000;

    for (var i = 0; i < smallAsteroids.length; i++) {
      if (isPolygonInCircle(shipPoly, {point: smallAsteroids[i].center, radius: smallAsteroids[i].radius})) {
        if (timeSinceLastCollision >= 2) {
          timeSinceLastCollision = 0;
          that.shipExploder.explode(that.playerShip.getShipCenter());
        }
      }
    }

    for (var i = 0; i < mediumAsteroids.length; i++) {
      if (isPolygonInCircle(shipPoly, {point: mediumAsteroids[i].center, radius: mediumAsteroids[i].radius})) {
        if (timeSinceLastCollision >= 2) {
          timeSinceLastCollision = 0;
          that.shipExploder.explode(that.playerShip.getShipCenter());
        }
      }
    }

    for (var i = 0; i < largeAsteroids.length; i++) {
      if (isPolygonInCircle(shipPoly, {point: largeAsteroids[i].center, radius: largeAsteroids[i].radius})) {
        if (timeSinceLastCollision >= 2) {
          timeSinceLastCollision = 0;
          that.shipExploder.explode(that.playerShip.getShipCenter());
        }
      }
    }
  };

  function checkAstroidLaserCollision (laser, poly, asteroid) {
    var obj = {
      point: asteroid.center,
      radius: asteroid.radius
    };
    if (!laser.shouldBeDeleted && isPolygonInCircle(poly, obj)) {
      laser.shouldBeDeleted = true;
      asteroid.shouldBeDeleted = true;
      that.asteroidExploder.explode(asteroid.getAsteroidCenter());
    }
  }

  var updateAsteroidCollision = function (elapsedTime) {
      that.lasers.forEach(function (laser) {
        var poly = laser.getLaserRect();
        largeAsteroids.forEach(function (asteroid) {
          checkAstroidLaserCollision(laser, poly, asteroid);
        })

        mediumAsteroids.forEach(function (asteroid) {
          checkAstroidLaserCollision(laser, poly, asteroid);
        })

        smallAsteroids.forEach(function (asteroid) {
          checkAstroidLaserCollision(laser, poly, asteroid);
        })
      })

      that.lasers = that.lasers.filter(function (laser) {
        return !laser.shouldBeDeleted;
      })

      largeAsteroids = largeAsteroids.filter(function (asteroid) {
        if (asteroid.shouldBeDeleted) {
          explodeLargeAsteroid(asteroid.center);
        }
        return !asteroid.shouldBeDeleted;
      })

      mediumAsteroids = mediumAsteroids.filter(function (asteroid) {
        if (asteroid.shouldBeDeleted) {
          explodeMediumAsteroid(asteroid.center);
        }
        return !asteroid.shouldBeDeleted;
      })

      smallAsteroids = smallAsteroids.filter(function (asteroid) {
        return !asteroid.shouldBeDeleted;
      })
  };

  var initAsteroids = function () {
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

    // concatting to not reverse the old objects
    reverseSmallAsteroidImageArray = smallAsteroidImageArray.concat([]).reverse();
    reverseMediumAsteroidImageArray = mediumAsteroidImageArray.concat([]).reverse();
    reverseLargeAsteroidImageArray = largeAsteroidImageArray.concat([]).reverse();
  }



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
  }

  return that;
}());