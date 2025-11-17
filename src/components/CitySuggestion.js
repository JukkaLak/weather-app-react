import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next'
import styles from '../styles.module.css'

export default function CitySuggestion({ onSelectCity, onManualSearch }) {
    const { t } = useTranslation();
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);

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
                    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=10&appid=${API_KEY}`
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
                setShowSuggestions(locationByCity.length > 0);
                setSelectedIndex(-1);
            } catch (error) {
                console.error("Error fetching location:", error);
                setSuggestions([]);
                setShowSuggestions(false);
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
        setSelectedIndex(-1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex]);
        } else if (input.trim()) {
            onManualSearch(input);
            setInput("");
            setSuggestions([]);
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    }

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length -1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case "Escape":
                setShowSuggestions(false);
                setSelectedIndex(-1);
                inputRef.current.blur();
                break;
            default:
                break;
        }
    };

    return (
        <form id="city-search-form" className={styles.searchForm} onSubmit={handleSubmit}>
            <div className={styles.autocomplete}>
                <input
                  ref={inputRef} 
                  className={styles.input}
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className={styles.suggestions}>
                      {suggestions.map((city, index) => (
                        <li 
                          key={index} 
                          className={selectedIndex === index ? styles.suggestionActive : ''}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelect(city)}
                        >
                            {city.name}{city.state && `, ${city.state}`}, {city.country}
                        </li>
                      ))}
                    </ul>
                )}
            </div>
        </form>
    );
}