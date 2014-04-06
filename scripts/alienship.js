MYGAME.alienShip = function(spec, graphics) {
  'use strict';
					
  var that = {}
    , secondsToNextFire = Random.nextGaussian(spec.shotFreqency.mean, spec.shotFreqency.stdDev)
    , secondsSinceLastFire = 0
    , ship = {
        image: spec.image,
        direction: spec.direction,
        rotation: spec.rotation,
        speed: spec.speed,
        collisionCircles: spec.collisionCircles,
        size: spec.size,
        center: spec.center,
        shotAccuracy : spec.shotAccuracy
      }
    , originalCenter = JSON.parse(JSON.stringify(spec.center))
   ;
  
  that.shouldBeDeleted = false;
  
  var pewHandler = function(elapsedTime) {
	  secondsSinceLastFire += (elapsedTime / 1000);
    if (secondsSinceLastFire >= secondsToNextFire) {
    	secondsSinceLastFire = 0;
    	secondsToNextFire = Random.nextGaussian(spec.shotFreqency.mean, spec.shotFreqency.stdDev);
    	
    	var angleToPlayerShip;
    	if(ship.center.y > MYGAME.gameController.playerShip.getShipCenter().y) {
    		angleToPlayerShip = angleFromTwoPoints(ship.center, MYGAME.gameController.playerShip.getShipCenter());
    	} else {
    		angleToPlayerShip = angleFromTwoPoints(ship.center, MYGAME.gameController.playerShip.getShipCenter()) + Math.PI;
    	}
    	
    	angleToPlayerShip += (Math.random() * ship.shotAccuracy) - (ship.shotAccuracy / 2);
    	
    	var shotSpec = {
    			image: MYGAME.images['images/greencircle.png'],
    			radius: 5,
    			center: that.getShipCenter(),
    			speed: 300,
    			direction: angleToPlayerShip,
    			lifetime: 1
    	};
    	
    	MYGAME.gameController.alienLasers.push(MYGAME.alienPew(shotSpec, graphics));

    }
  };

  var moveShip = function(elapsedTime) {
    var elapsedSeconds = elapsedTime / 1000;
    ship.center.x += Math.sin(ship.direction) * ship.speed * elapsedSeconds;
    ship.center.y = originalCenter.y + (Math.cos(ship.center.x / 20) * 30);
    if (ship.center.x <= ship.size.width / 2 || ship.center.x + ship.size.width / 2 > window.innerWidth) {
    	ship.direction += Math.PI;
    }
  };
  
  that.getShipCenter = function () {
    return JSON.parse(JSON.stringify(ship.center));
  };

  that.getShipCollisionCircles = function() {
    var circles = [], i, x, y;
    for(i = 0; i < ship.collisionCircles.length;i++ ) {
      x = ship.center.x + Math.sin(ship.rotation + ship.collisionCircles[i].angle) * ship.collisionCircles[i].distance;
      y = ship.center.y + Math.cos(ship.rotation + ship.collisionCircles[i].angle) * ship.collisionCircles[i].distance;
      circles.push({point:{x:x,y:y},radius:ship.collisionCircles[i].radius});
    }
    return circles;
  };

  that.update = function(elapsedTime) {
    moveShip(elapsedTime);
    pewHandler(elapsedTime);
  };

  that.render = function() {
    graphics.drawImage(ship);
  };
  
  return that;
};