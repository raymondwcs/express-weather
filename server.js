http = require('http');
async = require('async');

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
//app.use(express.static(__dirname+ '/graphics'));

app.get('/', function(req,res) {
	res.render('getcity');
});

app.get('/weather',function(req,res) {
	var city = req.query.city;
	console.log("City: " + city);
	//options.path = "/data/2.5/weather?q=" + city + "&units=metric";
	options.path = "/data/2.5/weather?q=" + city.replace(/ /g,"+") + "&units=metric&APPID=" + APIKEY;
	async.waterfall(
	[
   		function getTemperature(callback) {
       		var wreq = http.request(options, function(wres) {
           		wres.setEncoding('utf8');

       			wres.on('data', function (chunk) {
           			var jsonObj = JSON.parse(chunk);
           			console.log("Current Temp. : " + jsonObj.main.temp);
           			console.log("Max Temp : "      + jsonObj.main.temp_max);
           			console.log("Min Temp : "      + jsonObj.main.temp_min);
           			console.log("Humidity : "      + jsonObj.main.humidity);
           			callback(null,
					         city,
					         jsonObj.main.temp,
					         jsonObj.main.humidity,
					         res);
       			});

       		});

       		wreq.on('error',function(e) {
           		console.log('Problem with request: ' + e.message);
       		});

       		wreq.end();
   		},

   		function(city,temperature,humidity,res,callback) {
			res.render('weather', {city: city,
			                       temperature: temperature,
			                       humidity: humidity});
       		callback(null);
   		}
	],
   		function(err) {
       		//
   		}
	);   // end of async.waterfall()
}); // end of app.get()
	
app.listen(process.env.PORT || 8099);
