// TODO: Add in ability to choose from a list of cities, ex: London US vs London UK
const apiKey = "6aa641400e3e28191b162c454ad4f43e";

function fetchCoordinatesUrl(city) {
  url =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&APPID=" +
    apiKey;
  return url;
}

function fetchForecastUrl(latitude, longitude) {
  var url =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&APPID=" +
    apiKey;
  return url;
}

function City(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
}

function getCoordinates(event) {
  event.preventDefault();
  fetch(fetchCoordinatesUrl($("#city-entry").val()))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getWeather(data);
    });
}

function getWeather(data) {
  fetch(fetchForecastUrl(data[0].lat, data[0].lon))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

$("#city-search-btn").click(getCoordinates);
