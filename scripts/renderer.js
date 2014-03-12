/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, MYGAME */
// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

MYGAME.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	function clear() {
		context.clear();
	}
	
	function DrawObject(objectToDraw) {
		context.save();
		
		context.translate(objectToDraw.center.x, objectToDraw.center.y);
		context.rotate(objectToDraw.rotation);
		context.translate(-objectToDraw.center.x, -objectToDraw.center.y);
		
		context.drawImage(
				
				MYGAME.images[objectToDraw.image],
				objectToDraw.center.x - objectToDraw.width/2, 
				objectToDraw.center.y - objectToDraw.height/2,
				objectToDraw.width, objectToDraw.height);
		
		context.restore();
	}

	//------------------------------------------------------------------
	//
	// Expose an ability to draw an image/texture on the canvas.
	//
	//------------------------------------------------------------------
	function drawImage(spec) {
		context.save();
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(
			spec.image, 
			spec.center.x - spec.size.width/2, 
			spec.center.y - spec.size.height/2,
			spec.size.width, spec.size.height);
		
		context.restore();
		
	}
	
	function drawParticle(spec) {
		context.save();
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(
			spec.image, 
			spec.center.x - (spec.width / 2), 
			spec.center.y - (spec.height / 2),
			spec.width, spec.height);
		
		context.restore();
	}
	
	return {
		clear : clear,
		DrawObject : DrawObject,
		drawImage : drawImage,
		drawParticle : drawParticle
	};
}());
