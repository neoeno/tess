import _ from 'lodash';

const CIRCLE_DISTANCE = 2.5;
const OBJ_RADIUS = 1;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function randPoint(max) {
  return [_.random(0, max, true), _.random(0, max, true)];
}

// let points = _.fill(Array(20), null).map(_ => randPoint(10));
let points = [[5.623424242, 8.308158416], [6.275636364, 7.756316832], [0, 0], [5.918030303, 5.874455446], [6.644939394, 5.046881188], [7.522090909, 6.47450495], [8.285363636, 9.698762376], [7.471121212, 9.276584158], [7.608515152, 9.426227723], [4.118666667, 8.812148515], [5.680272727, 8.620891089], [2.081242424, 1.30580198], [8.413, 7.673831683], [9.090212121, 5.565287129], [7.907454545, 8.090841584], [7.764545455, 8.362306931], [7.354363636, 7.318732673], [7.099181818, 8.521613861], [5.132848485, 7.806415842], [8.483515152, 9.820623762], [7.524454545, 9.299950495], [9.201727273, 10.03188119], [8.820818182, 8.530633663], [9.54269697, 7.603970297], [7.339575758, 7.764128713], [5.613818182, 8.023613861], [9.897909091, 5.979564356], [6.484666667, 8.997683168], [10.08924242, 7.022445545], [8.147636364, 7.171425743], [8.839121212, 9.817267327], [7.90069697, 9.525821782], [6.241151515, 6.384415842], [7.326727273, 5.306712871], [8.456969697, 9.48329703], [7.918757576, 8.707346535], [6.45330303, 7.306435644], [9.189545455, 4.811168317], [7.980484848, 9.253039604], [8.313787879, 9.822732673], [5.932545455, 8.892386139], [9.104121212, 7.05509901], [6.516121212, 8.313940594], [5.110393939, 7.234871287], [7.839939394, 5.828336634], [7.129181818, 9.15980198], [9.03, 9.704], [10.04545455, 4.866227723], [9.095333333, 8.027841584], [7.34130303, 8.886148515], [8.638121212, 6.288237624]]
              .map(p => [p[1]*2, Math.abs(p[0]-10)])
let labels = ["AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]

function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(tO(x), tO(y), t(radius), 0, 2*Math.PI);
  ctx.stroke();
}

function drawSquareWithCentroid(ctx, x, y, radius) {
  ctx.strokeRect(tO(x-radius), tO(y-radius), t(radius*2), t(radius*2));
}

function tO(n) { return 200 + t(n); }

function t(n) { return n * 10; }

function drawCircles(points) {
  points.forEach(point => {
    drawCircle(ctx, point[0], point[1], OBJ_RADIUS);
  });
}

function drawSquares(points) {
  points.forEach(point => {
    drawSquareWithCentroid(ctx, point[0], point[1], OBJ_RADIUS);
  });
}

function drawLabels(points) {
  points.forEach((point, i) => {
    ctx.fillText(labels[i], tO(point[0]-0.5), tO(point[1]+0.5));
  });
}

function vectorDistance(p1, p2) {
  return Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[1] - p2[1]), 2));
}

function crowdedness(points, pointInQuestion) {
  return points.reduce((memo, point) => {
    if (vectorDistance(point, pointInQuestion) > CIRCLE_DISTANCE) { return memo; }
    return memo + 1;
  }, 0)
}

function findMostCrowded(points) {
  return points.slice(0).sort((p1, p2) => {
    let p1Crowdedness = crowdedness(points, p1);
    let p2Crowdedness = crowdedness(points, p2);
    return p2Crowdedness - p1Crowdedness;
  })[0];
}

function pointCmp(p1, p2) {
  return p1[0] == p2[0] && p1[1] == p2[1];
}

function translatePointDistanceAtAngle(point, distance, angle) {
  return [point[0] + distance * Math.cos(angle), point[1] + distance * Math.sin(angle)];
}

function angleBetweenPoints(p1, p2) {
  return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
}

function doOverlap(p1, p2) {
  return vectorDistance(p1, p2) < CIRCLE_DISTANCE
}

function expandPointsAwayFrom(points, centrePoint, distance) {
  return points.map(point => {
    if (pointCmp(centrePoint, point)) { return point; } // This will fail if we ever have to deal with coincidental points
    if (!doOverlap(centrePoint, point)) { return point; } // Not overlapping our point, so we'll leave it alone
    return translatePointDistanceAtAngle(point, distance, angleBetweenPoints(centrePoint, point));
  })
}

function snapPoints(points) {
  return points.map(point => {
    return [Math.round(point[0]/2)*2, Math.round(point[1]/2)*2];
  })
}

function drawAngles(points, centrePoint) {
  points.forEach(point => {
    if (pointCmp(centrePoint, point)) { return point; } // This will fail if we ever have to deal with coincidental points
    if (!doOverlap(centrePoint, point)) { return point; } // This point is safe
    let angle = angleBetweenPoints(centrePoint, point);
    let lineLength = 2;
    ctx.moveTo(tO(point[0]), tO(point[1]));
    ctx.lineTo(tO(point[0] + lineLength * Math.cos(angle)), tO(point[1] + lineLength * Math.sin(angle)));
    ctx.stroke();
  })
}

function pointsCentre(points) {
  let pointsSum = points.reduce((p1, p2) => {
    return [p1[0] + p2[0], p1[1] + p2[1]];
  });
  return [pointsSum[0] / points.length, pointsSum[1] / points.length];
}

function disperseCirclesAnimate(points) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  drawCircles(points);
  drawLabels(points);
  let mostCrowded = findMostCrowded(points);
  console.log(crowdedness(points, mostCrowded));
  if (crowdedness(points, mostCrowded) != 1) {
    // Still too crowded!
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    drawCircles([mostCrowded]);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    drawAngles(points, mostCrowded);
    setTimeout(() => disperseCirclesAnimate(expandPointsAwayFrom(points, mostCrowded, 0.1)), 16);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let snappedPoints = snapPoints(points);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    drawSquares(snappedPoints);
    drawLabels(snappedPoints);
  }
}

disperseCirclesAnimate(points);
