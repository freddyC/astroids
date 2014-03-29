MYGAME.laser = function(spec, graphics) {
  'use strict';

  var that = {}
    , elapsedSeconds = 0
    , speed : spec.speed
    , direction : spec.direction
    , rotation : spec.direction
    , lifetime : spec.lifetime
    , laser = {
        image : spec.image,
        size : {
          width : spec.size.width,
          height : spec.size.height
        },
        center : {
          x : spec.center.x,
          y : spec.center.y
        },
      }
    ;

  that.shouldBeDeleted = false;

  that.getLaserRect = function() {

  };


  that.update = function(elapsedTime) {
    elapsedSeconds += elapsedTime / 1000;
    if (elapsedSeconds >= laser.lifetime) {
      that.shouldBeDeleted = true;
    } else {
      laser.center.x += Math.sin(laser.direction) * laser.speed * elapsedTime / 1000;
      laser.center.y -= Math.cos(laser.direction) * laser.speed * elapsedTime / 1000;
      if (laser.center.y - laser.size.height / 2 >= window.innerHeight) {
        laser.center.y = -laser.size.height / 2;
      } else if (laser.center.y + laser.size.height / 2 <= 0) {
        laser.center.y = window.innerHeight + laser.size.height / 2;
      }

      if (laser.center.x - laser.size.width / 2 >= window.innerWidth) {
        laser.center.x = -laser.size.width / 2;
      } else if (laser.center.x + laser.size.width / 2 <= 0) {
        laser.center.x = window.innerWidth + laser.size.width / 2;
      }
    }
  };

  that.render = function() {
    graphics.drawImage(laser);
  };

  return that;
};