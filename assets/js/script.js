const apiKey = "6aa641400e3e28191b162c454ad4f43e";

function fetchCityResults(searchTerm) {
  const coordinatesUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&APPID=${apiKey}`;
  return fetch(coordinatesUrl).then(function (response) {
    return response.json();
  });
}
/* SEARCH LOCATION
 */
// Event listener on location search input
$("#location-search").on("input", function () {
  let inputValue = $(this).val();
  let optionsList = $("#location-options");

  if (inputValue.length > 2) {
    fetchCityResults(inputValue).then(function (data) {
      // clear options in datalist
      optionsList.empty();
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
  if ($(optionsList).children().length > 0) {
    let options = $(optionsList).children();
    for (let i = 0; i < $(options).length; i++) {
      let currentOption = $(options)[i];
      if ($(currentOption).attr("value") === inputValue) {
        $("#location-search").blur();
        const latitude = $(currentOption).attr("data-lat");
        const longitude = $(currentOption).attr("data-lon");
        console.log(fetchForecast(latitude, longitude));
      }
    }
  }
});

function createSearchOption(name, state, country, latitude, longitude) {
  let option = `<option value="${name}, ${state}, ${country}" data-lat="${latitude}" data-lon="${longitude}"></option>`;
  $("#location-options").append(option);
}

$("#location-search").select(function () {
  console.log("The change handler ran");
});

function fetchForecast(latitude, longitude) {
  const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${apiKey}`;
  return fetch(weatherUrl).then(function (response) {
    return response.json();
  });
}

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
