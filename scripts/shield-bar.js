MYGAME.shieldBar = function(point) {
  'use strict';

  var background = {
        x: point.x,
        y: point.y,
        width: 150,
        height: 30,
        color: 'black'
      };

  var bar = {
      x: point.x + 2,
      y: point.y + 2,
      width: 146,
      height: 26,
      color: 'white',
      maxWidth: 146
    };

  var readyText = {
    text: 'Shield Ready',
    font: '12pt Calibri',
    color: 'white',
    x: point.x + 34,
    y: point.y + 20
  };

  var chargingText = {
    text: 'Charging...',
    font: '12pt Calibri',
    color: 'white',
    x: point.x + 40,
    y: point.y + 20
  };

  function update(percent) {
    if (percent > 1) {
      percent = 1;
    }
    bar.width = bar.maxWidth * percent
    if (bar.maxWidth != bar.width) {
      bar.color = 'red';
    } else {
      bar.color = 'rgb(21, 99, 52)';
    }
  };

  function render (shields) {
	if (shields > 0) {
      MYGAME.graphics.drawRect(background);
      MYGAME.graphics.drawRect(bar);
      if (bar.width === bar.maxWidth) {
        MYGAME.graphics.drawText(readyText);
      } else {
        MYGAME.graphics.drawText(chargingText);
      }
      
      var xOffset = background.x + 27
        , yOffset = background.y + background.height + 35
        , i
        ;
      
      for (i = 0; i < shields; i++) {
    	  var tinyShieldSpec = {
		    image: MYGAME.images['images/shield.png'],
			center: { x: xOffset, y: yOffset },
			size: {
				width: 40,
				height: 40
			},
			rotation: 0
		  };
    	  MYGAME.graphics.drawImage(tinyShieldSpec);
    	  xOffset += 50;
      }
      
      
	}
  };

  return {
    update : update,
    render : render
  };
};
