/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
MYGAME.screens['high-scores'] = (function() {
  'use strict';

  function initialize() {
    document.getElementById('id-high-scores-back').addEventListener(
      'click',
      function() { MYGAME.game.showScreen('main-menu'); },
      false);
  }

//------------------------------------------------------------------
// Make a request to the server to add a new score.
//------------------------------------------------------------------
function addScore() {
  var name = $('#id-playerName').val(),
    score = $('#id-playerScore').val();
  
  $.ajax({
    url: 'http://localhost:3000/v1/high-scores?name=' + name + '&score=' + score,
    type: 'POST',
    error: function() { alert('POST failed'); },
    success: function() {
      showScores();
    }
  });
}


  function run() {
    $.ajax({
      url: 'http://localhost:3000/v1/high-scores',
      cache: false,
      type: 'GET',
      error: function() { alert('GET failed'); },
      success: function(data) {
        var table = $('#scores-table')[0];

        console.log(data.length);
        console.log(data);

        for (var i = 0; i < data.length; i++) {
          var row   = table.insertRow(1 + i)
            , name  = row.insertCell(0)
            , score = row.insertCell(1)
            , date  = row.insertCell(2)
            ;

            name.innerHTML = '' + data[i].name;
            score.innerHTML = '' + data[i].score;
            date.innerHTML = '' + data[i].when;
        }
          var text = (data[i].name + ' : ' + data[i].score);
          scores.append($('<li>', { text: text }));
        // Create an empty <tr> element and add it to the 1st position of the table:

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:

        // Add some text to the new cells:
        cell1.innerHTML = "NEW CELL1";
        cell2.innerHTML = "NEW CELL2";
      }
    });


  }

  return {
    initialize : initialize,
    run : run
  };
}());
