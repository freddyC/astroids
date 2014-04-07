var MYGAME = {
  images : {},
  screens : {},
  keys: {},

  status : {
    preloadRequest : 0,
    preloadComplete : 0
  }
};

//------------------------------------------------------------------
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//------------------------------------------------------------------
window.addEventListener('load', function() {
  console.log('Loading resources...');
  var i, load;
  load = [
        'preload!scripts/random.js',
        'preload!scripts/utils.js',
        'preload!scripts/collision.js',
        'preload!scripts/particle-system.js',
      'preload!scripts/renderer.js',
      'preload!scripts/playership.js',
      'preload!scripts/playershipengine.js',
      'preload!scripts/hyperParticles.js',
      'preload!scripts/shipexplosion.js',
      'preload!scripts/asteroidexplosion.js',
      'preload!scripts/asteroid.js',
      'preload!scripts/laser.js',
      'preload!scripts/hyper-drive.js',
      'preload!scripts/input.js',
      'preload!scripts/game.js',
      'preload!scripts/mainmenu.js',
      'preload!scripts/gamecontroller.js',
      'preload!scripts/gameplay.js',
      'preload!scripts/configurecontrols.js',
      'preload!scripts/highscores.js',
      'preload!scripts/score-save.js',
      'preload!scripts/help.js',
      'preload!scripts/about.js',
      'preload!scripts/alienship.js',
      'preload!scripts/alienpew.js',
      'preload!images/ship.png',
      'preload!images/enterprise.png',
      'preload!images/blue.png',
      'preload!images/pew.png',
      'preload!images/klingon_raptor.png',
      'preload!images/yellowstar.png',
      'preload!images/whitestar.png',
      'preload!images/redstar.png',
      'preload!images/blueblow.png',
      'preload!images/greencircle.png',
      'preload!images/ufo1.png',
      'preload!images/ufo2.png'
    ];

  for (i = 1; i <= 19; i++) {
    load.push('preload!images/asteroid_small/small' + i + '.png');
  }

  for (i = 1; i <= 64; i++) {
    load.push('preload!images/asteroid_medium/medium' + i + '.png');
  }

  for (i = 1; i <= 60; i++) {
    load.push('preload!images/asteroid_large/large' + i + '.png');
  }

  Modernizr.load([
    {
      load : load,
      complete : function() {
        console.log('All files requested for loading...');
      }
    }
  ]);
}, false);

//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {

  MYGAME.status.preloadRequest += 1;
  var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
  resource.noexec = isImage;
  resource.autoCallback = function(e) {
    if (isImage) {
      var image = new Image();
      image.src = resource.url;
      MYGAME.images[resource.url] = image;
    }
    MYGAME.status.preloadComplete += 1;

    // When everything has finished preloading, go ahead and start the game
    if (MYGAME.status.preloadComplete === MYGAME.status.preloadRequest) {
      console.log('Preloading complete!');
      MYGAME.game.initialize();
    }
  };

  return resource;
});
