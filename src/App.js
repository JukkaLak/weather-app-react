import { useState } from 'react';
import styles from './styles.module.css'
import Button from '@mui/material/Button';
import CitySuggestion from './components/CitySuggestion'; 

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherByCoords = async(lat, lon) => {
    setLoading(true);
    setError('');

    try {
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  const weatherByCity = async(cityName, country) => {
    setLoading(true);
    setError('');

    try {
      const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
      const query = country ? `${cityName},${country}` : cityName;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  }

  const handleCitySelect = (city) => {
    weatherByCity(city.name, city.country);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError("Unable to get location");
          setLoading(false);
        }
      );
    } else {
      setError("Location not supported by browser");
    }
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Weather App</h1>

     <div className={styles.form}>
        <CitySuggestion onSelectCity={handleCitySelect} />
        <Button variant="contained" onClick={handleLocation}>
          Use current location
        </Button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading...</p>}

      {weather && weather.main && (
        <div className={styles.weatherCard}>
          <h2 className={styles.cityName}>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p className={styles.temperature}>{Math.round(weather.main.temp)}°C</p>
          <p className={styles.description}>{weather.weather[0].description}</p>
          <div className={styles.details}>
            <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
        </div>
  );
}

export default App;
