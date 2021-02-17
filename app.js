// Data from OpenWeatherMap API https://openweathermap.org/api
const API_KEY_OWM = '0ff8bed46cf7cfbce85b5bd93528d7ba';

// get HTML DOM elements
const form = document.querySelector('form');
const locateBtn = document.querySelector('#locate-user');

// temperature object
const temperature = {
  value: 'celsius',
  input: undefined,
  city: undefined,
  symbol: 'C',
}

// location object
const loc = {
  lat: undefined,
  lon: undefined
};

// image object
const image = {
  url: undefined,
  name: undefined,
  username: undefined,
}

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
  menu.style.display = 'none';
};

// function get image
const getImage = async (city) => {
  const API_KEY_UNSPLASH = 'Owh_29g6I8oJm48gwAX7ktmWgvSfv2hbATtDXb8dCh8';
  const API_URL_UNSPLASH = `https://api.unsplash.com/search/photos?client_id=${API_KEY_UNSPLASH}&page=1&orientation=portrait&query=${city}/`;
  
  // try and fetch
  try {
    const response = await fetch(API_URL_UNSPLASH);
    const data = await response.json();
  
    image.username = await data.results[0].user.username;
    image.url = await data.results[0].urls.full;
    image.name = await data.results[0].user.name;
  } catch (err) {

    // alert user if input is invalid
    alert('Invalid query');
    console.error(err);
  }
  
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

  // store input into i
  temperature.input = input;

  
  // API to search for city
  const API_URL_CITY = `https://api.openweathermap.org/data/2.5/weather?q=${temperature.city}&appid=${API_KEY_OWM}`;

  // try to fetch data 
  try {

    // fetch weather based on city
    const response = await fetch(API_URL_CITY);

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
  API_URL_GEO = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_OWM}`;

  // fetch weather using loc.lat and loc.lon
  const response = await fetch(API_URL_GEO);

  // convert response to json
  const data = await response.json();
  
  // store city into temperature object
  temperature.city = await data.name;

  // await for getImage function
  await getImage(temperature.city)

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

  let temp, minTemp, maxTemp, feelsLike;

  if(temperature.value === 'celsius') {
    // convert kelvin into celsius
    temp = Math.round(data.main.temp - celsius);
    minTemp = Math.round(data.main.temp_min - celsius);
    maxTemp = Math.round(data.main.temp_max - celsius);
    feelsLike = Math.round(data.main.feels_like - celsius);

    // convert kelvin into fahrenheit
  } else if (temperature.value === 'fahrenheit') {
    temp = Math.round(((data.main.temp - celsius) * 9 / 5) + 32);
    minTemp = Math.round(((data.main.temp_min - celsius) * 9 / 5) + 32);
    maxTemp = Math.round(((data.main.temp_max - celsius) * 9 / 5) + 32);
    feelsLike = Math.round(((data.main.feels_like - celsius) * 9 / 5) + 32);
  }

  const unix_timestamp_sunrise = data.sys.sunrise;
  const unix_timestamp_sunset = data.sys.sunset;

  // convert sunrise unix timestamp to hours and minutes
  const d = new Date(unix_timestamp_sunrise * 1000);
  const h = d.getHours();
  const m = d.getMinutes();
  const sunrise = `${h}:${m}`;

  // convert sunset unix timestamp to hours and minutes
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
  container.textContent = '';

  // create a new html
  const item =
	`
  <form class="search-container">
    <input type="text" placeholder="Search City...">
    <button id="search-button" type="submit"><i class="fas fa-search"></i></button>
  </form>
  <p><span id="celsius">&#176;C</span> | <span id="fahrenheit">&#176;F</span></p>
  <div class="weather-container">
	  <p id="city">${weather.city}</p>
    <!-- <div class="geo">
	    <p>Lat: ${weather.lat}&#176;</p>
	    <p>Lon: ${weather.lon}&#176;</p>
	  </div> -->
	  <p>${weather.date}</p>
    <div>
      <img src="${weather.iconURL}" alt="${weather.weather}">
      <p>${weather.weather}</p>
    </div>
	  <p id="temp">${weather.temp}<span>&#176;${temperature.symbol}</span></p>
	  <div class="temp">
	    <p>Min<br>${weather.minTemp}&#176;${temperature.symbol}</p>
      <p>Feels like<br>${weather.feelsLike}&#176;${temperature.symbol}</p>
	    <p>Max<br>${weather.maxTemp}&#176;${temperature.symbol}</p>
	  </div>
	  <div class="sun">
	    <p>Sunrise<br>${weather.sunrise}am</p>
	    <p>Sunset<br>${weather.sunset}pm</p>
	  </div>
    <p id="attribution">Photo by <a href="https://unsplash.com/@${image.username}?utm_source=your_app_name&utm_medium=referral">${image.name}</a> on <a href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral">Unsplash</a>
  </div>
	`;

  // insert html into container
  container.insertAdjacentHTML('beforeend', item);
  // change background image
  container.style.backgroundImage = `url(${image.url})`;
};

// add form event listener
document.addEventListener('submit', async (e) => {

  // prevent page reload
  e.preventDefault();

  // assign value to city
  temperature.city = e.target.childNodes[1].value;
  
  // await getImage function
  await getImage(temperature.city);

  // call geoSearch function
  geoSearch(temperature.city);
});

// add document event listener
document.addEventListener('click', (e) => {

  // if id is celcius
  if(e.target.id === 'celsius') {
    temperature.value = 'celsius';
    temperature.symbol = 'C';
    geoSearch(temperature.input);
  }

  // if id is fahrenheit
  if(e.target.id === 'fahrenheit') {
    temperature.value = 'fahrenheit';
    temperature.symbol = 'F';
    geoSearch(temperature.input);
  }

  // if id is locate-user
  if(e.target.id === 'locate-user') {
    document.querySelector('#github').style.color = '#ffffff';
    geoLocate();
    hideMenu();
  }
});