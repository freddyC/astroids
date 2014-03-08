/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

MYGAME.game = (function() {
	'use strict';
	
	
	function showScreen(id) {
		var screen = 0,
			screens = null;
		//
		// Remove the active state from all screens.  There should only be one...
		screens = document.getElementsByClassName('active');
		for (screen = 0; screen < screens.length; screen ++) {
			screens[screen].classList.remove('active');
		}
		//
		// Tell the screen to start actively running
		MYGAME.screens[id].run();
		//
		// Then, set the new screen to be active
		document.getElementById(id).classList.add('active');
	}

	//------------------------------------------------------------------
	//
	// This function performs the one-time game initialization.
	//
	//------------------------------------------------------------------
	function initialize() {
		var screen = null;
		//
		// Go through each of the screens and tell them to initialize
		for (screen in MYGAME.screens) {
			if (MYGAME.screens.hasOwnProperty(screen)) {
				MYGAME.screens[screen].initialize();
			}
		}
		
		//
		// Make the main-menu screen the active one
		showScreen('main-menu');
	}
	
	return {
		initialize : initialize,
		showScreen : showScreen,
	};
}());


MYGAME.highScores = (function(){
	var that = {
		overall: [0, 0, 0],
		level1: [0, 0, 0],
		level2: [0, 0, 0],
		level3: [0, 0, 0]
	};
	
	if(localStorage.overallone !== undefined) { that.overall[0] = Number(localStorage.overallone); }
	if(localStorage.overalltwo !== undefined) { that.overall[1] = Number(localStorage.overalltwo); }
	if(localStorage.overallthree !== undefined) { that.overall[2] = Number(localStorage.overallthree); }
	
	if(localStorage.level1one !== undefined) { that.level1[0] = Number(localStorage.level1one); }
	if(localStorage.level1two !== undefined) { that.level1[1] = Number(localStorage.level1two); }
	if(localStorage.level1three !== undefined) { that.level1[2] = Number(localStorage.level1three); }
	
	if(localStorage.level2one !== undefined) { that.level2[0] = Number(localStorage.level2one); }
	if(localStorage.level2two !== undefined) { that.level2[1] = Number(localStorage.level2two); }
	if(localStorage.level2three !== undefined) { that.level2[2] = Number(localStorage.level2three); }
	
	if(localStorage.level3one !== undefined) { that.level3[0] = Number(localStorage.level3one); }
	if(localStorage.level3two !== undefined) { that.level3[1] = Number(localStorage.level3two); }
	if(localStorage.level3three !== undefined) { that.level3[2] = Number(localStorage.level3three); }
	
	
	return that;
}());


MYGAME.logScore = function(level, score) {
	MYGAME.highScores.overall.push(score);
	MYGAME.highScores.overall = MYGAME.highScores.overall.sort().reverse().slice(0, 4);
	
	if(level === 1) {
		MYGAME.highScores.level1.push(score);
		MYGAME.highScores.level1 = MYGAME.highScores.level1.sort().reverse().slice(0, 4);
	} else if (level === 2) {
		MYGAME.highScores.level2.push(score);
		MYGAME.highScores.level2 = MYGAME.highScores.level2.sort().reverse().slice(0, 4);
	} else if (level === 3) {
		MYGAME.highScores.level3.push(score);
		MYGAME.highScores.level3 = MYGAME.highScores.level3.sort().reverse().slice(0, 4);
	}
	
	console.log('logging scores');
	
	localStorage.overallone = MYGAME.highScores.overall[0];
	localStorage.overalltwo = MYGAME.highScores.overall[1];
	localStorage.overallthree = MYGAME.highScores.overall[2];

	localStorage.level1one = MYGAME.highScores.level1[0];
	localStorage.level1two = MYGAME.highScores.level1[1];
	localStorage.level1three = MYGAME.highScores.level1[2];
	
	localStorage.level2one = MYGAME.highScores.level2[0];
	localStorage.level2two = MYGAME.highScores.level2[1];
	localStorage.level2three = MYGAME.highScores.level2[2];

	localStorage.level3one = MYGAME.highScores.level3[0];
	localStorage.level3two = MYGAME.highScores.level3[1];
	localStorage.level3three = MYGAME.highScores.level3[2];
};


