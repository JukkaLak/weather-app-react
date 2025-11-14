import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles.module.css'
import { Button } from '@mui/material';
import CitySuggestion from '../components/CitySuggestion';
import { Icon } from '@iconify/react';
import { getWeatherIcon } from '../utils/weatherIconMapper';

export default function CurrentWeather() {
    const { t, i18n } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [forecast, setForecast] = useState(null);

    const fetchWeatherByCoords = async(lat, lon, name = null) => {
        setLoading(true);
        setError('');

        try {
            const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
            const lang = i18n.language;
            
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            if (weatherData.cod === 200) {
                if (name) {
                    weatherData.name = name;
                }
                setWeather(weatherData);
                setForecast(forecastData);

                localStorage.setItem('currentCity', JSON.stringify({
                    name: name || weatherData.name,
                    lat: lat,
                    lon: lon
                }));
            } else {
                setError(weatherData.message);
            }
        } catch (error) {
            setError(t('errors.fetchError'));
            console.error("Error fetching weather:", error);
        }

        setLoading(false);
    };

    const weatherByCity = async (cityName, country) => {
        setLoading(true);
        setError('');

        try {
            const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
            const lang = i18n.language;
            const query = country ? `${cityName},${country}` : cityName;
      
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric&lang=${lang}`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric&lang=${lang}`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            if (weatherData.cod === 200) {
                setWeather(weatherData);
                setForecast(forecastData);

                localStorage.setItem('currentCity', JSON.stringify({
                    name: weatherData.name,
                    lat: weatherData.coord.lat,
                    lon: weatherData.coord.lon
                }));
            } else {
                setError(weatherData.message);
            }
        } catch (error) {
            setError(t('errors.fetchError'));
            console.error("Error fetching weather:", error);
        }

        setLoading(false);
    };

    const handleCitySelect = (city) => {
        fetchWeatherByCoords(city.lat, city.lon, city.name);
    };

    const handleManualSearch = (cityName) => {
        weatherByCity(cityName);
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    setError(t('errors.locationError'));
                    setLoading(false);
                }
            );
        } else {
            setError(t('errors.notSupported'));
        }
    };

    return (
    <div className={styles.app}>
      <div className={styles.searchContainer}>
        <CitySuggestion 
          onSelectCity={handleCitySelect}
          onManualSearch={handleManualSearch} 
        />
        <div className={styles.buttonGroup}>
          <Button variant="contained" type="submit" form="city-search-form">
            {t('search.searchButton')}
          </Button>
          <Button variant="contained" onClick={handleLocation}>
            {t('search.useLocation')}
          </Button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>{t('weather.loading')}</p>}

      {weather && weather.main && (
        <>
          <div className={styles.weatherCard}>
            <h2 className={styles.cityName}>{weather.name}</h2>
            <div className={styles.weatherIcon}>
                <Icon icon={getWeatherIcon(weather.weather[0].icon)} width="120" height="120" />
            </div>
            <p className={styles.temperature}>{Math.round(weather.main.temp)}°C</p>
            <p className={styles.description}>{weather.weather[0].description}</p>
            <div className={styles.details}>
              <p>{t('weather.feelsLike')}: {Math.round(weather.main.feels_like)}°C</p>
              <p>{t('weather.humidity')}: {weather.main.humidity}%</p>
              <p>{t('weather.wind')}: {weather.wind.speed} m/s</p>
            </div>
          </div>

          {forecast && (
          <div className={styles.hourlyForecast}>
                <h3 className={styles.sectionTitle}>{t('forecast.hourlyTitle')}</h3>
                <div className={styles.hourlyContainer}>
                    {forecast.list.slice(0, 8).map((hour, index) => {
                        const time = new Date(hour.dt * 1000).toLocaleTimeString(
                            i18n.language === 'fi' ? 'fi-FI' : 'en-US', 
                            {
                                hour: '2-digit',
                                minute: '2-digit'
                            }
                        );

                        return (
                            <div key={index} className={styles.hourlyCard}>
                                <p className={styles.hourlyTime}>{time}</p>
                                <div className={styles.hourlyIcon}>
                                    <Icon icon={getWeatherIcon(hour.weather[0].icon)} width="60" height="60" />
                                </div>
                                <p className={styles.hourlyTemp}>{Math.round(hour.main.temp)}°C</p>
                                <p className={styles.hourlyDesc}>{hour.weather[0].description}</p>
                                <p className={styles.hourlyDetail}> {hour.main.humidity}%</p>
                                <p className={styles.hourlyDetail}> {Math.round(hour.wind.speed)} m/s</p>
                            </div>
                        );
                    })}
                </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}