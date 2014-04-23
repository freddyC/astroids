/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['help'] = (function() {
  'use strict';

  function initialize() {
    document.getElementById('id-help-back').addEventListener(
      'click',
      function() { MYGAME.game.showScreen('main-menu'); },
      false);
  }

  function run() {
    var accel  = MYGAME.keys.accel  ? String.fromCharCode(MYGAME.keys.accel)   : String.fromCharCode(KeyEvent.DOM_VK_W)
      , left   = MYGAME.keys.left   ? String.fromCharCode(MYGAME.keys.left)    : String.fromCharCode(KeyEvent.DOM_VK_A)
      , right  = MYGAME.keys.right  ? String.fromCharCode(MYGAME.keys.right)   : String.fromCharCode(KeyEvent.DOM_VK_D)
      , shoot  = MYGAME.keys.shoot  ? String.fromCharCode(MYGAME.keys.shoot)   : 'Space'
      , jump   = MYGAME.keys.jump   ? String.fromCharCode(MYGAME.keys.jump)    : String.fromCharCode(KeyEvent.DOM_VK_S)
      , shield = MYGAME.keys.shield ? String.fromCharCode(MYGAME.keys.shield) : String.fromCharCode(KeyEvent.DOM_VK_S)
      ;

      if (accel === String.fromCharCode(KeyEvent.DOM_VK_SPACE)) { accel = 'Space'; }
      if (left === String.fromCharCode(KeyEvent.DOM_VK_SPACE)) { left = 'Space'; }
      if (right === String.fromCharCode(KeyEvent.DOM_VK_SPACE)) { right = 'Space'; }
      if (shoot === String.fromCharCode(KeyEvent.DOM_VK_SPACE)) { shoot = 'Space'; }
      if (jump === String.fromCharCode(KeyEvent.DOM_VK_SPACE)) { jump = 'Space'; }
      if (shield === String.fromCharCode(KeyEvent.DOM_VK_SPACE)) { shield = 'Space'; }

    $('#show-accelerate').text('Accelerate: ' + accel);
    $('#show-left-turn').text('Turn left: ' + left);
    $('#show-right-turn').text('Turn right: ' + right);
    $('#show-shoot').text('Shoot: ' + shoot);
    $('#show-hyper-shift').text('Hyper-Jump: ' + jump);
    $('#show-shield').text('Shield: ' + shield);
//    console.log('accel', accel);
//    console.log('left', left);
//    console.log('right', right);
//    console.log('shoot', shoot);
//    console.log('jump', jump);


  }

  return {
    initialize : initialize,
    run : run
  };
}());
