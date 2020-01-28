import React from 'react';
import './WeatherDisplay.css'
import Skycons from 'react-skycons'

class WeatherDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      isCurrent: this.props.iscurrent
    };
  }
  
  showPosition(self) {
      if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              self.setPolling(position.coords.latitude,position.coords.longitude);
          });
      } else {
          alert("Sorry, your browser does not support HTML5 geolocation.");
      }
    }
  componentDidMount() {
    this.showPosition(this);
  }
  updateLocation(e){
      let lat = parseInt(document.getElementById('latinput').value);
      let long = parseInt(document.getElementById('longinput').value);

      this.setPolling(lat,long);

  }
  setPolling(lat,long){
    if(this.timer){
        clearInterval(this.timer);
        this.timer = null;
      }
      this.callDarksky(lat,long);
      this.timer = setInterval(()=> this.callDarksky(lat,long), 30000);
  }
  callDarksky(lat,long){
    let proxy = `https://cors-anywhere.herokuapp.com/`;
    let endpoint = `https://api.darksky.net/forecast/fa37bc51f1954bd226b9cdf3ad2c6f7e/${lat},${long}`;

    fetch(proxy+endpoint)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result,
            currentIcon: result.currently.icon.toUpperCase().replace(/-/g, '_'),
            hourlyIcon: result.hourly.icon.toUpperCase().replace(/-/g, '_'),
            dailyIcon : result.daily.icon.toUpperCase().replace(/-/g, '_'),
            heat: Math.ceil((32 - result.currently.temperature)*3),
            latitude:0,
            longitude:0
          });
          if(this.state.isCurrent){
            document.getElementById('weather-display').style.filter= "hue-rotate("+this.state.heat+"deg)";
          }
          else{
            document.getElementById('weather-display_configurable').style.filter= "hue-rotate("+this.state.heat+"deg)";
            document.getElementById('latinput').value  = lat;
            document.getElementById('longinput').value = long;
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() {
    const { error, isLoaded, items, isCurrent} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if(isCurrent){

      return (
        <div id="weather-display">
          <div class="weather-description">
            Weather data for your current location
          </div>
          <div class="location-info">
            <div class="location-info--row">
             <div class="location-info--title">Latitude&nbsp;:</div>
             <div class="location-info--data">{items.latitude} </div>
            </div>
            <div class="location-info--row">
              <div class="location-info--title">Longitude&nbsp;:</div>
              <div class="location-info--data">{items.longitude} </div>
            </div>
            <div class="location-info--row"> 
              <div class="location-info--title">Timezone&nbsp;:</div>
              <div class="location-info--data"> {items.timezone} </div>
            </div>
          </div>
          <div class="current-weather">
            <h4>The Weather at this location is currently :</h4>
            <h2>{items.currently.summary}</h2>
            <div class="weather-card">
              <div class="current-weather--skycons">
              <Skycons 
                color='black' 
                icon={this.state.currentIcon} 
                autoplay={true}/>
              </div>
              <div class="weather-card--info">
                <div>Temperature (Degrees F) : {items.currently.temperature}</div>
                <div>Presssure (Millibars) : {items.currently.pressure}</div>
                <div>Wind Speed (MPH) : {items.currently.windSpeed}</div>
              </div>
            </div>
          </div>
          <div class="future-forcast">
            <div class="todays-weather">
              <div><strong>Today's Weather</strong></div>
              <h3>{items.hourly.summary}</h3>
              <div class="weather-card">
                <div class="current-weather--skycons">
                <Skycons 
                  color='black' 
                  icon={this.state.hourlyIcon} 
                  autoplay={true}/>
                </div>
              </div>
            </div>
            <div class="tomorrows-weather">
            <div><strong>Tomorrow's Weather</strong></div>
              <h3>{items.daily.summary}</h3>
              <div class="weather-card">
                <div class="current-weather--skycons">
                <Skycons 
                  color='black' 
                  icon={this.state.dailyIcon} 
                  autoplay={true}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    } else {
      return (
        <div id="weather-display_configurable">
          <div class="weather-description">
            <div class="button-disclaimer">Enter in your own Lat and Long</div>
            <div class="button"><button onClick={(e) => this.updateLocation(e)}>Go</button></div>
          </div>
          <div class="location-info">
            <div class="location-info--row">
             <div class="location-info--title">Latitude&nbsp;:</div>
             <div class="location-info--data">
                <input type="text" placeholder="" id="latinput"/>
             </div>
            </div>
            <div class="location-info--row">
              <div class="location-info--title">Longitude&nbsp;:</div>
              <div class="location-info--data">
                <input type="text" placeholder="" id="longinput"/>
              </div>
            </div>
            <div class="location-info--row"> 
              <div class="location-info--title">Timezone&nbsp;:</div>
              <div class="location-info--data"> {items.timezone} </div>
            </div>
          </div>
          <div class="current-weather">
            <h4>The Weather at this location is currently :</h4>
            <h2>{items.currently.summary}</h2>
            <div class="weather-card">
              <div class="current-weather--skycons">
              <Skycons 
                color='black' 
                icon={this.state.currentIcon} 
                autoplay={true}/>
              </div>
              <div class="weather-card--info">
                <div>Temperature (Degrees F) : {items.currently.temperature}</div>
                <div>Presssure (Millibars) : {items.currently.pressure}</div>
                <div>Wind Speed (MPH) : {items.currently.windSpeed}</div>
              </div>
            </div>
          </div>
          <div class="future-forcast">
            <div class="todays-weather">
              <div><strong>Today's Weather</strong></div>
              <h3>{items.hourly.summary}</h3>
              <div class="weather-card">
                <div class="current-weather--skycons">
                <Skycons 
                  color='black' 
                  icon={this.state.hourlyIcon} 
                  autoplay={true}/>
                </div>
              </div>
            </div>
            <div class="tomorrows-weather">
            <div><strong>Tomorrow's Weather</strong></div>
              <h3>{items.daily.summary}</h3>
              <div class="weather-card">
                <div class="current-weather--skycons">
                <Skycons 
                  color='black' 
                  icon={this.state.dailyIcon} 
                  autoplay={true}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      
    }
  }
}

export default WeatherDisplay;