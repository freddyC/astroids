//------------------------------------------------------------------
// This is some dummy score data
//------------------------------------------------------------------

var fs       = require('fs')
  , moment   = require('moment')
  , filename = './scores.txt'
  ;


//------------------------------------------------------------------
// Report all scores back to the requester.
//------------------------------------------------------------------
exports.all = function(request, response) {
  console.log('Fetching score history');
  var scores = fs.readFileSync(filename)
  scores = JSON.parse(scores);

  scores.sort(function (a, b) {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });

  scores.forEach(function (s) {
    var t = moment(s.when).calendar();
    s.when = t
  })

  response.writeHead(200, {'content-type': 'application/json'});
  response.end(JSON.stringify(scores));
};

//------------------------------------------------------------------
// Add a new score to the server data.
//------------------------------------------------------------------
exports.add = function(request, response) {
  var scores = fs.readFileSync(filename)
  scores = JSON.parse(scores);

  newScores =  {
    name : request.query.name,
    score : request.query.score,
    when : Date.now()
  };

  scores.push(newScore);

  fs.writeFileSync(filename, JSON.stringify(scores));

  console.log('New Score of', newScore.score, 'by', newScore.name, 'was added');

  response.writeHead(200);
  response.end();
};
