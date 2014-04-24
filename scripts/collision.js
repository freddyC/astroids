function equationFromVector (v) {
	return equationFromPointSlope(v.point, Math.tan(v.direction));
};

function interceptOfVectors (v1, v2) {
	return interceptOfEquations(equationFromVector(v1), equationFromVector(v2));
};

function equationFromTwoPoints (p1, p2) {
  var equation = {};
  equation.slope = (p1.y - p2.y) / (p1.x - p2.x);
  equation.intercept = (equation.slope * (-p1.x)) + p1.y;
  return equation;
};

function angleFromTwoPoints (p1, p2) {
  return Math.atan(-1/((p2.y - p1.y)/(p2.x - p1.x)));
};

function perpendicularSlopeToEquation (equation) {
  return (-1 / equation.slope);
};

function equationFromPointSlope (p, slope) {
  var equation = {};
  equation.slope = slope;
  equation.intercept = p.y - (slope * p.x);
  return equation;
};

function interceptOfEquations (e1, e2) {
  var point = {};
  point.x = (e2.intercept - e1.intercept) / (e1.slope - e2.slope);
  point.y = (e1.slope * point.x) + e1.intercept;
  return point;
};

function isPointInCircle (p, circle) {
  var yepper = distanceBetweenPoints(p, circle.point) <= circle.radius;
  return distanceBetweenPoints(p, circle.point) <= circle.radius;
};

function distanceBetweenPoints (p1, p2) {
  return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
};

function isCirclesColliding (c1, c2) {
	return distanceBetweenPoints(c1.point, c2.point) <= c1.radius + c2.radius;
}

function isPointInSection (p0, p1, p2) {
  return ((p0.x >= p1.x && p0.x <= p2.x) || (p0.x <= p1.x && p0.x >= p2.x)) &&
       ((p0.y >= p1.y && p0.y <= p2.y) || (p0.y <= p1.y && p0.y >= p2.y));
};

function isLineSegmentInCircle (p1, p2, circle) {
  var equationForSegment = equationFromTwoPoints(p1, p2)
    , equationForCircle  = equationFromPointSlope(circle.point, perpendicularSlopeToEquation(equationForSegment))
    , intercept          = interceptOfEquations(equationForSegment, equationForCircle)
    ;

  return isPointInCircle(intercept, circle) && isPointInSection(intercept, p1, p2);
};

function isPointInPolygon(point, poly) {
    var c = false
      , i
      , p1
      , p2
      ;

    for (i = 0; i < poly.length - 1; i++) {
      p1 = poly[i];
      p2 = poly[i+1];
      if(((p1.y >= point.y ) != (p2.y >= point.y)) && (point.x <= ((p2.x - p1.x) * (point.y - p1.y) / (p2.y - p1.y) + p1.x))) {
        c = !c;
      }
    }

    p1 = poly[0];
    p2 = poly[poly.length-1];
    if( ((p1.y >= point.y ) != (p2.y >= point.y)) &&  (point.x <= ((p2.x - p1.x) * (point.y - p1.y) / (p2.y - p1.y) + p1.x)) ) {
        c = !c;
      }

    return c;
};

function isPolygonInCircle(poly, circle) {
  if (poly.length < 3) {
    return false;
  }
  var i, p1, p2;
  for (i = 0; i < poly.length - 1; i++) {
    p1 = poly[i];
    p2 = poly[i+1];
    if (isLineSegmentInCircle (p1, p2, circle)) {
      return true;
    }
  }
  return isLineSegmentInCircle (poly[0], poly[poly.length-1], circle);
};

function componentVector(v) {
	return {
		x: v.magnitude * Math.cos(v.angle),
		y: v.magnitude * Math.sin(v.angle)
	};
};

function dotProduct(v1, v2) {
	return (v1.x * v2.x) + (v1.y * v2.y);
}

function multiplyVectorByScalar (v, scalar) {
	return {
		x: v.x * scalar,
		y: v.y * scalar
	};
};

function addVectors(v1, v2) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y
	};
};

function getUnitVector(obj1, obj2) {
	var c1 = obj1.getCenter()
	  , c2 = obj2.getCenter()
	  , v = {
		  x: c2.x - c1.x,
		  y: c2.y - c1.y
      };
	
	var divisor = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
	
	v.x = v.x / divisor;
	v.y = v.y / divisor;
	
	return v;
};

function getTangentVector(v) {
	return {
		x: v.y * -1,
		y: v.x
	};
};

function getCollisionVectors(obj1, obj2) {
	
	var v1 = obj1.getComponentVector()
	  , v2 = obj2.getComponentVector()
      , un = getUnitVector(obj1, obj2)
      , ut = getTangentVector(un)
      , v1n = dotProduct(un, v1)
	  , v1t = dotProduct(ut, v1)
	  , v2n = dotProduct(un, v2)
	  , v2t = dotProduct(ut, v2)
	  , v1tPrime = v1t
	  , v2tPrime = v2t
	  , v1nPrime = ((v1n * (obj1.mass - obj2.mass)) + (2 * obj2.mass * v2n)) / (obj1.mass + obj2.mass)
	  , v2nPrime = ((v2n * (obj2.mass - obj1.mass)) + (2 * obj1.mass * v1n)) / (obj1.mass + obj2.mass)
	  , v1Prime = addVectors(multiplyVectorByScalar(un, v1nPrime), multiplyVectorByScalar(ut, v1tPrime))
	  , v2Prime = addVectors(multiplyVectorByScalar(un, v2nPrime), multiplyVectorByScalar(ut, v2tPrime))
	  ;

      return {
    	  v1: convertComponentToPolar(v1Prime),
    	  v2: convertComponentToPolar(v2Prime)
      };
};


function convertComponentToPolar(v) {
	var direction = -wwdMath.atan(v.y / v.x);
	if (v.x < 0) {
		direction += Math.PI;
	}

	return {
		direction: direction,
		magnitude: Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
	};
}


