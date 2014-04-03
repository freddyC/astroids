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
    that.shipExploder.render();
    that.asteroidExploder.render();
    renderLasers();
    renderAsteroids();
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
    // Chances for astroid types:
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

  var explodeLargeAsteroid = function (originalAsterioid) {
    // TODO
      // Get Center 
      // explode from center
      // create 3 new medium asteroids from the center
        // use createMediumAsteroid and send in center
      // remove the original asteroid from astroid arr
  }

  var explodeMediumAsteroid = function (originalAsterioid) {
    // TODO
      // Get Center 
      // explode from center
      // create 4 new small asteroids from the center
        // use createSmallAsteroid and send in center
      // remove the original asteroid from astroid arr
  }

  var explodeSmallAsteroid = function (originalAsterioid) {
    // TODO
      // explode from center
      // remove the original asteroid from astroid arr
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

  var updateAsteroidCollision = function (elapsedTime) {
    // TODO:
      // Check each asteroid to each laser
      // if laser hits asteroid blow it up
	  var i, j, poly;
	  for (i = 0; i < that.lasers.length; i++) {
		  poly = that.lasers[i].getLaserRect();
		  for (j = 0; j < largeAsteroids.length; j++) {
			  if (!that.lasers[i].shouldBeDeleted && isPolygonInCircle(poly, {point: largeAsteroids[i].center, radius: largeAsteroids[i].radius})) {
				  that.lasers[i].shouldBeDeleted = true;
				  // delete the asteroid here
				  that.shipExploder.explode(largeAsteroids[i].getAsteroidCenter());
			  }
		  }
		  for (j = 0; j < mediumAsteroids.length; j++) {
			  if (!that.lasers[i].shouldBeDeleted && isPolygonInCircle(poly, {point: mediumAsteroids[i].center, radius: mediumAsteroids[i].radius})) {
				  that.lasers[i].shouldBeDeleted = true;
				  // delete the asteroid here
				  that.shipExploder.explode(mediumAsteroids[i].getAsteroidCenter());
			  }
		  }
		  for (j = 0; j < smallAsteroids.length; j++) {
			  if (!that.lasers[i].shouldBeDeleted && isPolygonInCircle(poly, {point: smallAsteroids[i].center, radius: smallAsteroids[i].radius})) {
				  that.lasers[i].shouldBeDeleted = true;
				  // delete the asteroid here
				  that.shipExploder.explode(smallAsteroids[i].getAsteroidCenter());
			  }
		  }
	  }
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