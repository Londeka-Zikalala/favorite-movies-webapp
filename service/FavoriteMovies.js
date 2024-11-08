import db from "db.js"

export default function FavoriteMoviesDB(){
// Function to get user's favorite movies
const getFavorites = async (userId) => {
  const result = await db.manyOrNone(
    'SELECT movies.* FROM favorites JOIN movies ON favorites.movie_id = movies.movie_id WHERE favorites.user_id = $1',
    [userId]
  );
  return result.rows;
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

return{
    getFavorites,
    addFavorite,
    removeFavorite
}
}