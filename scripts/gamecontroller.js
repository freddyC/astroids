// 0.7155849933187

MYGAME.gameController = (function() {
	'use strict';
	var that = {
    playerShip: null,
    shipExploder: null,
    lasers: null
  }
    , mediumAsteroids
    , largeAsteroids
    , backgroundSnd
    , soundSecondsPlayed
    , timeSinceLastCollision
    ;
  
  that.startNewGame = function () {
    backgroundSnd = new Audio('sounds/background.mp3');
    soundSecondsPlayed = 0;
    timeSinceLastCollision = 100;
    mediumAsteroids = [];
    largeAsteroids = [];

    initAstroids();
    backgroundSnd.play();
    that.lasers = [];
    that.shipExploder = MYGAME.shipexplosion();
    that.playerShip = initPlayerShip();
  };

  that.updateSound = function (elapsedSeconds) {
    elapsedSeconds /= 1000;
    soundSecondsPlayed += elapsedSeconds;
    if (soundSecondsPlayed >= 70) {
      soundSecondsPlayed = 0;
      backgroundSnd.pause();
      backgroundSnd.currentTime = 0;
      backgroundSnd.play();
    } 
  };

  that.updateAsteroids = function () {
    var i;
    for (i = 0; i < mediumAsteroids.length; i++) {
      mediumAsteroids[i].update(MYGAME.elapsedTime);
      mediumAsteroids[i].render();
    }

    for (i = 0; i < largeAsteroids.length; i++) {
      largeAsteroids[i].update(MYGAME.elapsedTime);
      largeAsteroids[i].render();
    }
  };

  that.updateLaser = function () {
    for (var i = 0; i < that.lasers.length; i++) {
      that.lasers[i].update(MYGAME.elapsedTime);
      that.lasers[i].render();
    }
  };

  that.updateShip = function () {
    var shipPoly = that.playerShip.getShipPolygon();

    timeSinceLastCollision += MYGAME.elapsedTime/1000;

    for (i = 0; i < mediumAsteroids.length; i++) {
      if (isPolygonInCircle(shipPoly, {point: mediumAsteroids[i].center, radius: mediumAsteroids[i].radius})) {
        if (timeSinceLastCollision >= 2) {
          timeSinceLastCollision = 0;
          that.shipExploder.explode(that.playerShip.getShipCenter());
        }
      }
    }

    for (i = 0; i < largeAsteroids.length; i++) {
      if (isPolygonInCircle(shipPoly, {point: largeAsteroids[i].center, radius: largeAsteroids[i].radius})) {
        if (timeSinceLastCollision >= 2) {
          timeSinceLastCollision = 0;
          that.shipExploder.explode(that.playerShip.getShipCenter());
        }
      }
    }

  };

  var initAstroids = function () {
    var i
      , asteroidSpec
      , mediumAsteroidImageArray = []
      , largeAsteroidImageArray = []
      , imageName
      ;

    for (i = 1; i <= 64; i++) {
      imageName = 'images/asteroid_medium/medium' + i + '.png';
      mediumAsteroidImageArray.push(MYGAME.images[imageName]);
    }

    for (i = 0; i < 8; i++) {
      asteroidSpec = {
        imageArray: mediumAsteroidImageArray,
        size: { 
          width: 52,
          height: 52
        },
        radius: 21,
        center: {
          x: Random.nextRange(0, window.innerWidth),
          y: Random.nextRange(0, window.innerHeight)
        },
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
      asteroidSpec = {
        imageArray: largeAsteroidImageArray,
        size: {
          width: 110,
          height: 110
        },
        radius: 55,
        center: {
          x: Random.nextRange(0, window.innerWidth),
          y: Random.nextRange(0, window.innerHeight)
        },
        speed: Random.nextRange(100, 300),
        secondsToCycle: (Math.random() + 1)
      };

      largeAsteroids.push(MYGAME.asteroid(asteroidSpec, MYGAME.graphics));
    }
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