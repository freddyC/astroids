MYGAME.shipexplosion = function () {
  'use strict';

  var explosionMaker = MYGAME.shipParticles(MYGAME.graphics);
  
  var explosionPoints = []
    , rockImage = MYGAME.images['images/asteroid_small/small1.png']
  ;

  function explode(point) {
    explosionPoints.push({point: point, timeleft: 0.3});
    
    var i;
    for (i = 0; i < 50; i++) {
      var spec = {
  		    image: rockImage,
  		    size: { mean: 12, stdev: 4 },
  		    speed: { mean: 500, stdev: 200 },
  		    lifetime: { mean: .5, stdev: .25},
  		    center: JSON.parse(JSON.stringify(point))
  	      };
      explosionMaker.create(spec);
    }
  };

  function update(time) {
    var elapsedSeconds = time / 1000, stillAlive = [];

    explosionMaker.update(elapsedSeconds);
    
    explosionPoints.forEach(function (point) {
    	
    	explosionMaker.createSmoke(point.point);
    	
    	point.timeleft -= elapsedSeconds;
    	if (point.timeleft > 0) {
    		stillAlive.push(point);
    	}
    });

    explosionPoints = stillAlive;
  };

  function render() {
	explosionMaker.render();
  };

  return {
    explode: explode,
    update: update,
    render: render
  };
};