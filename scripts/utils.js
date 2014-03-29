var Angles = (function() {
  'use strict';

  function normalizer(angle) {
    angle = angle % (2*Math.PI);

    if (angle < 0) {
      angle = angle + (2*Math.PI);
    }

    return angle;
  }

  function halfAngleRatio(angleA, angleB) {
    var diffOfAngles = Math.abs(normalizer(angleB) - normalizer(angleA));

    console.log('angleA: ' + normalizer(angleA));
    console.log('angleB: ' + normalizer(angleB));


    if (diffOfAngles < (Math.PI / 2)) {
      console.log(diffOfAngles / Math.PI / 2);
      return diffOfAngles / Math.PI / 2;
    }

    return 0;
  }

  return {
    normalizer: normalizer,
    halfAngleRatio: halfAngleRatio
  };

}());
