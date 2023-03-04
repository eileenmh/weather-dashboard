// TODO: Add in ability to choose from a list of cities, ex: London US vs London UK

var requestUrl =
  "http://api.openweathermap.org/geo/1.0/direct?q=" +
  "Cary" +
  "&APPID=6aa641400e3e28191b162c454ad4f43e";
fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
