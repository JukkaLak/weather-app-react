import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import CurrentWeather from "./pages/CurrentWeather";
import ForecastPage from "./pages/ForecastPage";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<CurrentWeather />} />
        <Route path="/forecast" element={<ForecastPage />} />
      </Routes>
    </Router>
  );
}

export default App;
