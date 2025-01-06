import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db/db.js';
import FavoriteMoviesDB from './service/FavoriteMovies.js';
import movieRoutes from './routes/moviesRoutes.js';


const app = express();
const port = process.env.PORT || 3010;

const favoriteMoviesDB = FavoriteMoviesDB(db);

app.use(express.json()); 
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const routes = movieRoutes(favoriteMoviesDB);


app.post('/movies/search', routes.searchMovies);
app.get('/favorites', routes.listFavorites);
app.post('/favorites', routes.addFavorite);
app.post('/favorites/remove', routes.removeFavorite);
app.post("/signup", routes.signup);
app.post('/login', routes.login);
app.post('/logout', routes.logout);
app.get('/movies/popular', routes.popularMovies)

app.listen(port, () => {
  console.log(`Server started on PORT 3010`);
});
