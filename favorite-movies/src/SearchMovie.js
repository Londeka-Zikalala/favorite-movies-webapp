import React, { useState, useEffect } from 'react';
import MovieList from './MoviesList.js';
import axios from 'axios';

import { Modal, Button } from 'react-bootstrap';

const SearchMovie = ({ handleFavoriteToggle }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    // Fetch popular movies on component mount
    axios.get('/movies/popular')
      .then(response => {
        setPopularMovies(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('Error fetching popular movies:', error);
      });
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      try {
        const response = await axios.post('/movies/search', { query: value });
        setMovies(response.data.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    } else {
      setMovies([]); // Clear search results if input is empty
    }
  };

  const handleMovieClick = (movie) => setSelectedMovie(movie);

  const handleModalClose = () => setSelectedMovie(null);

  return (
    <div className="container mt-4">
      {query ? (
        <>
          <h2>Search Results</h2>
          <MovieList
            movies={movies}
            onFavoriteToggle={handleFavoriteToggle}
            onMovieClick={handleMovieClick}
          />
        </>
      ) : (
        <>
          <h2>Popular Movies</h2>
          <MovieList
            movies={popularMovies}
            onFavoriteToggle={handleFavoriteToggle}
            onMovieClick={handleMovieClick}
          />
        </>
      )}

      <input
        type="text"
        className="form-control mt-3"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleSearch}
      />

      {selectedMovie && (
        <Modal show onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMovie.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedMovie.overview}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SearchMovie;
