import assert from 'assert';
import db from '../db.js';
import FavoriteMoviesDB from '../FavoriteMoviesDB.js';

describe('FavoriteMoviesDB', function() {
    let favoriteMoviesDB;
    let testUserId;
    let testMovieId;

    before(async function() {
        favoriteMoviesDB = FavoriteMoviesDB(db);

        // create a user and a movie in the test database
        const userResult = await db.one('INSERT INTO users (username) VALUES ($1) RETURNING user_id', ['testuser']);
        testUserId = userResult.user_id;

        const movieResult = await db.one(
            'INSERT INTO movies (title, genre) VALUES ($1, $2) RETURNING movie_id',
            ['Test Movie', 'Action']
        );
        testMovieId = movieResult.movie_id;
    });

    after(async function() {
        //  delete the test user, movie, and any favorite records
        await db.none('DELETE FROM favorites WHERE user_id = $1', [testUserId]);
        await db.none('DELETE FROM users WHERE user_id = $1', [testUserId]);
        await db.none('DELETE FROM movies WHERE movie_id = $1', [testMovieId]);
    });

    describe('getFavorites', function() {
        it('should return an empty list if the user has no favorite movies', async function() {
            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 0);
        });

        it('should return a list of favorite movies for the user', async function() {
            // Add the movie to favorites 
            await favoriteMoviesDB.addFavorite(testUserId, testMovieId);

            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 1);
            assert.strictEqual(favorites[0].title, 'Test Movie');

            // Clean up
            await favoriteMoviesDB.removeFavorite(testUserId, testMovieId);
        });
    });

    describe('addFavorite', function() {
        it('should add a movie to the user’s favorites', async function() {
            await favoriteMoviesDB.addFavorite(testUserId, testMovieId);

            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 1);
            assert.strictEqual(favorites[0].movie_id, testMovieId);

            // Clean up
            await favoriteMoviesDB.removeFavorite(testUserId, testMovieId);
        });
    });

    describe('removeFavorite', function() {
        it('should remove a movie from the user’s favorites', async function() {
            // Add the movie to favorites
            await favoriteMoviesDB.addFavorite(testUserId, testMovieId);

            // Remove movie
            await favoriteMoviesDB.removeFavorite(testUserId, testMovieId);

            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 0);
        });
    });
});
