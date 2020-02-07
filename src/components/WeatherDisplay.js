import React from 'react';
import './WeatherDisplay.css'
import Skycons from 'react-skycons'
import { render } from '@testing-library/react';

const WeatherDisplay = ({isCurrent, latitude,longitude,timezone,summary,currentIcon,currentTemperature,currentPressure,currentWindspeed,hourlySummary,hourlyIcon,dailySummary,dailyIcon,onInputChange}) => {
  function handleChange(e) {

    this.props.onInputChange(e.target.value);
  }
  if(isCurrent){
        var controlsHTML = (
      <div>
        <div className="weather-description">
          Weather data for your current location
        </div>
        <div className="location-info">
          <div className="location-info--row">
           <div className="location-info--title">Latitude&nbsp;:</div>
           <div className="location-info--data">{latitude} </div>
          </div>
          <div className="location-info--row">
            <div className="location-info--title">Longitude&nbsp;:</div>
            <div className="location-info--data">{longitude} </div>
          </div>
          <div className="location-info--row"> 
            <div className="location-info--title">Timezone&nbsp;:</div>
            <div className="location-info--data"> {timezone} </div>
          </div>
        </div> 
      </div>)
      }
      else{(
        controlsHTML = <div id="">
        <div className="weather-description">
          <div className="button-disclaimer">Enter in your own Lat and Long</div>
          <div className="button"><button onClick={handleChange}>Go</button></div>
        </div>
        <div className="location-info">
          <div className="location-info--row">
           <div className="location-info--title">Latitude&nbsp;:</div>
           <div className="location-info--data">
              <input type="text" placeholder="" id="latinput"/>
           </div>
          </div>
          <div className="location-info--row">
            <div className="location-info--title">Longitude&nbsp;:</div>
            <div className="location-info--data">
              <input type="text" placeholder="" id="longinput"/>
            </div>
          </div>
          <div className="location-info--row"> 
            <div className="location-info--title">Timezone&nbsp;:</div>
            <div className="location-info--data"> {timezone} </div>
          </div>
        </div>
      </div>
      )}
      return (
        <div id="weather-display">
        {controlsHTML}
          <div className="current-weather">
            <h4>The Weather at this location is currently :</h4>
            <h2>{summary}</h2>
            <div className="weather-card">
              <div className="current-weather--skycons">
              <Skycons 
                color='black' 
                icon={currentIcon} 
                autoplay={true}/>
              </div>
              <div className="weather-card--info">
                <div>Temperature (Degrees F) : {currentTemperature}</div>
                <div>Presssure (Millibars) : {currentPressure}</div>
                <div>Wind Speed (MPH) : {currentWindspeed}</div>
              </div>
            </div>
          </div>
          <div className="future-forcast">
            <div className="todays-weather">
              <div><strong>Today's Weather</strong></div>
              <h3>{hourlySummary}</h3>
              <div className="weather-card">
                <div className="current-weather--skycons">
                <Skycons 
                  color='black' 
                  icon={hourlyIcon} 
                  autoplay={true}/>
                </div>
              </div>
            </div>
            <div className="tomorrows-weather">
            <div><strong>Tomorrow's Weather</strong></div>
              <h3>{dailySummary}</h3>
              <div className="weather-card">
                <div className="current-weather--skycons">
                <Skycons 
                  color='black' 
                  icon={dailyIcon} 
                  autoplay={true}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default WeatherDisplay;