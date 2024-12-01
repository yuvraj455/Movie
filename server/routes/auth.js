const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// Update a movie by ID
router.put('/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;

  // Validate input fields
  if (!title || !description) {
    return res.status(400).json({ message: 'Both title and description are required' });
  }

  try {
    // Find the movie by ID
    const movie = await Movie.findById(req.params.id);

    // Check if the movie exists
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Verify that the movie belongs to the logged-in user
    if (movie.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this movie' });
    }

    // Update the movie's fields
    movie.title = title;
    movie.description = description;

    // If a new image is uploaded, update the image URL
    if (req.file) {
      // Generate the image URL (assuming the image is stored in 'uploads' folder)
      movie.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Save the updated movie
    const updatedMovie = await movie.save();

    // Respond with the updated movie
    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error.message);
    res.status(500).json({ message: 'Failed to update the movie. Please try again.', error: error.message });
  }
});

module.exports = router;
