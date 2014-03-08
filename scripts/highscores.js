/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['high-scores'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { MYGAME.game.showScreen('main-menu'); },
			false);
	}
	
	function run() {
		
		var list = '<li>Overall</li>', i;
		for (i = 0; i < 3; ++i) {
			if (MYGAME.highScores.overall[i] > 0) {
				list += '<li>' + MYGAME.highScores.overall[i] + '</li>';
			}
		}
		document.getElementById('overall-scores').innerHTML = list;
		
		list = '<li>Level 1</li>', i;
		for (i = 0; i < 3; ++i) {
			if (MYGAME.highScores.level1[i] > 0) {
				list += '<li>' + MYGAME.highScores.level1[i] + '</li>';
			}
		}
		document.getElementById('level1-scores').innerHTML = list;
		
		list = '<li>Level 2</li>', i;
		for (i = 0; i < 3; ++i) {
			if (MYGAME.highScores.level2[i] > 0) {
				list += '<li>' + MYGAME.highScores.level2[i] + '</li>';
			} else {
				list += '<li style="height=100px;"></li>';
			}
		}
		document.getElementById('level2-scores').innerHTML = list;
		
		list = '<li>Level 3</li>', i;
		for (i = 0; i < 3; ++i) {
			if (MYGAME.highScores.level3[i] > 0) {
				list += '<li>' + MYGAME.highScores.level3[i] + '</li>';
			}
		}
		document.getElementById('level3-scores').innerHTML = list;
		
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
