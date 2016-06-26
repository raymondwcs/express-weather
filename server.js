http = require('http');

var express = require('express');
var app = express();
var APIKEY = "";  // signup at api.openweathermap.org and obtain an API Key

var options = {
    host: 'api.openweathermap.org',
    port: 80,
    path: '/data/2.5/weather?q=Tokyo,jp&units=metric',
    method: 'GET'
};

app.set('view engine', 'ejs');

app.get('/', function(req,res) {
	res.render('getcity');
});

app.get('/weather',function(req,res) {
	var city = req.query.city;

	console.log("City: " + city);
	options.path = "/data/2.5/weather?q=" + city.replace(/ /g,"+") + "&units=metric&APPID=" + APIKEY;
	getTemperature(function(data){ 
			data.city = city.toUpperCase();
			res.render('weather', data);
	}); 
}); // end of app.get()

app.listen(process.env.PORT || 8099);

function getTemperature(callback) {
	var currTemp = 'N/A';
	var maxTemp = 'N/A';
	var minTemp = 'N/A';
	var humidity = 'N/A';

	var wreq = http.request(options, function(wres,res) {
   		wres.setEncoding('utf8');

   		wres.on('data', function (chunk) {
   			var jsonObj = JSON.parse(chunk);
			if (!jsonObj.hasOwnProperty("main")) {
				jsonObj.main = 'N/A';
			}
   			console.log("Current Temp. : " + jsonObj.main.temp);
   			console.log("Max Temp : "      + jsonObj.main.temp_max);
   			console.log("Min Temp : "      + jsonObj.main.temp_min);
   			console.log("Humidity : "      + jsonObj.main.humidity);
					         
			currTemp = jsonObj.main.temp;
			maxTemp = jsonObj.main.temp_max;
			minTemp = jsonObj.main.temp_min;
			humidity = jsonObj.main.humidity;
   		});

   		wres.on('error',function(e) {
   			console.log('Problem with request: ' + e.message);
   		});

		wres.on('end',function(chunk) {
			callback({currTemp: currTemp,
			          maxTemp: maxTemp,
			          minTemp: minTemp,
			          humidity: humidity});
		});
   	}); //http.request
	
	wreq.end();
}

