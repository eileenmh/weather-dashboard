const apiKey = "6aa641400e3e28191b162c454ad4f43e";

// contains all search-related functions
function runSearch(searchTerm) {
  // get coordinates by location name
  function fetchCityResults(query) {
    const coordinatesUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&APPID=${apiKey}`;
    return fetch(coordinatesUrl).then(function (response) {
      return response.json();
    });
  }

  // if the search term has more than two characters, fetch city results from api then run createLocationOptions
  if (searchTerm.length > 2) {
    fetchCityResults(searchTerm).then(function (data) {
      createLocationOptions(data);
    });
  }

  // create datalist options from api results
  function createLocationOptions(apiCityData) {
    // clear current options in datalist
    $("#location-options").empty();

    // create an option and append to datalist
    function createOption(name, state, country, latitude, longitude) {
      let option = `<option value="${name}, ${state}, ${country}" data-lat="${latitude}" data-lon="${longitude}"></option>`;
      $("#location-options").append(option);
    }

    // create and and append option for each data result
    for (let i = 0; i < apiCityData.length; i++) {
      createOption(
        apiCityData[i].name,
        apiCityData[i].state,
        apiCityData[i].country,
        apiCityData[i].lat,
        apiCityData[i].lon
      );
    }
  }
}

// check if input value matches an option value, if it does then getWeather and storeLocationData
function checkForMatch(searchTerm) {
  const options = $("#location-options").children();
  for (let i = 0; i < options.length; i++) {
    const currentOption = options[i];
    if ($(currentOption).attr("value") === searchTerm) {
      const cityLat = $(currentOption).attr("data-lat");
      const cityLon = $(currentOption).attr("data-lon");
      getWeather(cityLat, cityLon);
      $("#location-search").blur();
    }
  }
}

function getWeather(latitude, longitude) {
  // get 5-day forecast
  function fetchForecast() {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${apiKey}`;
    return fetch(weatherUrl).then(function (response) {
      return response.json();
    });
  }
  fetchForecast().then(function (data) {
    const forecastData = data.list;
    console.log(forecastData);
    for (let i = 0; i < 5; i++) {
      const currentDate = dayjs().add(i, "day");
      const sameDate = forecastData.filter((data) =>
        dayjs(data.dt_txt + " UTC").isSame(currentDate, "day")
      );
      console.log(currentDate, sameDate);
    }
  });
}

// Event listener on location-search input
$("#location-search").on("input", function () {
  const inputValue = $(this).val();
  runSearch(inputValue);
  checkForMatch(inputValue);
});
