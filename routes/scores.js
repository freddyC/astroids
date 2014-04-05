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
  var scores = fs.readFileSync(filename);
  scores = JSON.parse(scores);

  scores.sort(function (a, b) {
    return (parseInt(a.score) < parseInt(b.score));
  });

  scores.forEach(function (score) {
    var t = moment(score.when).calendar();
    score.when = t
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

  var newScore =  {
    name : request.query.name,
    score : request.query.score,
    when : Date.now()
  };

  scores.push(newScore);

  scores.sort(function (a, b) {
    return (parseInt(a.score) < parseInt(b.score));
  });

  scores = scores.slice(0, 10);

  fs.writeFileSync(filename, JSON.stringify(scores));

  console.log('New Score of', newScore.score, 'by', newScore.name, 'was added');

  response.writeHead(200);
  response.end();
};
