const http = require('http');
const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const APIKEY = '495c11d931b8cdf75917cf19fe0f7f4a';  //signup at api.openweathermap.org and obtain an API Key

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
   getWeatherDetails().then(data => {
      data.city = city.toUpperCase();
      res.render('weather', data);
   })
});

app.get('/api/weather', (req, res) => {
   var city = req.query.city;

   console.log(`City: ${city}`);
   setOptionPath(city);
   getWeatherDetails().then(data => {
      res.end.json(data);
   })
})

app.listen(process.env.PORT || 8099);

const setOptionPath = (city) => {
   options.path = "/data/2.5/weather?q=" + city.replace(/ /g, "+") + "&units=metric&APPID=" + APIKEY;
}

async function getWeatherDetails() {
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
