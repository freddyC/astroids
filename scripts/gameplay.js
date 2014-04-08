/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME, console, KeyEvent, requestAnimationFrame, performance */
MYGAME.screens['game-play'] = (function() {
  'use strict';

  var myMouse = MYGAME.input.Mouse()
    , cancelNextRequest = false
    , lastTimeStamp
    , humanPlayer = true
    , inGame
    , mouseX
    , mouseY
    ;

  window.onscroll = function () {
    window.scrollTo(0, 0);
  };

  function setHumanPlayer (isHuman) {
    humanPlayer = isHuman;
  }

  function initialize() {
    document.getElementById('canvas-main').height = window.innerHeight;
    document.getElementById('canvas-main').width = window.innerWidth;
    document.getElementById('canvas-main').style.height = '100%';
    document.getElementById('canvas-main').style.width = '100%';
    MYGAME.gameController.init();
  }

  //------------------------------------------------------------------
  // This is the Game Loop function!
  //------------------------------------------------------------------
  function gameLoop(time) {
    var elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    if (MYGAME.gameController.gameInProgress) {

      MYGAME.gameController.update(elapsedTime);

      MYGAME.graphics.clear();
      MYGAME.gameController.render();
      requestAnimationFrame(gameLoop);
    } else {
      if (humanPlayer) {
        MYGAME.game.showScreen('get-player');
      } else {
        MYGAME.game.showScreen('main-menu');
      }
    }
  }

  function startInputListeners () {
    window.onkeypress = function(){ if(!humanPlayer){ stopAttractMode();} };
    window.onmousemove = handleMouse;
    window.mousedown = function(){ if(!humanPlayer){ stopAttractMode();} };
    window.mouseup = function(){ if(!humanPlayer){ stopAttractMode();} };
  }


  function handleMouse (event) {
    if (humanPlayer) {
      return;
    }

    if (mouseX === 0 && mouseY === 0) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    } else {
      if (mouseX != event.clientX && mouseY != event.clientY) {
        stopAttractMode();
      }
    }
  }

  function stopAttractMode () {
    if (inGame) {
      //console.log('input detected!');
      inGame = false;
      MYGAME.gameController.clearGame();
      MYGAME.gameController.gameInProgress = false;
      MYGAME.game.showScreen('main-menu');
    }
  }

  function run() {
  inGame = true;
  mouseX = 0;
  mouseY = 0;
    lastTimeStamp = performance.now();
    if (!humanPlayer) {
      startInputListeners ();
    }
    MYGAME.gameController.run(humanPlayer);
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize : initialize,
    run : run,
    setHumanPlayer : setHumanPlayer
  };
}());