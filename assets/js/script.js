const apiKey = "6aa641400e3e28191b162c454ad4f43e";
$(".day").children("h4").addClass("has-text-info-dark");
const savedLocations =
  JSON.parse(localStorage.getItem("saved-locations")) || [];

// load recent searches
function loadSearches() {
  $("#search-list").empty();
  if (savedLocations) {
    for (let i = 0; i < savedLocations.length; i++) {
      if (i < 10) {
        $("#search-list").append(
          `<li value="${savedLocations[i].name}" data-lat="${savedLocations[i].lat}" data-lon="${savedLocations[i].lon}"><a href="#">${savedLocations[i].name}</a></li>`
        );
      }
    }
    const listItems = $("#search-list").children("li");
    for (let i = 0; i < listItems.length; i++) {
      fetchCurrentWeather(
        $(listItems[i]).attr("data-lat"),
        $(listItems[i]).attr("data-lon")
      ).then(function (data) {
        console.log(`loop:`, i);
        $(listItems[i]).append(` · ${Math.round(data.main.temp)}°`);
      });
    }
    console.log(`this is after the loop`);
  }
}

// event listener on recent searches list items
$("#search-list").on("click", "li", function (event) {
  event.preventDefault();
  const name = $(this).attr("value");
  const lat = $(this).attr("data-lat");
  const lon = $(this).attr("data-lon");
  getWeather(name, lat, lon);
  updateStorage(name, lat, lon);
});

// contains all search-related functions
function runSearch(searchTerm) {
  // get coordinates by location name
  function fetchCityResults(query) {
    const coordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&APPID=${apiKey}`;
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
      const name = $(currentOption).attr("value");
      const lat = $(currentOption).attr("data-lat");
      const lon = $(currentOption).attr("data-lat");
      getWeather(name, lat, lon);
      updateStorage(name, lat, lon);
      $("#location-search").blur();
    }
  }
}

function updateStorage(name, latitude, longitude) {
  // create location object
  let newLocation = {
    name: name,
    lat: latitude,
    lon: longitude,
  };

  const nameArray = savedLocations.map(function (location) {
    return location.name;
  });

  const findDuplicate = nameArray.indexOf(newLocation.name);

  if (findDuplicate === -1) {
    // if no duplicate, add new location to array
    savedLocations.unshift(newLocation);
  } else {
    // if there is a duplicate, remove the old object and then re-add location to array
    savedLocations.splice(findDuplicate, 1);
    savedLocations.unshift(newLocation);
  }

  // update local storage
  localStorage.setItem("saved-locations", JSON.stringify(savedLocations));

  // refresh recent searches list
  loadSearches();
}

// get current weather
function fetchCurrentWeather(latitude, longitude) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${apiKey}&units=imperial`;
  return fetch(currentUrl).then(function (response) {
    return response.json();
  });
}

function getWeather(cityName, latitude, longitude) {
  $("#location-title").text(cityName);
  $("#timestamp").text(`As of ` + dayjs().format("h:mm A"));

  // process current weather data
  fetchCurrentWeather(latitude, longitude).then(function (data) {
    $("#now")
      .children("img")
      .attr(
        "src",
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      );
    $("#now")
      .children(".temp")
      .html(`${Math.round(data.main.temp)}°`);
    $("#now")
      .children(".wind")
      .html(`<b>Wind Speed:</b> ${Math.round(data.wind.speed)} MPH`);
    $("#now")
      .children(".humid")
      .html(`<b>Humidity:</b> ${data.main.humidity}%`);
  });

  // get 5-day forecast
  function fetchForecast() {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${apiKey}&units=imperial`;
    return fetch(weatherUrl).then(function (response) {
      return response.json();
    });
  }

  // process forecast data
  fetchForecast().then(function (data) {
    const forecastData = data.list;
    for (let i = 1; i < 6; i++) {
      const currentDate = dayjs().add(i, "day");
      const sameDate = forecastData.filter((data) =>
        dayjs(data.dt_txt + " UTC").isSame(currentDate, "day")
      );
      const dayTime = sameDate.filter(
        (data) =>
          dayjs(data.dt_txt + " UTC").hour() > 6 &&
          dayjs(data.dt_txt + " UTC").hour() < 18
      );
      const tempArray = sameDate.map((data) => data.main.temp).sort();
      const windArray = sameDate.map((data) => data.wind.speed);
      const humidArray = sameDate.map((data) => data.main.humidity);
      const iconArray = dayTime.map((data) => data.weather[0].icon);
      let mostFrequentIcon = findMostFrequent(iconArray);

      // update Day Card
      const dayCard = `#daycard-${i}`;
      $(dayCard).children("h4").text(currentDate.format("ddd, MMM D"));
      $(dayCard)
        .children("img")
        .attr(
          "src",
          `https://openweathermap.org/img/wn/${
            mostFrequentIcon === undefined ? iconArray[0] : mostFrequentIcon
          }@2x.png`
        );
      $(dayCard)
        .children(".temp")
        .html(
          `<b>${Math.round(tempArray[tempArray.length - 1])}°</b>/ ${Math.round(
            tempArray[0]
          )}°`
        );
      $(dayCard)
        .children(".wind")
        .html(`<b>Wind Speed:</b> ${getAverage(windArray)} MPH`);
      $(dayCard)
        .children(".humid")
        .html(`<b>Humidity:</b> ${getAverage(humidArray)}%`);
    }
    $("#weather-container").children("section").removeClass("hide");
  });
}

// Event listener on location-search input
$("#location-search").on("input", function () {
  const inputValue = $(this).val();
  runSearch(inputValue);
  checkForMatch(inputValue);
});

function getAverage(array) {
  var total = 0;
  var count = 0;

  array.forEach((value) => {
    total += value;
    count++;
  });
  return Math.round(total / count);
}

function findMostFrequent(arr) {
  let mf = 1;
  let m = 0;
  let item;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        m++;
        if (m > mf) {
          mf = m;
          item = arr[i];
        }
      }
    }
    m = 0;
  }

  return item;
}

loadSearches();
