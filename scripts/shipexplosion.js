MYGAME.shipexplosion = function() {
  'use strict';

  var explosionPoints = []
    , yellowParticles = particleSystem( {
        image : MYGAME.images['images/yellowstar.png'],
        center: {
          x: 300,
          y: 300
        },
        size: {
          mean: 12,
          stdev: 3
        },
        speed: {
          mean: 600,
          stdev: 150
        },
        lifetime: {
          mean: 0.3,
          stdev: 0.1
        }
      }, MYGAME.graphics
    )
  ;

  var redParticles = particleSystem( {
        fade: 0.75,
        image : MYGAME.images['images/redstar.png'],
        center: {
          x: 300,
          y: 300
        },
        size: {
          mean: 9,
          stdev: 2
        },
        speed: {
          mean: 100,
          stdev: 30
        },
        lifetime: {
          mean: 0.3,
          stdev: 0.15
        }
      }, MYGAME.graphics
    )
  ;

  var blueParticles = particleSystem( {
        image : MYGAME.images['images/blueblow.png'],
        center: {
          x: 300,
          y: 300
        },
        size: {
          mean: 10,
          stdev: 2
        },
        speed: {
          mean: 250,
          stdev: 40
        },
        lifetime: {
          mean: 0.3,
          stdev: 0.15
        }
      }, MYGAME.graphics
    )
  ;

function explode(point) {
  explosionPoints.push({point: point, timeleft: 0.25});
};

function update(time){
  var elapsedSeconds = time / 1000, i, j, stillAlive = [];

  yellowParticles.update(elapsedSeconds);
  blueParticles.update(elapsedSeconds);
  redParticles.update(elapsedSeconds);

  for (i = 0; i < explosionPoints.length; i++) {
   for (j = 0; j < 25; j++) {
     yellowParticles.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
   }
   for (j = 0; j < 10; j++) {
     redParticles.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
   }
   for (j = 0; j < 15; j++) {
     blueParticles.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
   }
   explosionPoints[i].timeleft -= elapsedSeconds;
   if(explosionPoints[i].timeleft > 0) {
     stillAlive.push(explosionPoints[i]);
   }
  }
  explosionPoints = stillAlive;
};

function render(){
  yellowParticles.render();
  blueParticles.render();
  redParticles.render();
};

return {
  explode: explode,
  update: update,
  render: render
};
};