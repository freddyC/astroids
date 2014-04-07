MYGAME.HyperJump = (function (offset) {
  'use strict';

  var persicion = 50
    , canvas
    , cellWidth
    , cellHeight
    , offset
    ;

  var whereToJump = function (off) {
    offset = off;
    var grid = getGrid();
    fillgrid(grid);
    return findSafest(grid);
  };

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
      x: (maxX * cellWidth) + (cellWidth/2) + offset,
      y: (maxY * cellHeight) + (cellHeight/2) + offset
    };
    return c;
  }


  var fillgrid = function (grid) {
    for (var x = 0; x < grid.length; ++x) {
      for (var y = 0; y < grid[x].length; ++y) {
        var me = {
          x: (x * cellWidth) + (cellWidth/2),
          y: (y * cellHeight) + (cellHeight/2)
        };
        MYGAME.gameController.getAsteroids().forEach(function (asteroid) {
          var a
            , b = Infinity
            , c = Infinity
            , d = Infinity
            , center = asteroid.getAsteroidCenter()
            ;

          a = distanceBetweenPoints(me, asteroid.getAsteroidCenter());
            me.x -= canvas.width;
          if (center.x > canvas.width / 2) {
            b = distanceBetweenPoints(me, asteroid.getAsteroidCenter());
          }
          me.y -= canvas.height;
          if (center.y > canvas.height / 2 && center.x > canvas.width / 2) {
            c = distanceBetweenPoints(me, asteroid.getAsteroidCenter());
          }
          me.x += canvas.width;
          if (canvas.y > canvas.height / 2) {
            d = distanceBetweenPoints(me, asteroid.getAsteroidCenter());
          }
          grid[x][y] += Math.min(a,b,c,d);
        });
      }
    }
  };

  var getGrid = function () {

  canvas = $('#canvas-main')[0];
  cellWidth = (canvas.width - 2 * offset) / persicion;
  cellHeight = (canvas.height - 2 * offset) / persicion;

    var grid   = []
      , row    = []
      ;

    for (var y = 0; y < persicion; ++y) {
      row.push(0);
    }

    for (var x = 0; x < persicion; ++x) {
      grid.push(row.concat([]));
    }
    return grid;
  };

  return {
    whereToJump: whereToJump
  };
}());