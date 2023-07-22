let apiId = "c4d4c8428093fcec16e903cb9f5125f4";
let searchInputEl = document.getElementById("search-input");
let searchBtnEl = document.getElementById("search-btn");
let formEl = document.getElementById("search-form");
let cityName = document.getElementById("city-name"); 
let todaysForecast = document.getElementById("todays-forecast");
let fiveDayTitle = document.getElementById("five-day-title");
let fiveDayForecastCardsEl = document.getElementById("five-day-forecast-cards");
let today = dayjs();

 // submit event for the search form
function submitCity(event) {
    event.preventDefault();
    getCityData(searchInputEl.value);
    searchHistory();
    
}
// During a tutoring session as well as through my own searching I found out about
// async and await. I was able to get the code to work using this method and found
// it to be much cleaner and opted to use that instead of the .then method. I left
// the .then method commented out below for reference to show I undertand how it
// works

// searchBtnEl.addEventListener("click", displayCity);

// function getCityData(cityName) {
//     let requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiId;
//    
//     fetch(requestUrl)
//         .then(function (response) {
//             console.log(response)
//             return response.json();
//         })
//         .then(function (data) {
//             let lat = data[0].lat;
//             let lon = data[0].lon;
//             let weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiId;
//             fetch(weatherUrl)
//                 .then(function(response) {
//                     return response.json();
//                 })
//                 .then(function(data) {
//                     console.log(data);
//                     displayCity();
//                 })
//         })
 
// }

// function that gets the city data from the api getting the name of the city from the search input
// and then using that to get the latitude and longitude of the city. Then it calls the displayCity
// function as well as the oneCallWeather function, thesearch history function, and the fiveDayForecast function
async function getCityData(cityName) {
    let requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiId}`
    const response = await fetch(requestUrl)
    const data = await response.json()
            console.log(data)
            let city = data[0].name;
            searchHistory(city)        
            let lat = data[0].lat;
            let lon = data[0].lon;
            displayCity(city, lat, lon)
            oneCallWeather(lat, lon)
            fiveDayForecast(lat, lon)
           
}

// function that displays the city name and the current date as well as the weather icon
// for the current day
async function displayCity(city, lat, lon) {
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiId}`
    const response = await fetch(forecastUrl);
    const data = await response.json();
    let forecastIcon = document.createElement("img");
    forecastIcon.setAttribute("src", `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`);
    console.log(searchInputEl.value);
    cityName.textContent = city + " " + today.format("MM/DD/YYYY");
    cityName.appendChild(forecastIcon);
    todaysForecast.setAttribute("style", "border = 1px solid black; padding: 10px; margin: 10px; background-color: rgb(137, 180, 209); border-radius: 10px;")
    

    
}

// function that gets the current weather data for the city that was searched for
// and displays the current temperature, wind speed, and humidity
async function oneCallWeather(lat, lon) {
    let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiId}`
    const response = await fetch(weatherUrl)
    const data = await response.json()
    console.log(data)
    let currentTemp = data.current.temp;
    let currentWind = data.current.wind_speed;
    let currentHumidity = data.current.humidity;
    console.log(currentTemp)
    displayCurrentData(currentTemp, currentWind, currentHumidity)
}

// function that gets the five day forecast for the city that was searched for
// and displays the date, weather icon, temperature, wind speed, and humidity
async function fiveDayForecast(lat, lon) {
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiId}`
    const response = await fetch(forecastUrl);
    const data = await response.json();
    console.log(data)
    fiveDayTitle.textContent = "5-Day Forecast";
    if (fiveDayForecastCardsEl.childElementCount > 0) {
        fiveDayForecastCardsEl.innerHTML = "";
    }
    for (var i = 0; i < 5; i++) {
        let forecastCard = document.createElement("div");
        forecastCard.setAttribute("style", "border = 1px solid black; padding: 10px; margin: 10px; background-color: rgb(137, 180, 209); border-radius: 10px;")
        let forecastDate = document.createElement("h5");
        let forecastIcon = document.createElement("img");
        let forecastTemp = document.createElement("p");
        let forecastWind = document.createElement("p");
        let forecastHumidity = document.createElement("p");
        forecastDate.textContent = today.add(i + 1, "day").format("MM/DD/YYYY");
        forecastIcon.setAttribute("src", `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
        forecastTemp.textContent = `Temp: ${data.list[i].main.temp}°F`;
        forecastWind.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        forecastHumidity.textContent = `Humidity: ${data.list[i].main.humidity}%`;
        forecastCard.appendChild(forecastDate);
        forecastCard.appendChild(forecastIcon);
        forecastCard.appendChild(forecastTemp);
        forecastCard.appendChild(forecastWind);
        forecastCard.appendChild(forecastHumidity);
        fiveDayForecastCardsEl.appendChild(forecastCard);

    }

}

// function that displays the current temperature, wind speed, and humidity
function displayCurrentData(currentTemp, currentWind, currentHumidity) {
    let currentTempEl = document.getElementById("current-temp");
    let currentWindEl = document.getElementById("current-wind-speed");
    let currentHumidityEl = document.getElementById("current-humidity");
    currentTempEl.textContent = `Temp: ${currentTemp}°F`;
    currentWindEl.textContent = `Wind: ${currentWind} MPH`;
    currentHumidityEl.textContent = `Humidity: ${currentHumidity}%`;
}



// function that displays the search history and allows the user to click on a city
// that they have already searched for to get the weather data for that city again
function searchHistory(city) {
    let cityList = document.getElementById("search-history-list");
    let cityListItem = document.createElement("li");
    cityListItem.setAttribute("style", "list-style-type: none; cursor: pointer; margin: 2px;");
    cityListItem.setAttribute("class", "search-history-list");
    cityListItem.textContent = city;
    cityList.appendChild(cityListItem);
    cityListItem.addEventListener("click", function() {
        getCityData(cityListItem.textContent)
    });
    if (cityListItem.textContent === "") {
        cityListItem.remove();
    }
    if (cityList.childElementCount > 10) {
        cityList.removeChild(cityList.childNodes[0]);
    }
}

// event listener for the search button
formEl.addEventListener("submit", submitCity);