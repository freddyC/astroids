/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['configure-controls'] = (function() {
  'use strict';

  function initialize() {
    document.getElementById('id-controls-back').addEventListener(
      'click',
      function() { MYGAME.game.showScreen('main-menu'); },
      false);
  }


  function run() {
    var accel = MYGAME.keys.accel ? String.fromCharCode(MYGAME.keys.accel) : String.fromCharCode(KeyEvent.DOM_VK_W)
      , left  = MYGAME.keys.left  ? String.fromCharCode(MYGAME.keys.left)  : String.fromCharCode(KeyEvent.DOM_VK_A)
      , right = MYGAME.keys.right ? String.fromCharCode(MYGAME.keys.right) : String.fromCharCode(KeyEvent.DOM_VK_D)
      , shoot = MYGAME.keys.shoot ? String.fromCharCode(MYGAME.keys.shoot) : String.fromCharCode(KeyEvent.DOM_VK_SPACE)
      , jump  = MYGAME.keys.jump  ? String.fromCharCode(MYGAME.keys.jump)  : String.fromCharCode(KeyEvent.DOM_VK_S)
      ;

    $('#set-accelerate').val(accel);
    $('#set-left-turn').val(left);
    $('#set-right-turn').val(right);
    $('#set-shoot').val(shoot);
    $('#set-hyper-shift').val(jump);
  }

  return {
    initialize : initialize,
    run : run
  };
}());