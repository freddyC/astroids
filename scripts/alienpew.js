MYGAME.alienPew = function(spec, graphics) {
  'use strict';


  var that = {},
    elapsedSeconds = 0,
    pew = {
      image: spec.image,
      size: {
        width : spec.radius * 2,
        height : spec.radius * 2
      },
      radius: spec.radius,
      center: spec.center,
      speed: spec.speed,
      direction: spec.direction,
      rotation: 0,
      lifetime: spec.lifetime
    };

  that.shouldBeDeleted = false;

  that.getPewCircle = function() {
    var circle = {
           point: JSON.parse(JSON.stringify(pew.center)),
           radius: pew.radius
        };
    
    return circle;
  };

  that.getPewCenter = function() {
	  return JSON.parse(JSON.stringify(pew.center));
  };

  that.update = function(elapsedTime) {
    elapsedSeconds += elapsedTime / 1000;
    if (elapsedSeconds >= pew.lifetime) {
      that.shouldBeDeleted = true;
    } else {
      pew.center.x += Math.sin(pew.direction) * pew.speed * elapsedTime / 1000;
      pew.center.y -= Math.cos(pew.direction) * pew.speed * elapsedTime / 1000;
      if (pew.center.y - pew.size.height / 2 >= window.innerHeight) {
        pew.center.y = -pew.size.height / 2;
      } else if (pew.center.y + pew.size.height / 2 <= 0) {
        pew.center.y = window.innerHeight + pew.size.height / 2;
      }

      if (pew.center.x - pew.size.width / 2 >= window.innerWidth) {
        pew.center.x = -pew.size.width / 2;
      } else if (pew.center.x + pew.size.width / 2 <= 0) {
        pew.center.x = window.innerWidth + pew.size.width / 2;
      }
    }
  };

  that.render = function() {
    graphics.drawImage(pew);
  };

  return that;
};