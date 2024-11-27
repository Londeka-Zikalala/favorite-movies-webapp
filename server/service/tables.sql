-- Users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL 
);
-- Movies from TMBD
CREATE TABLE movies (
  id INT PRIMARY KEY, 
  title VARCHAR(255) NOT NULL,
  release_date DATE,
  overview TEXT,
  poster_path VARCHAR(255)
);
-- Favorite movies table
CREATE TABLE favorites (
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, movie_id)
);
