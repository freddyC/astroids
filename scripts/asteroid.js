MYGAME.asteroid = function(spec, graphics) {
  'use strict';

  var that = {}
    , elapsedSeconds = 0
    , asteroid = {
        image: spec.imageArray[0],
        speed: spec.speed,
        direction: Math.random()*2*Math.PI,
        rotation: Math.random()*2*Math.PI,
        radius: spec.radius,
        size: {
          width: spec.size.width,
          height: spec.size.height
        },
        center: {
          x: spec.center.x,
          y: spec.center.y
        },
        futureCenter: {}
      }
    ;

  that.mass = spec.mass;
  that.recentlyCollided = false;
  
  that.update = function(elapsedTime) {
    elapsedSeconds = (elapsedSeconds + ((elapsedTime / 1000) / spec.secondsToCycle)) % spec.secondsToCycle;

    var index = Math.round((elapsedSeconds / spec.secondsToCycle) * (spec.imageArray.length - 1));
    if (index < 0) {
      index = 0;
    } else if (index > (spec.imageArray.length - 1)) {
      index = (spec.imageArray.length - 1);
    }

    asteroid.image = spec.imageArray[index];

    asteroid.center.x += Math.sin(asteroid.direction) * asteroid.speed * elapsedTime / 1000;
    asteroid.center.y -= Math.cos(asteroid.direction) * asteroid.speed * elapsedTime / 1000;

    asteroid.futureCenter.x += Math.sin(asteroid.direction) * asteroid.speed * elapsedTime * 2 / 1000;
    asteroid.futureCenter.y -= Math.cos(asteroid.direction) * asteroid.speed * elapsedTime * 2 / 1000;


    if (asteroid.center.y - asteroid.size.height/2 >= window.innerHeight) {
      asteroid.center.y =  -asteroid.size.height/2;
    } else if (asteroid.center.y + asteroid.size.height/2 <= 0) {
      asteroid.center.y = window.innerHeight + asteroid.size.height/2;
    }

    if (asteroid.center.x - asteroid.size.width/2 >= window.innerWidth) {
      asteroid.center.x =  -asteroid.size.width/2;
    } else if (asteroid.center.x + asteroid.size.width/2 <= 0) {
      asteroid.center.x = window.innerWidth + asteroid.size.width/2;
    }
  };

  that.center = asteroid.center;
  that.radius = asteroid.radius;
  that.getAsteroidCenter = function() {
    return JSON.parse(JSON.stringify(asteroid.center));
  };
  
  that.getCenter = function() {
	  if(!asteroid.center.x || !asteroid.center.y) {
		  debugger;
	  }
	    return JSON.parse(JSON.stringify(asteroid.center));
	  };
  
  that.getAsteroidCircle = function() {
	  return {
		  point: JSON.parse(JSON.stringify(asteroid.center)),
		  radius: asteroid.radius
	  };
  };
  
  that.setNewVector = function(v) {
	  asteroid.direction = v.direction;
	  asteroid.speed = v.magnitude;
  };
  
  that.setDirection = function(angle) {
	  asteroid.direction = angle;
  };
  
  that.setSpeed = function(speed) {
	  asteroid.speed = speed;
  };
  
  that.getSpeed = function(speed) {
	 return JSON.parse(JSON.stringify(asteroid.speed));
  };
  
  that.nudgeUp = function() {
	  asteroid.center.y -= 1;
  };
  
  that.nudgeDown = function() {
	  asteroid.center.y += 1;
  };
  
  that.nudgeRight = function() {
	  asteroid.center.x += 1;
  };
  
  that.nudgeLeft = function() {
	  asteroid.center.x -= 1;
  };
  
  that.getAsteroidVector = function() {
	  return JSON.parse(JSON.stringify({direction: asteroid.direction, point: asteroid.center}));
  };
  
  that.getAsteroidFuture = function () {
    return JSON.parse(JSON.stringify(asteroid.futureCenter));
  };
  
  that.getComponentVector = function() {
	  var vector = {
		    magnitude: asteroid.speed,
		    angle: asteroid.direction
	  };
	  return componentVector(vector);
  };

  that.render = function() {
    graphics.drawImage(asteroid);
  };

  return that;
};