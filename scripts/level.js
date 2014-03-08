var Distance = function(x1, y1, x2, y2) {
	var x = Math.pow((x2 - x1), 2),
		y = Math.pow((y2 - y1), 2);
	return Math.sqrt(x + y);
};


MYGAME.MakeLevelHandler = function() {
	var that = {
			gameInProgress: true,
			mouseClicks: []
		},
		level1 = MYGAME.MakeLevel({us: 10, canadian: 5, roman: 3}, {us: 5, canadian: 1, roman: 1}, 'Level 1'),
		level2 = MYGAME.MakeLevel({us: 15, canadian: 10, roman: 4}, {us: 8, canadian: 3, roman: 2}, 'Level 2'),
		level3 = MYGAME.MakeLevel({us: 20, canadian: 12, roman: 5}, {us: 12, canadian: 4, roman: 3}, 'Level 3'),
		currentLevel = 1,
		showWinMessage = false,
		showLostMessage = false,
		elapsedTime = 0,
		countDownEle = document.getElementById('countdown'),
		scoreEle = document.getElementById('score_cell');
		
		
	that.update = function(time) {
		if(showWinMessage) {
			elapsedTime += time;
			if (elapsedTime >= 2000) {
				// hide the message
				countDownEle.style.visibility = "hidden";
				scoreEle.innerHTML = '';
				// Add to high score here
				that.gameInProgress = false;
			}
		} else if (showLostMessage) {
			elapsedTime += time;
			if (elapsedTime >= 2000) {
				// hide the message
				countDownEle.style.visibility = "hidden";
				that.gameInProgress = false;
			}
		} else if(currentLevel === 1) {
			if(level1.inProgress) {
				level1.mouseClicks = that.mouseClicks;
				level1.update(time);
			} else {
				if (MYGAME.score >= 100) {
					MYGAME.logScore(1, MYGAME.score);
					MYGAME.score = 0;
					currentLevel = 2;
					level2.init();
				} else {
					// lost the game
					showLostMessage = true;
					countDownEle.style.visibility = "visible";
					document.getElementById('score').style.visibility = "hidden";
				}
			}
		} else if (currentLevel === 2) {
			if(level2.inProgress) {
				level2.mouseClicks = that.mouseClicks;
				level2.update(time);
			} else {
				if (MYGAME.score >= 100) {
					MYGAME.logScore(2, MYGAME.score);
					MYGAME.score = 0;
					currentLevel = 3;
					level3.init();
				} else {
					// lost the game
					showLostMessage = true;
					countDownEle.style.visibility = "visible";
					document.getElementById('score').style.visibility = "hidden";
				}
			}
		} else {
			if(level3.inProgress) {
				level3.mouseClicks = that.mouseClicks;
				level3.update(time);
			} else {
				if (MYGAME.score >= 100) {
					// Won the game!
					MYGAME.logScore(3, MYGAME.score);
					MYGAME.score = 0;
					showWinMessage = true;
					countDownEle.style.visibility = "visible";
					document.getElementById('score').style.visibility = "hidden";
				} else {
					// lost the game
					showLostMessage = true;
					countDownEle.style.visibility = "visible";
					document.getElementById('score').style.visibility = "hidden";
				}
			}
		}
	};
		
	
	that.render = function(time) {
		if(showLostMessage) {
			if(that.gameInProgress) {
				countDownEle.innerHTML = 'You Lost';
			} else {
				scoreEle.innerHTML = '';
			}
		} else if (showWinMessage) {
			if(that.gameInProgress) {
				countDownEle.innerHTML = 'You Won!!!';
			} else {
				scoreEle.innerHTML = '';
			}
		} else if (currentLevel === 1) {
			level1.render(time);
		} else if (currentLevel === 2) {
			level2.render(time);
		} else if (currentLevel === 3) {
			level3.render(time);
		}
		
	};
	
	
	
	
	that.init = function() {
		level1.init();
	};
	
	return that;
};



MYGAME.MakeLevel = function(normal, extra, msg) {
	var level = {
			coins: MYGAME.makeCoins(normal.us, normal.roman, normal.canadian, 640, true),
			coinsOnScreen: [],
			showMessage: true,
			showCountDown: false,
			showCoins: false,
			countDownNum: 3,
			inProgress: true,
			countDownEle: document.getElementById('countdown'),
			scoreEle: document.getElementById('score_cell'),
			elapsedTime: 0,
			mouseClicks: [],
			timeToDropCoin: Random.nextRange(100, 1000),
			particleGenerators: []
	};
	
	function addMoneyParticle(center) {
		var i, moneyPart = particleSystem( {
				image : MYGAME.images['images/Dollar-Sign.png'],
				center: {x: center.x, y: center.y},
				speed: {mean: 50, stdev: 20},
				lifetime: {mean: 2, stdev: .5}
			},
			MYGAME.graphics
		);

		for (i = 0; i < 20; ++i) {
			moneyPart.create();
		}
		
		level.particleGenerators.push(moneyPart);
	}
	
	level.update = function(time) {
		if(level.showMessage) {
			level.elapsedTime += time;
			if (level.elapsedTime > 1000) {
				level.showMessage = false;
				level.showCountDown = true;
				level.countDownEle.innerHTML = '' + level.countDownNum;
				level.elapsedTime = 0;
			}
		}
		else if(level.showCountDown) {
			level.elapsedTime += time;
			if (level.elapsedTime > 1000) {
				level.countDownNum -= 1;
				if (level.countDownNum < 1) {
					level.showCountDown = false;
					level.showCoins = true;
					level.elapsedTime = 0;
					level.countDownEle.style.visibility = "hidden";
				} 
				level.countDownEle.innerHTML = '' + level.countDownNum;
				level.elapsedTime = 0;
			}
		}
		
		var i, validParticles = [];
		for (i = 0; i < level.particleGenerators.length; ++i) {
			level.particleGenerators[i].update(time/1000);
		}
		
		
		while (level.mouseClicks.length > 0) {
			var e = level.mouseClicks.pop(),
				i,
				coin;
			
			for (i = level.coinsOnScreen.length - 1; i >= 0; --i) {
				coin = level.coinsOnScreen[i];
				if (Distance(coin.center.x, coin.center.y, e.layerX, e.layerY) <= coin.radius + 4) {
					if(coin.type === 'canadian') {
						MYGAME.score = 0;
						addMoneyParticle(coin.center);
					} else if (coin.type === 'us') {
						MYGAME.score += 10;
						addMoneyParticle(coin.center);
					} else if (coin.type === 'roman') {
						MYGAME.score += 50;
						addMoneyParticle(coin.center);
					} else if (coin.type === 'clock') {
						level.coins = level.coins.concat(MYGAME.makeCoins(extra.us, extra.roman, extra.canadian, 640, false));
					}
					
					coin.belowScreen = true;
					break;
				}
			}
			
		}
		
		if(level.showCoins) {
			var i, newCoinsAry = [];
			
			// This will add a coin to the screen every .5 seconds
			level.elapsedTime += time;
			if (level.elapsedTime > level.timeToDropCoin) {
				if (level.coins.length > 0) {
					level.coinsOnScreen.push(level.coins.pop());
				}
				level.elapsedTime = 0;
				level.timeToDropCoin = Random.nextRange(100, 1000);
			}
			
			// Update the positions of the coins on the screen
			for (i = 0; i < level.coinsOnScreen.length; ++i) {
				MYGAME.updateCoin(level.coinsOnScreen[i], time);
				if(!level.coinsOnScreen[i].belowScreen) {
					newCoinsAry.push(level.coinsOnScreen[i]);
				}
			}
			// Getting rid of coins that have dropped off the screen
			level.coinsOnScreen = newCoinsAry;
			
			
			
			
			if(level.coinsOnScreen.length === 0 && level.coins.length === 0) {
				level.inProgress = false;
			}
			
			
		}
	};
	
	
	level.render = function(time) {

		var i;
		for (i = 0; i < level.particleGenerators.length; ++i) {
			level.particleGenerators[i].render();
		}
		for (i = 0; i < level.coinsOnScreen.length; ++i) {
			MYGAME.graphics.DrawObject(level.coinsOnScreen[i]);
		}
		level.scoreEle.innerHTML = '' + MYGAME.score;
	};
	
	level.init = function() {
		level.countDownEle.innerHTML = msg;
		level.countDownEle.style.visibility = "visible";
		level.scoreEle.innerHTML = '' + MYGAME.score;
	};
	
	return level;
};