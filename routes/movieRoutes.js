// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
} = require('../controllers/movieController');
const { protect,admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Protected routes (only admin can create/update/delete)
router.post('/', protect,admin, createMovie);
router.put('/:id', protect,admin, updateMovie);
router.delete('/:id', protect,admin, deleteMovie);

module.exports = router;
