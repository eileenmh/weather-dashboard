# Weather Dashboard

For this week's challenge, we were asked to create a weather dashboard that retrieves relevant weather data from OpenWeatherAPI based on a user-entered location. The top part of the dashboard shows the current weather conditions, and the bottom half shows the 5-day forecast. After a user searches for a location, that location is saved in local storage and presented upon later page reloads. Saved locations can be clicked to load that locations weather.

The application can be accessed here: https://eileenmh.github.io/weather-dashboard/

The following image shows the web application's appearance and functionality:
![weather-dashboard](/assets/images/weather-dashboard-snapshot.png)

## Acceptance Criteria

We were provided with the following acceptance criteria:

```md
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Built With

- [Bulma](https://bulma.io/)
- [jQuery](https://jquery.com/)
- [Day.js](https://day.js.org/)

## Credits

- Project prompt provided by [UNC Coding Bootcamp](https://bootcamp.unc.edu/coding/)
- Created by Eileen Harvey ([@eileenmh](https://github.com/eileenmh))
- API by [OpenWeather](https://openweathermap.org/api)

## Acknowledgements

- JavaScript function `findMostFrequent(arr)` taken and adapted from [w3resource](https://www.w3resource.com/javascript-exercises/javascript-array-exercise-8.php)
