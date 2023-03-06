// TODO: Add in ability to choose from a list of cities, ex: London US vs London UK

function City(latitude, longitude) {
  this.latitude = latitude;
  this.longitude = longitude;
}

$("#city-search-btn").click(test);

function test(event) {
  event.preventDefault();
  var city = $("#city-entry").val();
  console.log(city);
  var requestUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&APPID=6aa641400e3e28191b162c454ad4f43e";
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var requestUrl =
        "http://api.openweathermap.org/data/2.5/forecast?lat=" +
        data[0].lat +
        "&lon=" +
        data[0].lon +
        "&APPID=6aa641400e3e28191b162c454ad4f43e";
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
        });
    });
}
