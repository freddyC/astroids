function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
};

MYGAME.makeCoins = function(usa, roman, canadian, range, includeClock){
	var coins = [], i;
	
	for(i = 0; i < usa; ++i) {
		coins.push({
			image: 'images/Coin-US-Dollary.png',
			width: 65,
			height: 65,
			center: {x: getRandomInt(33, range-33), y: -33},
			radius: 32.5,
			rotation: 0,
			droprate: Math.floor(Random.nextGaussian(250, 60)),
			type: 'us',
			belowScreen: false,
			maxDrop: 532 + 33
		});
	}
	
	for(i = 0; i < roman; ++i) {
		coins.push({
			image: 'images/Coin-Roman.png',
			width: 40,
			height: 40,
			center: {x: getRandomInt(20, range-20), y: -20},
			radius: 17.5,
			rotation: 0,
			droprate: Math.floor(Random.nextGaussian(250, 60)),
			type: 'roman',
			belowScreen: false,
			maxDrop: 532 + 20
		});
	}
	
	for(i = 0; i < canadian; ++i) {
		coins.push({
			image: 'images/Coin-Canadian-Dollar.png',
			width: 100,
			height: 100,
			center: {x: getRandomInt(51, range-51), y: -51},
			radius: 50,
			rotation: 0,
			droprate: Math.floor(Random.nextGaussian(250, 60)),
			type: 'canadian',
			belowScreen: false,
			maxDrop: 532 + 51
		});
	}
	
	shuffle(coins);
	
	if (includeClock) {
		withClock = coins.slice(0, coins.length/2);
		withClock.push({
				image:'images/Clock.png',
				width: 50,
				height: 50,
				center: {x: getRandomInt(25, range-25), y: -25},
				radius: 25,
				rotation: 0,
				droprate: Math.floor(Random.nextGaussian(250, 60)),
				type: 'clock',
				belowScreen: false,
				maxDrop: 532 + 25
		});
		coins = withClock.concat(coins.slice(coins.length/2, coins.length));
	}
	
	return coins;
};


MYGAME.updateCoin = function(coin, elapsedTime) {
	coin.center.y += coin.droprate * elapsedTime / 1000;
	if (coin.center.y > coin.maxDrop) {
		coin.belowScreen = true;
	}
};







