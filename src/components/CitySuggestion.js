import { useState, useEffect } from "react";
import styles from '../styles.module.css'

export default function CitySuggestion({ onSelectCity }) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (input.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
                const response = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
                );
                const data = await response.json();
                const locationByCity = data.reduce((acc, city) => {
                    const key = `${city.name}-${city.country}`;
                    if (!acc.some(c => `${c.name}-${c.country}` === key)) {
                        acc.push(city);
                    }
                    return acc;
                }, []);

                setSuggestions(locationByCity.slice(0, 5));
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [input]);

    const handleSelect = (city) => {
        onSelectCity(city);
        setInput("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className={styles.autocomplete}>
            <input
              className={styles.input} 
              type="text"
              placeholder="Enter city"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.map((city, index) => (
                    <li key={index} onClick={() => handleSelect(city)}>
                        {city.name}, {city.state && `${city.state}, `}{city.country}
                    </li>
                  ))}
                </ul>
            )}
        </div>
    );
}