MYGAME.HyperJump = (function () {
  'use strict';

  var persicion = 10
    , width
    , height
    ;

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
      console.log(grid[x].length)
      for (var y = 0; y < grid[x].length; ++y) {
        if (grid[x][y] > max) {
          max = grid[x][y];
          maxX = x;
          maxY = y;
        }
      }
    }

    console.log(maxX, maxY);
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
          var a = distanceBetweenPoints(me, asteroid.getAsteroidCenter())
          me.x -= width;
          var b = distanceBetweenPoints(me, asteroid.getAsteroidCenter())
          me.y -= height;
          var c = distanceBetweenPoints(me, asteroid.getAsteroidCenter())
          me.x += width;
          var d = distanceBetweenPoints(me, asteroid.getAsteroidCenter())
          grid[x][y] += Math.min(a, b, c, d);
        })
      }
    }
    console.log(grid);
  }

  var getGrid = function () {
    var canvas = $('#canvas-main')[0]
      , grid   = []
      , row    = []
      ;
      width = canvas.width / persicion
      height = canvas.height / persicion

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