import db from "../db/db.js";
import axios from 'axios';

export default function FavoriteMoviesDB() {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  // Function to get user's favorite movies
  const getFavorites = async (userId) => {
    const result = await db.manyOrNone(
      `SELECT * FROM favorites WHERE favorites.user_id = $1`,
      [userId]
    );
    return result || [];
  };

  // Function to add a movie to favorites
  const addFavorite = async (userId, movieId) => {
    await db.none(
      'INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, movieId]
    );
  };

  // Function to remove a movie from favorites
  const removeFavorite = async (userId, movieId) => {
    await db.none(
      'DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId]
    );
  };

  // Function to search for movies using TMDB API
  const searchMovies = async (query) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: TMDB_API_KEY,
            query: query,
          },
        }
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movies from TMDB:', error);
      throw new Error('Could not fetch movies');
    }
  };

  // Function to get popular movies
const getPopularMovies = async () => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error);
    throw new Error('Could not fetch popular movies');
  }
};


/*** USER FUNCTIONS */

  // Function to create a new user
  const createUser = async (username, passwordHash) => {
    const result = await db.one(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id',
      [username, passwordHash]
    );
    return result.user_id;
  };

  // Function to get user information
  const getUserById = async (userId) => {
    const user = await db.oneOrNone(
      'SELECT * FROM users WHERE user_id = $1',
      [userId]
    );
    return user;
  };

  // Function to find a user by username
  const getUserByUsername = async (username) => {
    const user = await db.oneOrNone(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return user;
  };

  // Function to delete a user (optional)
  const deleteUser = async (userId) => {
    await db.none(
      'DELETE FROM users WHERE user_id = $1',
      [userId]
    );
  };

  return {
    getFavorites,
    addFavorite,
    removeFavorite,
    searchMovies,
    createUser,
    getUserById,
    getUserByUsername,
    deleteUser, 
    getPopularMovies
  };
}
