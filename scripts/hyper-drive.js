MYGAME.HyperJump = (function (offset) {
  'use strict';

  var whereToJump = function (off) {
    var offset = off * 2;

    var canvas    = $('#canvas-main')[0]
      , dangerArr = MYGAME.gameController.getAsteroids()
      , x1        = offset
      , y1        = offset
      , x2        = canvas.width - offset
      , y2        = canvas.height - offset
      ;

    return emptiestQuad(x1, y1, x2, y2, dangerArr)
  };


  var emptiestQuad = function (x1, y1, x2, y2, dangerArr) {
    //console.log('passed into the function',x1, y1, x2, y2, dangerArr)
    if (dangerArr.length == 0) {
//      console.log('results',{
//        x: (x1 + x2) / 2,
//        y: (y1 + y2) / 2
//      });
      return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2
      }
    }

    var xH = (x1 + x2) / 2
      , yH = (y1 + y2) / 2
      , points = {
          q1: [],
          q2: [],
          q3: [],
          q4: []
        }
      ;

    var limits = {
      q1: {
        x1: xH,
        x2: x2,
        y1: y1,
        y2: yH
      },
      q2: {
        x1: x1,
        x2: xH,
        y1: y1,
        y2: yH
      },
      q3: {
        x1: x1,
        x2: xH,
        y1: yH,
        y2: y2
      },
      q4: {
        x1: xH,
        x2: x2,
        y1: yH,
        y2: y2
      }
    }

    //console.log(limits);

    dangerArr.forEach(function (a) {
      if (a.center.x > xH && a.center.y < yH) {
        points.q1.push(a);
      } else if (a.center.x < xH && a.center.y < yH) {
        points.q2.push(a);
      } else if (a.center.x < xH && a.center.y > yH) {
        points.q3.push(a);
      } else {
        points.q4.push(a);
      }
    })
    var min = 'q1';
    if (points.q2.length < points[min].length) {
      min = 'q2';
    }
    if (points.q3.length < points[min].length) {
      min = 'q3';
    }
    if (points.q4.length < points[min].length) {
      min = 'q4';
    }
    //console.log('min',min);
    return emptiestQuad(limits[min].x1, limits[min].y1, limits[min].x2, limits[min].y2, points[min])
  };

  return {
    whereToJump: whereToJump
  };

}());