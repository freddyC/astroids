MYGAME.asteroidexplosion = function () {
  'use strict';

  var explosionPoints = []
    , rock1 = particleSystem( {
        image : MYGAME.images['images/asteroid_large/large1.png'],
        center: {
          x: 300,
          y: 300
        },
        size: {
          mean: 12,
          stdev: 3
        },
        speed: {
          mean: 300,
          stdev: 70
        },
        lifetime: {
          mean: 0.25,
          stdev: 0.1
        }
      }, MYGAME.graphics
    )
  ;

  var rock2 = particleSystem({
        fade: 0.75,
        image : MYGAME.images['images/asteroid_small/small1.png'],
        center: {
          x: 300,
          y: 300
        },
        size: {
          mean: 9,
          stdev: 2
        },
        speed: {
          mean: 140,
          stdev: 30
        },
        lifetime: {
          mean: 0.2,
          stdev: 0.15
        }
      }, MYGAME.graphics
    )
  ;

  var rock3 = particleSystem({
        image : MYGAME.images['images/asteroid_medium/medium1.png'],
        center: {
          x: 300,
          y: 300
        },
        size: {
          mean: 10,
          stdev: 3
        },
        speed: {
          mean: 200,
          stdev: 40
        },
        lifetime: {
          mean: 0.3,
          stdev: 0.125
        }
      }, MYGAME.graphics
    )
  ;

  function explode(point) {
    explosionPoints.push({point: point, timeleft: 0.125});
  };

  function update(time) {
    var elapsedSeconds = time / 1000, i, j, stillAlive = [];

    rock1.update(elapsedSeconds);
    rock2.update(elapsedSeconds);
    rock3.update(elapsedSeconds);

    for (i = 0; i < explosionPoints.length; i++) {
      for (j = 0; j < 6; j++) {
        rock1.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
      }
      for (j = 0; j < 8; j++) {
        rock2.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
      }
      for (j = 0; j < 10; j++) {
        rock3.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
      }
      explosionPoints[i].timeleft -= elapsedSeconds;
      if(explosionPoints[i].timeleft > 0) {
        stillAlive.push(explosionPoints[i]);
      }
    }
    explosionPoints = stillAlive;
  };

  function render() {
    rock1.render();
    rock2.render();
    rock3.render();
  };

  return {
    explode: explode,
    update: update,
    render: render
  };
};