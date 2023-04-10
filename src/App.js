import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [forecastData, setForecastData] = useState([]);

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;

  useEffect(() => {
    // Get the user's current location coordinates
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Make an initial API call for the current weather data using the current location coordinates
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;
        axios.get(currentWeatherUrl).then((response) => {
          setData(response.data);
        });

        // Make an initial API call for the forecast data using the current location coordinates
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;
        axios.get(forecastUrl).then((response) => {
          setForecastData(response.data.list);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  //search for the location typed in the searchbar
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
        axios.get(currentWeatherUrl).then((response) => {
        setData(response.data)
        console.log(response.data)
      });
      axios.get(forecastUrl).then((response) => {
        setForecastData(response.data.list);
        console.log(response.data.list);
      });
      setLocation('');
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined &&
        <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°C</p> : null} 
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} m/s</p> : null} 
              <p>Wind Speed</p>
            </div>
          </div>
          }

        <div className="forecast">
          {forecastData.length > 0 &&
            forecastData.filter((item) => item.dt_txt.endsWith('15:00:00')).slice(0, 5).map((item) => (
              <div key={item.dt} className="forecast-item">
                <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                <p>{item.main.temp.toFixed()}°C</p>
                <p>{item.weather[0].main}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;