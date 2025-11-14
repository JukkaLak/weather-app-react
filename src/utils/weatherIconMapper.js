export const getWeatherIcon = (iconCode) => {
    const iconMap = {
        '01d': 'meteocons:clear-day',
        '01n': 'meteocons:clear-night',
        '02d': 'meteocons:partly-cloudy-day',
        '02n': 'meteocons:partly-cloudy-night',
        '03d': 'meteocons:cloudy',
        '03n': 'meteocons:cloudy',
        '04d': 'meteocons:overcast',
        '04n': 'meteocons:overcast',
        '09d': 'meteocons:rain',
        '09n': 'meteocons:rain',
        '10d': 'meteocons:rain',
        '10n': 'meteocons:rain',
        '11d': 'meteocons:thunderstorms-rain',
        '11n': 'meteocons:thunderstorms-rain',
        '13d': 'meteocons:snow',
        '13n': 'meteocons:snow',
        '50d': 'meteocons:fog',
        '50n': 'meteocons:fog',
    };

    return iconMap[iconCode] || 'meteocons:cloudy';
};