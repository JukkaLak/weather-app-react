import styles from "../styles.module.css";
import { Icon } from "@iconify/react"
import { getWeatherIcon } from "../utils/weatherIconMapper";
import { useTranslation } from "react-i18next";

export default function Forecast({ forecastData }) {
    const { t, i18n } = useTranslation();

    const getDailyForecast = () => {
        const daily = {};

        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString(
                i18n.language === 'fi' ? 'fi-FI' : 'en-US', 
                {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }
            );

            const formattedDate = date.charAt(0).toLocaleUpperCase() + date.slice(1);

            if (!daily[formattedDate]) {
                daily[formattedDate] = {
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                    humidity: item.main.humidity,
                    wind: item.wind.speed
                };
                } else {
                    daily[formattedDate].temp_min = Math.min(daily[formattedDate].temp_min, item.main.temp_min);
                    daily[formattedDate].temp_max = Math.max(daily[formattedDate].temp_max, item.main.temp_max);
                }
            });
        
            return Object.entries(daily).slice(0, 5);
    };

    const dailyForecast = getDailyForecast();

    return (
        <div className={styles.forecast}>
            <h3 className={styles.title}>{t('forecast.title')}</h3>
            <div className={styles.forecastContainer}>
                {dailyForecast.map(([date, data], index) => {
                    
                    return (
                        <div key={index} className={styles.forecastCard}>
                            <p className={styles.forecastDate}>{date}</p>
                            <div className={styles.forecastIcon}>
                                <Icon icon={getWeatherIcon(data.icon)} width="80" height="80" />
                            </div>
                            <p className={styles.forecastTemp}>
                                {Math.round(data.temp_max)}° / {Math.round(data.temp_min)}°
                            </p>
                            <p className={styles.forecastDesc}>{data.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}