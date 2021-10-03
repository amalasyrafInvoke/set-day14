var apiKey = 'df193a0003d5623bfba80ba6c716e323';
var isCurrentLocation = false;

var weatherHolder = document.getElementById('weather-holder');
var currentWeatherHolder = document.getElementById('current-weather-holder');
var searchValue = document.getElementById('search-input');

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  alert('Your browser does not support Geolocation');
}

function showPosition(pos) {
  // fetchWeatherApi(pos);
  fetchCurrentWeather(pos);
  isCurrentLocation = true;
}

function searchOnClick() {
  isCurrentLocation = false;
  currentWeatherHolder.innerHTML = '';
  weatherHolder.innerHTML = '';

  var location = searchValue.value;

  fetchCurrentWeather(location, 'search');

  searchValue.value = '';
}

function submitOnEnter(event) {
  if (event.keyCode === 13) {
    event.preventDefault();

    isCurrentLocation = false;
    currentWeatherHolder.innerHTML = '';
    weatherHolder.innerHTML = '';

    var location = searchValue.value;

    fetchCurrentWeather(location, 'search');

    searchValue.value = '';
  }
}

function fetchWeatherApi(pos, searchType = 'current') {
  var url = '';
  if (searchType === 'current') {
    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}&units=metric`;
  }

  if (searchType === 'search') {
    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}&units=metric`;
  }
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.daily[0]);
      console.log(data);

      data.daily.forEach((day, index) => {
        if (index === 0) {
          return;
        }
        addWeatherEl(day, index);
      });
    });
}

function fetchCurrentWeather(pos, searchType = 'current') {
  var url = '';
  if (searchType === 'current') {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}&units=metric`;
  }

  if (searchType === 'search') {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${pos}&appid=${apiKey}&units=metric`;
  }
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      var pos = {
        coords: {
          latitude: data.coord.lat,
          longitude: data.coord.lon,
        },
      };

      fetchWeatherApi(pos, 'search');

      addCurrentWeatherEl(data);
    });
}

function addWeatherEl(day, dateAdj) {
  var createDiv = document.createElement('div');
  createDiv.classList.add('weather-list');

  var createDateEL = document.createElement('h3');
  createDateEL.classList.add('date-text');

  var dateTime = moment().utc(day.dt);

  var test = moment(dateTime).add(dateAdj, 'day').format('ddd, Do MMM');
  createDateEL.innerHTML = test;

  var div1 = document.createElement('div');
  div1.classList.add('top-part');
  var div2 = document.createElement('div');
  div2.classList.add('btm-part');

  var topDiv1 = document.createElement('div');
  var topH1 = document.createElement('h1');
  topH1.innerHTML = Math.ceil(day.temp.day);

  var topDiv2 = document.createElement('div');

  var topImg = document.createElement('img');
  topImg.setAttribute(
    'src',
    `http://openweathermap.org/img/w/${day.weather[0].icon}.png`
  );

  topImg.setAttribute('height', '40px');
  topImg.setAttribute('width', '40px');

  var btmP1 = document.createElement('p');
  btmP1.innerHTML = `<i class="fa fa-tint"></i> ${day.humidity}%`;
  var btmP2 = document.createElement('p');
  btmP2.innerHTML = `<i class="fa fa-wind"></i> ${day.wind_speed}km/h`;
  var btmP3 = document.createElement('p');
  btmP3.innerHTML = `<i class="fa fa-tachometer-alt"></i> ${day.pressure} hPa`;

  weatherHolder.appendChild(createDiv);

  createDiv.appendChild(createDateEL);
  createDiv.appendChild(div1);
  createDiv.appendChild(div2);

  div1.appendChild(topDiv1);

  topDiv1.appendChild(topH1);
  div1.appendChild(topDiv2);
  topDiv2.appendChild(topImg);

  div2.appendChild(btmP1);
  div2.appendChild(btmP2);
  div2.appendChild(btmP3);
}

function addCurrentWeatherEl(data) {
  // Create Location Div
  var createLocationDiv = document.createElement('div');
  createLocationDiv.setAttribute('id', 'current-location');

  var createText = document.createElement('h5');
  createText.innerHTML = '<i class="fa fa-map-pin"></i> Your Location Now';

  var createLocation = document.createElement('h1');
  createLocation.innerHTML = isCurrentLocation
    ? `${data.name}, ${data.sys.country}`
    : `<i class="fa fa-compass"></i> ${data.name}, ${data.sys.country}`;
  createLocationDiv.onclick = () => {
    isCurrentLocation = true;
    currentWeatherHolder.innerHTML = '';
    weatherHolder.innerHTML = '';
    searchValue.value = '';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert('Your browser does not support Geolocation');
    }
  };

  // Create Temperature Div
  var createTemperatureDiv = document.createElement('div');
  createTemperatureDiv.setAttribute('id', 'current-temp');

  var tempIcon = document.createElement('img');
  tempIcon.setAttribute(
    'src',
    `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
  );

  tempIcon.setAttribute('height', '150px');
  tempIcon.setAttribute('width', '150px');

  var weatherType = document.createElement('p');
  weatherType.setAttribute('id', 'weatherType');
  weatherType.innerHTML = `${data.weather[0].main}`;

  var tempText = document.createElement('h1');
  tempText.innerHTML = Math.ceil(data.main.temp);

  var dateText = document.createElement('h3');
  dateText.innerHTML = moment().utc(data.dt).format('Do MMMM YYYY');

  // Create Mini Info Div

  var createInfoDiv = document.createElement('div');
  createInfoDiv.setAttribute('id', 'current-info');

  var windSpeed = document.createElement('p');
  windSpeed.innerHTML = `<i class='fa fa-wind'></i> ${data.wind.speed} km/h`;

  var humidity = document.createElement('p');
  humidity.innerHTML = `<i class='fa fa-tint'></i> ${data.main.humidity}%`;

  var pressure = document.createElement('p');
  pressure.innerHTML = `<i class='fa fa-tachometer-alt'></i> ${data.main.pressure} hPa`;

  currentWeatherHolder.appendChild(createLocationDiv);
  createLocationDiv.appendChild(createText);
  createLocationDiv.appendChild(createLocation);

  currentWeatherHolder.appendChild(createTemperatureDiv);
  createTemperatureDiv.appendChild(tempIcon);
  createTemperatureDiv.appendChild(weatherType);
  createTemperatureDiv.appendChild(tempText);
  createTemperatureDiv.appendChild(dateText);

  currentWeatherHolder.appendChild(createInfoDiv);
  createInfoDiv.appendChild(windSpeed);
  createInfoDiv.appendChild(humidity);
  createInfoDiv.appendChild(pressure);
}
