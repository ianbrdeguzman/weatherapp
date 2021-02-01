// Data taken from OpenWeatherMap API https://openweathermap.org/api
APIKEY = '0ff8bed46cf7cfbce85b5bd93528d7ba';

// get HTML DOM elements
const startBtn = document.querySelector('#start');
const form = document.querySelector('form');
const locateBtn = document.querySelector('#locate-user');

// location object
const loc = {
  lat: undefined,
  lon: undefined
};

// weather object
const weather = {
  iconURL: undefined,
  city: undefined,
  date: undefined,
  feelsLike: undefined,
  lat: undefined,
  lon: undefined,
  maxTemp: undefined,
  minTemp: undefined,
  sunrise: undefined,
  sunset: undefined,
  temp: undefined,
  weather: undefined
};

// function to hide menu
const hideMenu = () => {
  const menu = document.querySelector('.menu');
  menu.style.visibility = 'hidden';
};

// function to get location of user
const geoLocate = () => {
  if ('geolocation' in navigator) {
    console.log('Geolocation available');
    navigator.geolocation.getCurrentPosition( async position => {

      // assign lat and lon to loc object
      loc.lat = await position.coords.latitude;
      loc.lon = await position.coords.longitude;

      // call getWeather and pass lat and lon
      getWeather(loc.lat, loc.lon);
    })
  } else {
    console.log('Geolocation not available');
  }
};

// search function by user input
const geoSearch = async (input) => {

  // API to search for city
  const API_CITY = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${APIKEY}`;

  // try to fetch data 
  try {

    // fetch weather based on city
    const response = await fetch(API_CITY);

    // convert response into json
    const data = await response.json();

    // call createWeather function and pass data
    createWeather(data);
  
  // and catch error if input is invalid
  } catch (err) {

    // alert user if input is invalid
    alert('Invalid query');
    console.error(err);
  }
};

// getWeather function
const getWeather = async (lat, lon) => {

  // API to search using latitude and longitude
  API_GEO = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`;

  // fetch weather using loc.lat and loc.lon
  const response = await fetch(API_GEO);

  // convert response to json
  const data = await response.json();

  // call create Weather
  createWeather(data);
}


const createWeather = (data) => {
  const icon = data.weather[0].icon;
  const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  const celsius = 273.15;
  const city = data.name;
  const locWeather = data.weather[0].main;

  // create a new data string
  const date = new Date().toDateString();

  // assign only up to 2 decimal places
  const lat = data.coord.lat.toFixed(2);
  const lon = data.coord.lon.toFixed(2);

  // convert kelvin into celsius
  const temp = Math.round(data.main.temp - celsius);
  const minTemp = Math.round(data.main.temp_min - celsius);
  const maxTemp = Math.round(data.main.temp_max - celsius);
  const feelsLike = Math.round(data.main.feels_like - celsius);

  const unix_timestamp_sunrise = data.sys.sunrise;
  const unix_timestamp_sunset = data.sys.sunset;

  // convert unix timestamp to hours and minutes
  const d = new Date(unix_timestamp_sunrise * 1000);
  const h = d.getHours();
  const m = d.getMinutes();
  const sunrise = `${h}:${m}`;

  // convert unix timestamp to hours and minutes
  const d2 = new Date(unix_timestamp_sunset * 1000);
  const h2 = d2.getHours();
  const m2 = d2.getMinutes();
  const sunset = `${h2}:${m2}`;

  // assign data into weather object
  weather.iconURL = iconURL;
  weather.city = city;
  weather.date = date;
  weather.feelsLike = feelsLike;
  weather.lat = lat;
  weather.lon = lon;
  weather.maxTemp = maxTemp;
  weather.minTemp = minTemp;
  weather.sunrise = sunrise;
  weather.sunset = sunset;
  weather.temp = temp;
  weather.weather = locWeather;
  
  // call displayWeather
  displayWeather();
};


const displayWeather = () => {

  // get container HTML DOM element
  const container = document.querySelector('.app-container');
  
  // clear container
  container.innerHTML = '';

  // create a new html
  const item =
	`
	<div><button id="back">Back</button></div>
	<p id="city">${weather.city}</p>
        <div class="geo">
	    <p>Lat: ${weather.lat}&#176;</p>
	    <p>Lon: ${weather.lon}&#176;</p>
	</div>
	<p>${weather.date}</p>
	<p id="temp">${weather.temp}<span>&#176;c</span></p>
	<img src="${weather.iconURL}" alt="${weather.weather}">
	<p>${weather.weather}</p>
	<div class="temp">
	    <p>Min: ${weather.minTemp}&#176;C</p>
	    <p>Max: ${weather.maxTemp}&#176;C</p>
	</div>
        <p>Feels like: ${weather.feelsLike}&#176;C</p>
	<div class="sun">
	    <p>Rise: ${weather.sunrise}am</p>
	    <p>Set: ${weather.sunset}pm</p>
	</div>
	`;

  // insert html into container
  container.insertAdjacentHTML('beforeend', item);
};

// function to create new weather
function Weather(iconURL, city, lat, lon, date, temp, minTemp, maxTemp, feelsLike, sunrise, sunset, weather) {
  this.iconURL = iconURL;
  this.city = city;
  this.lat = lat;
  this.lon = lon;
  this.date = date;
  this.temp = temp;
  this.minTemp = minTemp;
  this.maxTemp = maxTemp;
  this.feelsLike = feelsLike;
  this.sunrise = sunrise;
  this.sunset = sunset;
  this.weather = weather;
};


// button event listener
startBtn.addEventListener('click', hideMenu);
locateBtn.addEventListener('click', geoLocate);

// form event listener
form.addEventListener('submit', (e) => {

  // prevent reloading the page
  e.preventDefault();

  // get user input value
  const input = document.querySelector('.search-container input').value;

  // call geoSearch function using user value
  geoSearch(input);
});

// add window event listener
window.addEventListener('click', (e) => {

  // if element click id equal to back
  if(e.target.id === 'back') {

    // reload the page
    location.reload();
  }
});