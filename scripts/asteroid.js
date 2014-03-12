MYGAME.asteroid = function(spec, graphics) {
	'use strict';
	
	//console.log(spec.imageArray);
	
	var that = {},
		elapsedSeconds = 0,
		asteroid = { image: spec.imageArray[0],
				 	 size: {width: spec.size.width, height: spec.size.height},
				 	 center: {x: spec.center.x, y: spec.center.y},
				 	 speed: spec.speed,
				 	 direction: Math.random()*2*Math.PI,
				 	 rotation: Math.random()*2*Math.PI
				 	};
		
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
	
	that.render = function() {
		graphics.drawImage(asteroid);
	};
	
	return that;
};