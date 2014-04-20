MYGAME.hyperBar = function(point) {
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
	    color: 'blue',
	    maxWidth: 146
	  };
  
  var readyText = {
		text: 'Hyper-Jump Ready',
		font: '12pt Calibri',
		color: 'white',
		x: point.x + 14,
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
  };
  
  function render () {
	  MYGAME.graphics.drawRect(background);
	  MYGAME.graphics.drawRect(bar);
	  if (bar.width === bar.maxWidth) {
		  MYGAME.graphics.drawText(readyText);
	  } else {
		  MYGAME.graphics.drawText(chargingText);
	  }
	    
  };

  return {
    update : update,
    render : render
  };
};
