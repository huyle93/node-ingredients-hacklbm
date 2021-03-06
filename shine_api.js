require('dotenv').load()
var https = require('https');

//Shine API car Theft
let request = require('request')
var shine_key = process.env.shineapi_KEY

var theft_stats = [];

function httpsGetTheftStats( stateCode){
  var promise = new Promise(function(resolve, reject){
    var theft_options = {
      host: 'apis.solarialabs.com',
      path: '/shine/v1/vehicle-thefts?state=' + stateCode + '&apikey=' + shine_key,
      method: 'GET'
    }

      var req = https.request(theft_options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
          responseString += data;
      });

      res.on('end', function() {
          var response = JSON.parse(responseString);
          var theft_make = response[0].Make
          var theft_model = response[0].Model
          var theft_state = response[0].State
          var list = [theft_make,theft_model]
          //console.log( "The #1 most stolen car in " + theft_state + " is the "+ theft_make + " " + theft_model + ".");
          resolve(list);
      });
      });

      req.end();
    });
    return promise
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Shine API car stat
function httpsGetStats(make, model, year, callback){
  var stats_options = {
    host: 'apis.solarialabs.com',
    path: '/shine/v1/vehicle-stats/specs?make=' + make + '&model=' + model + '&year=' + year + '&full-data=true&apikey=' + shine_key,
    method: 'GET'
  }

  var req = https.request(stats_options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
      responseString += data;
  });


      res.on('end', function() {
          var response = JSON.parse(responseString);
          var stats_make = response[0].Make
          var stats_model = response[0].Model
          var stats_car_year = response[0].Model_Year
          var stats_car_mpg = response[0].City_Conventional_Fuel
          callback([response]);
  })
  req.end();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Shine API prediction call
function httpsGetPredictionStats(best_or_worst, callback){
  var predictions_options = {
    host: 'apis.solarialabs.com',
    path: '/shine/v1/vehicle-stats/five-year-costs?top-ten=' + best_or_worst + '&apikey=' + shine_key,
    method: 'GET'
  }

  var req = https.request(predictions_options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
      responseString += data;
  });

  res.on('end', function() {
      var response = JSON.parse(responseString);
      var predict_manufacturer = response[0].Manufacturer
      var predict_model = response[0].Model

      //console.log( 'The predicted ' + best_or_worst + ' model of car based on the increased amount spent over 5 years is the ' + predict_manufacturer + ' ' + predict_model + '.' );
      callback([predict_manufacturer, predict_model]);
  });
  });
  req.end();
}

httpsGetTheftStats('ma').then((res) => { theft_stats = res})

//.then(console.log( theft_stats[0] + " + " + theft_stats[1]))

//console.log( res[0] + " + " + res[1])
//console.log( theft_stats[0] + " + " + theft_stats[1])

module.exports = { httpsGetStats, httpsGetTheftStats }
