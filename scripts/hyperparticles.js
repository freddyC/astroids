/*jslint browser: true, white: true, plusplus: true */
/*global Random */
MYGAME.hyperParticles = function (spec, graphics) {
  'use strict';
  var that = {}
    , nextName = 1    // unique identifier for the next particle
    , particles = {}  // Set of all active particles
  	, randomDirection
    ;

  that.setRandDirections = function() {
	  randomDirection = Math.random() * Math.PI * 2;
  };
  
  //------------------------------------------------------------------
  // This creates one new particle
  //------------------------------------------------------------------
  that.create = function(engineInfo) {
    var scale
      , p
      , particleDirection
      , randNum
      ;

    scale =  Random.nextGaussian(14, 2);
    
    randNum = Random.nextRange(1,4);
    if (randNum === 1) {
    	particleDirection = randomDirection + (Math.PI / 2);
    } else if (randNum === 2) {
    	particleDirection = randomDirection + Math.PI;
    } else if (randNum === 3) {
    	particleDirection = randomDirection + (Math.PI * 3 / 2);
    } else {
    	particleDirection = randomDirection;
    }
    

    p = {
      image: spec.image,
      width: scale,
      height: scale,
      direction: Random.nextGaussian(particleDirection, (Math.PI / 20)),
      speed: Random.nextGaussian(engineInfo.speed.mean, engineInfo.speed.stdev), // pixels per second
      rotation: 0,
      lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),  // How long the particle should live, in seconds
      alive: 0,  // How long the particle has been alive, in seconds
      center: {
        x: engineInfo.center.x,
        y: engineInfo.center.y
      },
    };

    p.size = Math.max(1, p.size);            // check for valid size - gaussian numbers can be negative
    p.lifetime = Math.max(0.01, p.lifetime); // Same thing with lifetime
    particles[nextName++] = p;               // Assign a unique name to each particle
  };

  //------------------------------------------------------------------
  // Update the state of all particles.  This includes remove any that
  // have exceeded their lifetime.
  //------------------------------------------------------------------
  that.update = function(elapsedTime) {
    var removeMe = []
      , value
      , particle
      ;

    for (value in particles) {
      if (particles.hasOwnProperty(value)) {
        particle = particles[value];
        particle.alive += elapsedTime;  // Update how long it has been alive

        // Update its position
        particle.center.x += (Math.sin(particle.direction) * particle.speed * elapsedTime);
        particle.center.y -= (Math.cos(particle.direction) * particle.speed * elapsedTime);

        // If the lifetime has expired, identify it for removal
        if (particle.alive > particle.lifetime) {
          removeMe.push(value);
        }
      }
    }

    // Remove all of the expired particles
    for (particle = 0; particle < removeMe.length; particle++) {
      delete particles[removeMe[particle]];
    }
    removeMe.length = 0;
  };

  //------------------------------------------------------------------
  // Render all particles
  //------------------------------------------------------------------
  that.render = function() {
    var value,
      particle;

    for (value in particles) {
      if (particles.hasOwnProperty(value)) {
        particle = particles[value];
        graphics.drawParticle(particle);
      }
    }
  };

  return that;
}
