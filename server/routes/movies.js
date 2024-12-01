const express = require('express');
const multer = require('multer');
const path = require('path');
const Movie = require('../models/Movie');
const router = express.Router();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Create a new movie
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
  const { title, description, review, rating } = req.body;

  if (!title || !description || !review || !rating) {
    return res.status(400).json({ message: 'Title, description, review, and rating are required' });
  }

  try {
    const newMovie = new Movie({
      title,
      description,
      review,
      rating,
      image: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null,
      createdBy: req.user._id,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error creating movie:', error.message);
    res.status(500).json({ message: 'Failed to create movie. Please try again.', error: error.message });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().populate('createdBy', 'username'); // Populate the creator info if necessary
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ message: 'Failed to fetch movies. Please try again.', error: error.message });
  }
});

// Get a single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error.message);
    res.status(500).json({ message: 'Failed to fetch movie. Please try again.', error: error.message });
  }
});

// Update a movie by ID
router.put('/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  const { title, description, review, rating } = req.body;

  if (!title || !description || !review || !rating) {
    return res.status(400).json({ message: 'Title, description, review, and rating are required' });
  }

  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the user is authorized to update the movie
    if (movie.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this movie' });
    }

    // Update movie fields
    movie.title = title;
    movie.description = description;
    movie.review = review;
    movie.rating = rating;

    // Update the movie image if a new file is uploaded
    if (req.file) {
      movie.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedMovie = await movie.save();
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error.message);
    res.status(500).json({ message: 'Failed to update movie now. Please try again.', error: error.message });
  }
});

// Delete a movie by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Debugging: Log user and movie ownership
    console.log("User ID:", req.user._id);
    console.log("Movie Owner ID:", movie.createdBy.toString());

    if (movie.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this movie' });
    }

    // Use deleteOne instead of remove
    await Movie.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error.message);
    res.status(500).json({ message: 'Failed to delete movie. Please try again.', error: error.message });
  }
});

// Serve static files for uploaded images
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
