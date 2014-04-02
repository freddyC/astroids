MYGAME.shipexplosion = function() {
  'use strict';

  var explosionPoints = [],
	blueParticles = particleSystem( {
		image : MYGAME.images['images/blue.png'],
		center: {x: 300, y: 300},
		size: {mean: 12, stdev: 3},
		speed: {mean: 300, stdev: 75},
		lifetime: {mean: .6, stdev: .2}
	},
	MYGAME.graphics ),
	redParticles = particleSystem( {
		image : MYGAME.images['images/redstar.png'],
		center: {x: 300, y: 300},
		size: {mean: 9, stdev: 2},
		speed: {mean: 100, stdev: 30},
		lifetime: {mean: .4, stdev: .15}
	},
	MYGAME.graphics )

function explode(point) {
	explosionPoints.push({point: point, timeleft: 0.25});
};

function update(time){
	var elapsedSeconds = time / 1000, i, j, stillAlive = [];
	
	blueParticles.update(elapsedSeconds);
	redParticles.update(elapsedSeconds);
	
	for (i = 0; i < explosionPoints.length; i++) {
		for (j = 0; j < 50; j++) {
			blueParticles.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
		}
		for (j = 0; j < 20; j++) {
			redParticles.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
		}
		explosionPoints[i].timeleft -= elapsedSeconds;
		if(explosionPoints[i].timeleft > 0) {
			stillAlive.push(explosionPoints[i]);
		}
	}
	explosionPoints = stillAlive;
};

function render(){
	blueParticles.render();
	redParticles.render();
};

return {
	explode: explode,
	update: update,
	render: render
};
};