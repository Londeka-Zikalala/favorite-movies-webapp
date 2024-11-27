import { Navigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap"; 
import axios from "axios";

const Favorites = ({ favorites, isLoggedIn,setFavorites}) => {
  const handleRemoveFavorite = async (movieId) => {
    try {
      const response = await axios.post("/favorites/remove", { id: movieId });

      if (response.status === 200) {
        // Update the local state by filtering out the removed movie
        setFavorites((prevFavorites) =>
          prevFavorites.filter((movie) => movie.id !== movieId)
        );
      } else {
        throw new Error("Failed to remove favorite");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove favorite. Please try again.");
    }
  };

  if (!isLoggedIn) {
    alert("You must be logged in to access favorites!");
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-center">No favorite movies yet!</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {favorites.map((movie) => (
            <div key={movie.id} className="col">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} Poster`}
                />
            
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                      {/* Remove button */}
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFavorite(movie.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
