import React, { useEffect, useState } from 'react';
import './App.css'
import WeatherDisplay from './components/WeatherDisplay.js'

function App() {
  const [currentWeatherData, setcurrentWeatherData] = useState({
    "latitude":0,
    "longitude":0,
    "timezone":"",
    "currently":{
      "summary":"",
      "icon":"",
      "temperature":0,
      "humidity":0,
      "pressure":0,
      "windSpeed":0
    },
    "minutely":{
      "summary":"",
      "icon":"",
    },
    "hourly":{
      "summary":"",
      "icon":"",
      "data":[
            {
              "time":0,
              "summary":"",
              "icon":"",
              "precipType":"",
              "temperature":0,
              "pressure":0,
              "windSpeed":0,
            }
          ]
      },
      "daily":{
        "summary":"",
        "icon":"",
        "data":[
            {
            "time":1509944400,
            "summary":"",
            "pressure":0,
            "windSpeed":0,
            }
        ]
    }
  });
  const [customWeatherData, setcustomWeatherData] = useState({
    "latitude":0,
    "longitude":0,
    "timezone":"",
    "currently":{
      "summary":"Could be Anythin'!",
      "icon":"",
      "temperature":0,
      "humidity":0,
      "pressure":0,
      "windSpeed":0
    },
    "minutely":{
      "summary":"",
      "icon":"",
    },
    "hourly":{
      "summary":"",
      "icon":"",
      "data":[
            {
              "time":0,
              "summary":"",
              "icon":"",
              "precipType":"",
              "temperature":0,
              "pressure":0,
              "windSpeed":0,
            }
          ]
      },
      "daily":{
        "summary":"",
        "icon":"",
        "data":[
            {
            "time":1509944400,
            "summary":"",
            "pressure":0,
            "windSpeed":0,
            }
        ]
    }
  });

  const [currentLocation, setcurrentLocation] = useState({"lat": null, "long": null} );
  const [customLocation, setcustomLocation] = useState({"lat":null, "long":null});

  useEffect(() => {
    getPosition();
  },[]);

  useEffect(() => {
    //fire once to reduce delay
    setPolling();
    const interval = setInterval(() => {
      setPolling();
    }, 30000);
    return () => clearInterval(interval);
  },[currentLocation,customLocation]);

  var getPosition = function (options) {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }
  
  getPosition()
    .then((position) => {
      setcurrentLocation({"lat":Number(position.coords.latitude.toFixed(3)), "long":Number(position.coords.longitude.toFixed(3))});
    })
    .catch((err) => {
      console.error(err.message);
    });

  const updateCustomLocation = (e) => {
    let inputLatitude = document.getElementById("latinput").value;
    let inputLongitude = document.getElementById("longinput").value;

    if(validateInput(inputLatitude,inputLongitude)){
      setcustomLocation({"lat":inputLatitude, "long":inputLongitude});
    }
    else{
      alert("please enter a valid latitude and longitude")
    }

  }

  const validateInput = (lat,long) => {
    let pattern = RegExp("[-]?[0-9]*\.?[0-9]+");
    return (pattern.test(lat) && pattern.test(long))
  }

  function setPolling () {
      //Check if the currentLocation is set in the Lat and Long
      if(currentLocation.lat != null && currentLocation.long != null ){
        callDarksky(currentLocation.lat,currentLocation.long,true);
      }
    //Check if the Custom Location is set
    if(customLocation.lat != null && customLocation.long != null){
      //call darksky once and then set an Interval timer
        callDarksky(customLocation.lat,customLocation.long, false);
      }
  }

  const callDarksky = async (lat,long,isCurrent) => {
    let proxy = `https://cors-anywhere.herokuapp.com/`;
    let endpoint = `https://api.darksky.net/forecast/fa37bc51f1954bd226b9cdf3ad2c6f7e/${lat},${long}`;
    const formatIconString = (string) => {
      return string.toUpperCase().replace(/-/g, '_');
    }
    const hueRotate = (data) => {
      if(isCurrent){
        document.querySelector('.weather-display_current').style.filter= "hue-rotate("+data.heat+"deg)";
      }
      else{
        document.querySelector('.weather-display').style.filter= "hue-rotate("+data.heat+"deg)";
      }
    }
    const response = await fetch(proxy + endpoint)
    .then(res => res.json())
    .then( data => { 

      if(data.currently.icon){
        data.currently.icon = formatIconString(data.currently.icon);
      }
      else if(data.hourly.icon){
        data.hourly.icon = formatIconString(data.hourly.icon);
      }
      else if(data.daily.icon){
        data.daily.icon  = formatIconString(data.daily.icon);
      }
      data.heat = Math.ceil((32 - data.currently.temperature)*3);

      if(isCurrent && data){
        setcurrentWeatherData(data);
      }
      else if (data){
        setcustomWeatherData(data);
      }
        hueRotate(data);

    });
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
          onInputChange={updateCustomLocation}
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
          currentWindspeed={customWeatherData.currently.windSpeed}
          currentPressure={customWeatherData.currently.pressure}
          hourlySummary={customWeatherData.hourly.summary}
          hourlyIcon={customWeatherData.hourly.icon}
          dailySummary={customWeatherData.daily.summary}
          dailyIcon={customWeatherData.daily.icon}
          onInputChange={updateCustomLocation}
        /> )
          : (<div/>)
        } }
      </div>
    );
}

export default App;
