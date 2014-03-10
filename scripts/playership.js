MYGAME.playerShip = function(spec, graphics) {
	'use strict';
	
	var that = {},
		ship = { image: spec.image,
				 size: {width: spec.width, height: spec.height},
				 center: {x: spec.center.x, y: spec.center.y},
				 acceleration: spec.acceleration,
				 direction: 0,
				 speed: 0,
				 rotation: 0 };

	
	that.update = function(elapsedTime) {
		// Update ship code here
	};
	
	that.render = function() {
		graphics.drawImage(ship);
	};
	
	return that;
};