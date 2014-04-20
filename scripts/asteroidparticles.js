/*jslint browser: true, white: true, plusplus: true */
/*global Random */
MYGAME.asteroidParticles = function (graphics) {
  'use strict';
  var that = {}
    , nextName = 1    // unique identifier for the next particle
    , particles = {}  // Set of all active particles
    ;

  
  //------------------------------------------------------------------
  // This creates one new particle
  //------------------------------------------------------------------
  that.create = function(particleSpec) {
	  
	    var scale =  Random.nextGaussian(particleSpec.size.mean, particleSpec.size.stdev)
	      , p
	      ;
	    
	    scale = Math.max(1, scale);
	    
	    p = {
	      image: particleSpec.image,
	      width: scale,
	      height: scale,
	      direction: Math.random() * 2 * Math.PI,
	      speed: Random.nextGaussian(particleSpec.speed.mean, particleSpec.speed.stdev), // pixels per second
	      rotation: 0,
	      lifetime: Random.nextGaussian(particleSpec.lifetime.mean, particleSpec.lifetime.stdev),  // How long the particle should live, in seconds
	      alive: 0,  // How long the particle has been alive, in seconds
	      center: {
	        x: particleSpec.center.x,
	        y: particleSpec.center.y
	      },
	    };

	    p.size = Math.max(1, p.size);            // check for valid size - gaussian numbers can be negative
	    p.lifetime = Math.max(0.01, p.lifetime); // Same thing with lifetime
	    particles[nextName++] = p;               // Assign a unique name to each particle
	  };
	  
	  
	  
  that.createSmoke = function(particleSpec) {
 
    var scale =  Random.nextGaussian(particleSpec.size.mean, particleSpec.size.stdev)
      , p
      ;
    
    scale = Math.max(1, scale);
    p = {
      image: particleSpec.images[Random.nextRange(0, particleSpec.images.length - 1)],
      width: scale,
      height: scale,
      direction: Math.random() * 2 * Math.PI,
      speed: Random.nextGaussian(particleSpec.speed.mean, particleSpec.speed.stdev), // pixels per second
      rotation: 0,
      lifetime: Random.nextGaussian(particleSpec.lifetime.mean, particleSpec.lifetime.stdev),  // How long the particle should live, in seconds
      alive: 0,  // How long the particle has been alive, in seconds
      center: particleSpec.center,
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
