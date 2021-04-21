const http = require('http');
const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const APIKEY = '';  //signup at api.openweathermap.org and obtain an API Key

var options = {
   host: 'api.openweathermap.org',
   port: 80,
   path: '/data/2.5/weather?q=Tokyo,jp&units=metric',
   method: 'GET'
};

app.use(cors());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
   res.render('getcity');
});

app.get('/weather', (req, res) => {
   var city = req.query.city;

   console.log(`City: ${city}`);
   setOptionPath(city);
   getWeatherDetails()
      .then(data => {
         data.city = city.toUpperCase();
         res.render('weather', data);
      })
      .catch(error => {
         res.status(500).end(error.message)
      })
});

app.get('/api/weather/:city', (req, res) => {
   var city = req.params.city;

   console.log(`City: ${city}`);
   setOptionPath(city);
   getWeatherDetails()
      .then(data => {
         res.json(data);
      })
      .catch(error => {
         res.status(500).end(error.message)
      })
})

const setOptionPath = (city) => {
   options.path = "/data/2.5/weather?q=" + city.replace(/ /g, "+") + "&units=metric&APPID=" + APIKEY;
}

const getWeatherDetails = async () => {
   const res = await fetch(`http://${options.host}/${options.path}`);
   const data = await res.json();

   let currTemp = data.main.temp;
   let maxTemp = data.main.temp_max;
   let minTemp = data.main.temp_min;
   let humidity = data.main.humidity;

   return ({
      currTemp: currTemp,
      maxTemp: maxTemp,
      minTemp: minTemp,
      humidity: humidity
   });
}

app.listen(process.env.PORT || 8099);