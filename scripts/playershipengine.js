/*jslint browser: true, white: true, plusplus: true */
/*global Random */
MYGAME.playerShipEngine = function (spec, graphics) {
	'use strict';
	var that = {},
		nextName = 1,	// unique identifier for the next particle
		particles = {};	// Set of all active particles

	//------------------------------------------------------------------
	//
	// This creates one new particle
	//
	//------------------------------------------------------------------
	that.create = function(engineInfo) {
		var scale,
			p;
		
		scale =  Random.nextGaussian(8, 2);
		
		p = {
				image: spec.image,
				width: scale,
				height: scale,
				center: {x: engineInfo.center.x, y: engineInfo.center.y},
				direction: Random.nextGaussian(((engineInfo.shipFacing + Math.PI) % (2*Math.PI)), (Math.PI / 32)),
				speed: Random.nextGaussian(engineInfo.speed.mean, engineInfo.speed.stdev), // pixels per second
				rotation: 0,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
				alive: 0	// How long the particle has been alive, in seconds
			};
		
		//
		// Ensure we have a valid size - gaussian numbers can be negative
		p.size = Math.max(1, p.size);
		//
		// Same thing with lifetime
		p.lifetime = Math.max(0.01, p.lifetime);
		//
		// Assign a unique name to each particle
		particles[nextName++] = p;
	};
	
	//------------------------------------------------------------------
	//
	// Update the state of all particles.  This includes remove any that 
	// have exceeded their lifetime.
	//
	//------------------------------------------------------------------
	that.update = function(elapsedTime) {
		var removeMe = [],
			value,
			particle;
		
		for (value in particles) {
			if (particles.hasOwnProperty(value)) {
				particle = particles[value];
				//
				// Update how long it has been alive
				particle.alive += elapsedTime;
				
				//
				// Update its position
				particle.center.x += (Math.sin(particle.direction) * particle.speed * elapsedTime);
				particle.center.y -= (Math.cos(particle.direction) * particle.speed * elapsedTime);
				
				//
				// If the lifetime has expired, identify it for removal
				if (particle.alive > particle.lifetime) {
					removeMe.push(value);
				}
			}
		}

		//
		// Remove all of the expired particles
		for (particle = 0; particle < removeMe.length; particle++) {
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
	};
	
	//------------------------------------------------------------------
	//
	// Render all particles
	//
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
