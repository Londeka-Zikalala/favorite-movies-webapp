import assert from 'assert';
import db from '../db/db.js';
import FavoriteMoviesDB from '../service/FavoriteMovies.js';

describe('FavoriteMoviesDB', function() {
    let favoriteMoviesDB;
    let testUserId;
    let testMovieId;

    this.timeout(5000);

    before(async function() {
        favoriteMoviesDB = FavoriteMoviesDB();

        //  clear table data 
        await db.none('TRUNCATE favorites, users, movies RESTART IDENTITY CASCADE');

        // Create a test user
        const userResult = await db.one(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id',
            ['testuser', 'password123']
        );
        testUserId = userResult.user_id;

        // Create a test movie
        const movieResult = await db.one(
            'INSERT INTO movies (id, title, release_date, overview, poster_path) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            ['1', 'Test Movie', '2014-10-30', '', '']
        );
        testMovieId = movieResult.id;
    });

    describe('getFavorites', function() {
        it('should return an empty list if the user has no favorite movies', async function() {
            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 0);
        });

        it('should return a list of favorite movies for the user', async function() {
            await favoriteMoviesDB.addFavorite(testUserId, testMovieId);

            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 1);
            assert.strictEqual(favorites[0].title, 'Test Movie');

            await favoriteMoviesDB.removeFavorite(testUserId, testMovieId);
        });
    });

    describe('addFavorite', function() {
        it('should add a movie to the user’s favorites', async function() {
            const movieResult2 = await db.one(
                'INSERT INTO movies (id, title, release_date, overview, poster_path) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                ['2', 'Test Movie2', '2014-10-30', '', '']
            );
           let testMovieId2 = movieResult2.id;
            await favoriteMoviesDB.addFavorite(testUserId, testMovieId2);
                console.log(testUserId, movieResult2)
            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 1);

            await favoriteMoviesDB.removeFavorite(testUserId, testMovieId);
        });
    });

    describe('removeFavorite', function() {
        it('should remove a movie from the user’s favorites', async function() {
            await favoriteMoviesDB.addFavorite(testUserId, testMovieId);
            await favoriteMoviesDB.removeFavorite(testUserId, testMovieId);

            const favorites = await favoriteMoviesDB.getFavorites(testUserId);
            assert.strictEqual(favorites.length, 1);
        });
    });

    /*** USER FUNCTIONS TESTS ***/
    
    describe('createUser', function() {
        it('should create a new user and return the user ID', async function() {
            const newUserId = await favoriteMoviesDB.createUser('newTestUser', 'newPassword123');
            assert.ok(newUserId);

            // Cleanup the newly created user
            await favoriteMoviesDB.deleteUser(newUserId);
        });
    });

    describe('getUserById', function() {
        it('should return user information by user ID', async function() {
            const user = await favoriteMoviesDB.getUserById(testUserId);
            assert.strictEqual(user.username, 'testuser');
        });
    });

    describe('getUserByUsername', function() {
        it('should return user information by username', async function() {
            const user = await favoriteMoviesDB.getUserByUsername('testuser');
            assert.strictEqual(user.user_id, testUserId);
        });
    });

    describe('deleteUser', function() {
        it('should delete a user from the database', async function() {
            const tempUserId = await favoriteMoviesDB.createUser('tempUser', 'tempPassword123');
            await favoriteMoviesDB.deleteUser(tempUserId);

            const deletedUser = await favoriteMoviesDB.getUserById(tempUserId);
            assert.strictEqual(deletedUser, null);
        });
    });
});
