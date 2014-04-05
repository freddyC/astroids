MYGAME.HyperJump = function(spec  , graphics) {
  'use strict';

  var WherToJump = function () {
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
    return {
      x:maxX,
      y:maxY
    };
  }


  var fillgrid = function (grid) {
    for (var x = 0; x < grid.length; ++x) {
      for (var y = 0; y < grid[x].length; ++y) {
        var me = {
          x: x,
          y: y
        }
        MYGAME.gameController.asteroids.forEach(function (asteroid) {
          grid[x,y] += distanceBetweenPoints(me, asteroid.futureCenter)
        })
      }
    }
  }

  var getGrid = function () {
    var height = window.innerHeight / 10
      , width  = window.innerWidth / 10
      , grid   = []
      , row    = []
      ;

    for (var y = 0; y < width; ++y) {
      row.push(0);
    }

    for (var x = 0; x < height; ++x) {
      grid.push(row.concat([]));
    }
    return grid;
  }

  return {
    WherToJump: jump
  };
};