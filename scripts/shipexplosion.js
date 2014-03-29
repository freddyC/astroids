MYGAME.shipexplosion = function() {
  'use strict';

  var explosionPoints = []
    , particleGenerator = particleSystem({
          image : MYGAME.images['images/blue.png'],
          center: {
            x: 300,
            y: 300
          },
          speed: {
            mean: 200,
            stdev: 50
          },
          lifetime: {
            mean: 2,
            stdev: .5
          }
        }, MYGAME.graphics
      )
    ;

  function explode(point) {
    explosionPoints.push({point: point, timeleft: 0.25});
  };

  function update(time) {
    var elapsedSeconds = time / 1000, i, j, stillAlive = [];

    particleGenerator.update(elapsedSeconds);

    for (i = 0; i < explosionPoints.length; i++) {
      for (j = 0; j < 100; j++) {
        particleGenerator.create(JSON.parse(JSON.stringify(explosionPoints[i].point)));
      }
      explosionPoints[i].timeleft -= elapsedSeconds;
      if(explosionPoints[i].timeleft > 0) {
        stillAlive.push(explosionPoints[i]);
      }
    }
    explosionPoints = stillAlive;
  };

  function render() {
    particleGenerator.render();
  };

  return {
    explode: explode,
    update: update,
    render: render
  };
};