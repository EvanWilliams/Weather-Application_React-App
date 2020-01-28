import React from 'react';
import './Dashboard.css';
import WeatherDisplay from './WeatherDisplay';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
    };
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
        <div id="wrapper">
          <WeatherDisplay iscurrent={true}/>
          <WeatherDisplay />
        </div>
      );
    }
  }
}

export default Dashboard;