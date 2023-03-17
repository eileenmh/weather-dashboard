const apiKey = "6aa641400e3e28191b162c454ad4f43e";

function fetchCityResults(searchTerm) {
  coordinatesUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&APPID=${apiKey}`;
  return fetch(coordinatesUrl).then(function (response) {
    return response.json();
  });
}

// Event listener on search input change
$("#location-search").on("input", function () {
  inputValue = $(this).val();
  if (inputValue.length > 2) {
    fetchCityResults(inputValue).then(function (data) {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        createSearchOption(
          data[i].name,
          data[i].state,
          data[i].country,
          data[i].lat,
          data[i].lon
        );
      }
    });
  }
});

function createSearchOption(name, state, country, latitude, longitude) {
  let option = `<option value="${name}, ${state}, ${country}" data-lat="${latitude}" data-lon="${longitude}"></option>`;
  $("#location-options").append(option);
}

// ---------------------
// function fetchCoordinatesUrl(city) {
//   url =
//     "http://api.openweathermap.org/geo/1.0/direct?q=" +
//     city +
//     "&APPID=" +
//     apiKey;
//   return url;
// }

// function fetchForecastUrl(latitude, longitude) {
//   var url =
//     "http://api.openweathermap.org/data/2.5/forecast?lat=" +
//     latitude +
//     "&lon=" +
//     longitude +
//     "&APPID=" +
//     apiKey;
//   return url;
// }

// function getCoordinates(event) {
//   fetch(fetchCoordinatesUrl($("#city-entry").val()))
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       getWeather(data);
//     });
// }

// function getWeather(data) {
//   fetch(fetchForecastUrl(data[0].lat, data[0].lon))
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//     });
// }

// $("#city-search-btn").click(getCoordinates);
