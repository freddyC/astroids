MYGAME.HyperJump = (function () {
  'use strict';

  var persicion = 10;

  var whereToJump = function () {
    var grid = getGrid();
    fillgrid(grid);
    return findSafest(grid);
  }

  function findSafest(grid) {
    var max = 0
      , maxX
      , maxY
      ;
    for (var x = 0; x < grid.length; ++x) {
      for (var y = 0; y < grid[x].length; ++y) {
        if (grid[x][y] > max) {
          max = grid[x][y];
          maxX = x;
          maxY = y;
        }
      }
    }

    var c = {
      x: (maxX * persicion) + (persicion/2),
      y: (maxY * persicion) + (persicion/2)
    };
    console.log(c);
    return c;
  }


  var fillgrid = function (grid) {
    for (var x = 0; x < grid.length; ++x) {
      for (var y = 0; y < grid[x].length; ++y) {
        var me = {
          x: (x * persicion) + (persicion/2),
          y: (y * persicion) + (persicion/2)
        }
        MYGAME.gameController.asteroids.forEach(function (asteroid) {
          var pos = distanceBetweenPoints(me, asteroid.getAsteroidCenter())
          me.x *= -1;
          me.y *= -1;
          var neg = distanceBetweenPoints(me, asteroid.getAsteroidCenter())
          grid[x][y] += Math.min(pos, neg);
        })
      }
    }
  }

  var getGrid = function () {
    var canvas = $('#canvas-main')[0]
      , width = canvas.width / persicion
      , height = canvas.height / persicion
      , grid   = []
      , row    = []
      ;

    console.log(width, height);

    for (var y = 0; y < width; ++y) {
      row.push(0);
    }

    for (var x = 0; x < height; ++x) {
      grid.push(row.concat([]));
    }
    return grid;
  }

  return {
    whereToJump: whereToJump
  };
}());