function equationFromTwoPoints (p1, p2) {
	var equation = {};
	equation.slope = (p1.y - p2.y) / (p1.x - p2.x);
	equation.intercept = (equation.slope * (-p1.x)) + p1.y;
	return equation;
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

function isPointInSection (p0, p1, p2) {
	return ((p0.x >= p1.x && p0.x <= p2.x) || (p0.x <= p1.x && p0.x >= p2.x)) &&
		   ((p0.y >= p1.y && p0.y <= p2.y) || (p0.y <= p1.y && p0.y >= p2.y));
};

function isLineSegmentInCircle (p1, p2, circle) {
	var equationForSegment = equationFromTwoPoints(p1, p2),
		equationForCircle = equationFromPointSlope(circle.point, perpendicularSlopeToEquation(equationForSegment)),
		intercept = interceptOfEquations(equationForSegment, equationForCircle);
		
	return isPointInCircle(intercept, circle) && isPointInSection(intercept, p1, p2);
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




