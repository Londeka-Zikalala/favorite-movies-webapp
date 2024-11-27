function movieRoutes(favoriteMoviesDB) {
  // Search movies function 
  async function searchMovies(req, res, next) {
    try {
      const query = req.body.query;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
      }

      const results = await favoriteMoviesDB.searchMovies(query);
      res.json({ results });  
    } catch (error) {
      console.error('Error searching movies:', error.message);
      res.status(500).json({ error: 'Failed to search for movies.' });
      next(error);
    }
  }
  // Popular movies 

  async function popularMovies(req,res,next) {
    try{
      const results = await favoriteMoviesDB.getPopularMovies();
      console.log(results)
      res.json({results});

    }
    catch(error){
      console.error('Error fetching movies:', error)
      res.status(500).json({error: 'Failed to fetch movies'})
      next(error)
    }
  }

// List favorite movies function
async function listFavorites(req, res, next) {
  try {
    const userId = req.session.userId; 
    if (!userId) {
      return res.status(401).json({ error: 'You must be logged in to view favorites.' });
    }

    const favorites = await favoriteMoviesDB.getFavorites(userId);
    res.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ error: 'Failed to fetch favorites.' });
    next(error);
  }
}


  // Add a favorite movie function
async function addFavorite(req, res, next) {
  try {
    const userId = req.session.userId; 
    const { movieId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'You must be logged in to add favorites.' });
    }

    if (!movieId) {
      return res.status(400).json({ error: 'Incomplete information. Movie ID is required.' });
    }

    await favoriteMoviesDB.addFavorite(userId, movieId);
    res.json({ message: 'Movie added to favorites.' });
  } catch (error) {
    console.error('Error adding to favorites:', error.message);
    res.status(500).json({ error: 'Failed to add movie to favorites.' });
    next(error);
  }
}


  // Remove a favorite movie function
async function removeFavorite(req, res, next) {
  try {
    const userId = req.session.userId; 
    const { movieId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'You must be logged in to remove favorites.' });
    }

    if (!movieId) {
      return res.status(400).json({ error: 'Incomplete information. Movie ID is required.' });
    }

    await favoriteMoviesDB.removeFavorite(userId, movieId);
    res.json({ message: 'Movie removed from favorites.' });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({ error: 'Failed to remove movie from favorites.' });
    next(error);
  }
}

  /*** User Routes */

// Signup function 
async function signup(req, res, next) {
  try {
    const { username, password } = req.body;
    // console.log(username, password)
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const existingUser = await favoriteMoviesDB.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const userId = await favoriteMoviesDB.createUser(username, password);
    res.json({ userId });
  } catch (error) {
    console.error('Error signing up:', error.message);
    res.status(500).json({ error: 'Failed to sign up' });
    next(error);
  }
}

// Login function 
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await favoriteMoviesDB.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "User does not exist." });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    req.session.userId = user.user_id;
    res.json({ userId: user.user_id });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Failed to log in." });
    next(error);
  }
}


// Logout function 
async function logout(req, res, next) {
  try {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error.message);
    res.status(500).json({ error: 'Failed to log out' });
    next(error);
  }
}

  return {
    searchMovies,
    listFavorites,
    addFavorite,
    removeFavorite,
    signup,
    login,
    logout, 
    popularMovies
  };
}

export default movieRoutes;
