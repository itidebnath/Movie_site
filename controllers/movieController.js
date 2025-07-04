// controllers/movieController.js
const asyncHandler = require('express-async-handler');
const Movie = require('../models/Movie'); // Make sure file name is capitalized if that's how it's saved

// @desc    Fetch all movies
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find({});
  res.json(movies);
});

// @desc    Fetch single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Create a movie (Admin only)
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = asyncHandler(async (req, res) => {
  const {
    title,
    genre,
    description,
    releaseYear,
    rating,
    posterUrl,
    trailerUrl,
    cast
  } = req.body;

  const movie = new Movie({
    title,
    genre,
    description,
    releaseYear,
    rating,
    posterUrl,
    trailerUrl,
    cast
  });

  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
});

// @desc    Delete a movie (Admin only)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  if (!deletedMovie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  res.json({ message: 'Movie deleted successfully' });
});

// @desc    Update a movie (Admin only)
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
  const {
    title,
    genre,
    description,
    releaseYear,
    rating,
    posterUrl,
    trailerUrl,
    cast
  } = req.body;

  const movie = await Movie.findById(req.params.id);

  if (movie) {
    movie.title = title || movie.title;
    movie.genre = genre || movie.genre;
    movie.description = description || movie.description;
    movie.releaseYear = releaseYear || movie.releaseYear;
    movie.rating = rating || movie.rating;
    movie.posterUrl = posterUrl || movie.posterUrl;
    movie.trailerUrl = trailerUrl || movie.trailerUrl;
    movie.cast = cast || movie.cast;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
};
