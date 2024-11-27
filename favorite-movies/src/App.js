import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Favorites from "./FavoriteMoviesList";
import LoginModal from "./UserLogin.js" 
import SearchMovie from "./SearchMovie";

axios.defaults.baseURL = "http://localhost:3010";

const App = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showValidation, setShowValidation] = useState(null);

  useEffect(() => {
    // Load session and favorites from localStorage
    const savedSession = JSON.parse(localStorage.getItem("isLoggedIn"));
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsLoggedIn(savedSession || false);
    setFavorites(savedFavorites);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("favorites");
  };

  const handleFavoriteToggle = (movie) => {
    if (!isLoggedIn) {
      setShowValidation("Please log in or sign up to add favorites!");
      setTimeout(() => setShowValidation(null), 3000); 
      return;
    }
  
    const alreadyFavorited = favorites.some((fav) => fav.id === movie.id);
    const updatedFavorites = alreadyFavorited
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  
    setShowValidation(
      alreadyFavorited ? "Removed from favorites!" : "Added to favorites!"
    );
    setTimeout(() => setShowValidation(null), 3000); 
  };
  

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">MovieApp</Link>
          <Link className="nav-link" to="/favorites">Favorites</Link>
          {!isLoggedIn ? (
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                document.getElementById("loginModal").style.display = "block"
              }
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
      <div className="container mt-3">
        {showValidation && (
          <div className="alert alert-info text-center">{showValidation}</div>
        )}
        <Routes>
          <Route
            path="/"
            element={<SearchMovie handleFavoriteToggle={handleFavoriteToggle} />}
          />
          <Route
            path="/favorites"
            element={<Favorites favorites={favorites} isLoggedIn={isLoggedIn} />}
          />
        </Routes>
      </div>
      {/* Login Modal */}
      <LoginModal
        setIsLoggedIn={setIsLoggedIn}
        modalId="loginModal"
      />
    </Router>
  );
};

export default App;
