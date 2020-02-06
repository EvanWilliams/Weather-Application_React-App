import React, { useEffect, useState } from 'react';
import './App.css'
import WeatherDisplay from './components/WeatherDisplay.js'

function App() {

  const [currentWeatherData, setcurrentWeatherData] = useState({
    "latitude":42.3601,
    "longitude":-71.0589,
    "timezone":"America/New_York",
    "currently":{
    "summary":"Drizzle",
    "icon":"rain",
    "precipProbability":0.9,
    "precipType":"rain",
    "temperature":66.1,
   
    "humidity":0.83,
    "pressure":1010.34,
    "windSpeed":5.59
    },
    "minutely":{
    "summary":"Light rain stopping in 13 min., starting again 30 min. later.",
    "icon":"rain",
    },
    "hourly":{
    "summary":"Rain starting later this afternoon, continuing until this evening.",
    "icon":"rain",
    "data":[
          {
            "time":1509991200,
            "summary":"Mostly Cloudy",
            "icon":"partly-cloudy-day",
            "precipType":"rain",
            "temperature":65.76,
            "pressure":1010.57,
            "windSpeed":4.23,
          }
        ]
      },
      "daily":{
      "summary":"Mixed precipitation throughout the week, with temperatures falling to 39°F on Saturday.",
      "icon":"rain",
      "data":[
          {
          "time":1509944400,
          "summary":"Rain starting in the afternoon, continuing until evening.",
          "pressure":1012.93,
          "windSpeed":3.22,
          }
      ]
    }
  });
  const [customWeatherData, setcustomWeatherData] = useState(
    {
      "latitude":42.3601,
      "longitude":-71.0589,
      "timezone":"America/New_York",
      "currently":{
      "summary":"Drizzle",
      "icon":"rain",
      "precipProbability":0.9,
      "precipType":"rain",
      "temperature":66.1,
     
      "humidity":0.83,
      "pressure":1010.34,
      "windSpeed":5.59
      },
      "minutely":{
      "summary":"Light rain stopping in 13 min., starting again 30 min. later.",
      "icon":"rain",
      },
      "hourly":{
      "summary":"Rain starting later this afternoon, continuing until this evening.",
      "icon":"rain",
      "data":[
            {
              "time":1509991200,
              "summary":"Mostly Cloudy",
              "icon":"partly-cloudy-day",
              "precipType":"rain",
              "temperature":65.76,
              "pressure":1010.57,
              "windSpeed":4.23,
            }
          ]
        },
        "daily":{
        "summary":"Mixed precipitation throughout the week, with temperatures falling to 39°F on Saturday.",
        "icon":"rain",
        "data":[
            {
            "time":1509944400,
            "summary":"Rain starting in the afternoon, continuing until evening.",
            "pressure":1012.93,
            "windSpeed":3.22,
            }
        ]
      }
    }
  );
  const [currentLocation, setcurrentLocation] = useState([{"lat":"82.3", "long":"-147.1"}]);
  const [customLocation, setcustomLocation] = useState([{"lat":null, "long":null}]);
  var currentLocationTimer,customLocationTimer = null;

  useEffect(() => {
    showPosition();
  },[]);

  const showPosition = async() => {
    if(navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition((position) => {
            setcurrentLocation({"lat":position.coords.latitude.toString(), "long":position.coords.longitude.toString()});
        });
        setPolling();
    } else {
        alert("Sorry, your browser does not support HTML5 geolocation.");
    }
  }
  function setPolling (lat,long) {
    //set the app to poll for changes in the weather.
    if(currentLocationTimer){
        clearInterval(currentLocationTimer);
        currentLocationTimer = null;
      }
      callDarksky(currentLocation[0].lat,currentLocation[0].long,true);
      currentLocationTimer = setInterval( () => callDarksky(currentLocation[0].lat,currentLocation[0].long,true), 30000);

    if(customLocation[0].lat != undefined && customLocation[0].long != undefined){
      if(customLocationTimer){
        clearInterval(this.customLocationTimer);
        customLocationTimer = null;
      }
      callDarksky(customLocation[0].lat,customLocation[0].long, false);
      customLocationTimer = setInterval( () => callDarksky(customLocation[0].lat,customLocation[0].long, false), 30000);
    }

  }

  const callDarksky = async (lat,long,isCurrent) => {
    let proxy = `https://cors-anywhere.herokuapp.com/`;
    let endpoint = `https://api.darksky.net/forecast/fa37bc51f1954bd226b9cdf3ad2c6f7e/${lat},${long}`;

    const response = await fetch(proxy + endpoint)
    .then(res => res.json())
    .then( data => { 
      debugger;

      if(data.currently.icon){
        data.currently.icon = data.currently.icon.toUpperCase().replace(/-/g, '_');
      }
      if(data.hourly.icon){
        data.hourly.icon = data.hourly.icon.toUpperCase().replace(/-/g, '_');
      }
      if(data.daily.icon){
        data.daily.icon  = data.daily.icon.toUpperCase().replace(/-/g, '_');
      }
      data.heat = Math.ceil((32 - data.currently.temperature)*3);

      if(isCurrent && data){
        setcurrentWeatherData(data);
        console.log(currentWeatherData);
        console.log(data);
      }
      else if (data){
        setcustomWeatherData(data);
        console.log(data);
      }

      if(isCurrent){
        document.getElementById('weather-display').style.filter= "hue-rotate("+data.heat+"deg)";
      }
    });
      //     if(this.state.isCurrent){
      //       document.getElementById('weather-display').style.filter= "hue-rotate("+this.state.heat+"deg)";
      //     }
      //     else{
      //       document.getElementById('weather-display_configurable').style.filter= "hue-rotate("+this.state.heat+"deg)";
      //       document.getElementById('latinput').value  = lat;
      //       document.getElementById('longinput').value = long;
      //     }
  }
  return(
      <div id="App">
        <WeatherDisplay 
          isCurrent={true}
          latitude={currentWeatherData.latitude}
          longitude={currentWeatherData.longitude}
          timezone={currentWeatherData.timezone}
          summary={currentWeatherData.currently.summary}
          currentIcon={currentWeatherData.currently.icon}
          currentTemperature={currentWeatherData.currently.temperature}
          currentWindspeed={currentWeatherData.currently.windSpeed}
          currentPressure={currentWeatherData.currently.pressure}
          hourlySummary={currentWeatherData.hourly.summary}
          hourlyIcon={currentWeatherData.hourly.icon}
          dailySummary={currentWeatherData.daily.summary}
          dailyIcon={currentWeatherData.daily.icon}
        />
        { true ? (
        <WeatherDisplay 
          isCurrent={false}
          latitude={customWeatherData.latitude}
          longitude={customWeatherData.longitude}
          timezone={customWeatherData.timezone}
          summary={customWeatherData.currently.summary}
          currentIcon={customWeatherData.currently.icon}
          currentTemperature={customWeatherData.currently.temperature}
          currentPressure={customWeatherData.currently.pressure}
          hourlySummary={customWeatherData.hourly.summary}
          hourlyIcon={customWeatherData.hourly.icon}
          dailySummary={customWeatherData.daily.summary}
          dailyIcon={customWeatherData.daily.icon}
        /> )
          : (<div/>)
        } }
      </div>
    );
}

export default App;
