// 0.7155849933187

MYGAME.gameController = (function() {
  'use strict';

  var asteroids
    , largeAsteroidRadius
    , mediumAsteroidRadius
    , smallAsteroidRadius
    , backgroundSnd
    , soundSecondsPlayed
    , timeSinceShipWasDestroyed
    , smallAsteroidImageArray
    , reverseSmallAsteroidImageArray
    , mediumAsteroidImageArray
    , reverseMediumAsteroidImageArray
    , largeAsteroidImageArray
    , reverseLargeAsteroidImageArray
    , remainingShips
    , that = {
        asteroids: null,
        wave: 0,
        playerShip: null,
        playerShipIsInvincible: null,
        playerShipShouldAppear: null,
        shipExploder: null,
        lasers: null,
        asteroidExploder: null,
        gameInProgress: null,
        score: 0
      }
    ;

  function clearGame () {
    backgroundSnd.pause();
    timeSinceShipWasDestroyed = 0;
    asteroids = [];
    that.lasers = [];
    that.playerShip = initPlayerShip();
    that.wave = 0;
  }

  that.init = function () {
    backgroundSnd = new Audio('sounds/background.mp3');
    backgroundSnd.volume = 0.5;
    smallAsteroidImageArray = [];
    mediumAsteroidImageArray = [];
    largeAsteroidImageArray = [];
    reverseSmallAsteroidImageArray = [];
    reverseMediumAsteroidImageArray = [];
    reverseLargeAsteroidImageArray = [];
    initAsteroidsImgs();
    that.shipExploder = MYGAME.shipexplosion();
    that.asteroidExploder = MYGAME.asteroidexplosion();
    that.playerShip = initPlayerShip();
  }

  that.run = function () {
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
    if (remainingShips < 0) {
      that.gameInProgress = false;
      clearGame();
      return;
    }
    if (asteroids.length == 0) {
      addAsteroid();
    }

    that.playerShip.update(elapsedTime);
    that.shipExploder.update(elapsedTime);
    that.asteroidExploder.update(elapsedTime);
    updateDestroyedShip(elapsedTime);
    updateSound(elapsedTime);
    updateAsteroids(elapsedTime);
    updateLasers(elapsedTime);
    updateShipCollision(elapsedTime);
    updateAsteroidCollision(elapsedTime);
  };

  that.render = function () {
    that.playerShip.render();
    renderLasers();
    that.asteroidExploder.render();
    renderAsteroids();
    that.shipExploder.render();
    drawRemainingShips();
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

  var updateSound = function (elapsedSeconds) {
    elapsedSeconds /= 1000;
    soundSecondsPlayed += elapsedSeconds;
    if (soundSecondsPlayed >= 74) {
      soundSecondsPlayed = 0;
      backgroundSnd.pause();
      backgroundSnd.currentTime = 0;
      backgroundSnd.play();
    }
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
      secondsToCycle: (Math.random() + 1)
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
      secondsToCycle: (Math.random() + 0.8)
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
      secondsToCycle: (Math.random() + 0.25)
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
    var shipBoomSound = new Audio('sounds/bang.mp3');
    shipBoomSound.volume = 0.6;
    shipBoomSound.play();
  };

  var updateShipCollision = function (elapsedTime) {
    if (that.playerShipIsInvincible) {
      return;
    }
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
    })
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
      var asteroidBoomSound = new Audio('sounds/asteroid-bang.mp3');
      asteroidBoomSound.volume = 0.8;
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
    if (((that.score % 10000) + points) > 10000) {
      remainingShips += 1;
    }
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
      y: 22
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