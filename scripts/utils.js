var Angles = (function() {
	'use strict';
	
	function normalizer(angle) {
		
		angle = angle % (2*Math.PI);
		
		if (angle < 0) {
			angle = angle + (2*Math.PI);
		}
		
		return angle;
	}
	
	function halfAngleRatio(angleA, angleB) {
		var uX = Math.sin(angleA),
			uY = Math.cos(angleA),
			vX = Math.sin(angleB),
			vY = Math.cos(angleB),
			dotProduct = (uX * vX) + (uY * vY),
			divisor = Math.sqrt(Math.pow(uX, 2) + Math.pow(uY, 2)) * Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2)),
			angleDiff = dotProduct/divisor,
			angle;
		
			if (angleDiff > 1) {
				angle = Math.acos(1);
			} else if (angleDiff < -1) {
				angle = Math.acos(-1);
			} else {
				angle = Math.acos(angleDiff);
			}
		
			return (Math.PI / 2 - angle) / (Math.PI / 2);
	}
	
	return {
		normalizer : normalizer,
		halfAngleRatio : halfAngleRatio
	};
	
}());
