import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles.module.css';
import Button from '@mui/material/Button'
import CitySuggestion from '../components/CitySuggestion';
import Forecast from '../components/Forecast';
import { Icon } from '@iconify/react'
import { getWeatherIcon } from '../utils/weatherIconMapper';

export default function ForecastPage() {
    const { t, i18n } = useTranslation();
    const [forecast, setForecast] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState('');
    
    const fetchForecastByCoords = async (lat, lon, name = null) => {
        setLoading(true);
        setError(null);
        
        try {
            const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
            const lang = i18n.language;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
            const response = await fetch(forecastUrl);
            const data = await response.json();

            if (data.cod === "200") {
                setForecast(data);
                setCityName(name || data.city.name);

                localStorage.setItem('currentCity', JSON.stringify({
                    name: name || data.city.name,
                    lat: lat,
                    lon: lon
                }));
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(t('errors.fetchError'));
            console.error("Error fetching forecast:", error);
        }

        setLoading(false);
    };

    const fetchForecastByCity = async (cityName, country) => {
        setLoading(true);
        setError(null);

        try {
            const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
            const lang = i18n.language;
            const query = country ? `${cityName},${country}` : cityName;
            
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric&lang=${lang}`;
            const response = await fetch(forecastUrl);
            const data = await response.json();

            if (data.cod === "200") {
                setForecast(data);
                setCityName(data.city.name);

                localStorage.setItem('currentCity', JSON.stringify({
                    name: data.city.name,
                    lat: data.city.coord.lat,
                    lon: data.city.coord.lon
                }));
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(t('errors.fetchError'));
            console.error("Error fetching forecast:", error);
        }

        setLoading(false);
    };

    const handleCitySelect = (city) => {
        fetchForecastByCoords(city.lat, city.lon, city.name);
    };

    const handleManualSearch = (cityName) => {
        fetchForecastByCity(cityName);
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchForecastByCoords(
                        position.coords.latitude,
                        position.coords.longitude,
                        
                    );
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
      
      {cityName && <h2 className={styles.cityName}>{cityName}</h2>}
      {forecast && (
        <>
            <Forecast forecastData={forecast} />

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
        </>
      )}
    </div>
  );
}