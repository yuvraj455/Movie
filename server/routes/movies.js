const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
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
      image: req.file ? `https://movie-tfrt.onrender.com/uploads/${req.file.filename}` : null,
      createdBy: req.user.id,
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
    const movies = await Movie.find().populate('createdBy', 'username');
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

// Update a movie
router.put('/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  const { title, description, review, rating } = req.body;

  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (movie.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this movie' });
    }

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.review = review || movie.review;
    movie.rating = rating || movie.rating;

    if (req.file) {
      movie.image = `https://movie-tfrt.onrender.com/uploads/${req.file.filename}`;
    }

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error.message);
    res.status(500).json({ message: 'Failed to update movie. Please try again.', error: error.message });
  }
});

// Delete a movie
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (movie.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this movie' });
    }

    await movie.remove();
    res.json({ message: 'Movie removed' });
  } catch (error) {
    console.error('Error deleting movie:', error.message);
    res.status(500).json({ message: 'Failed to delete movie. Please try again.', error: error.message });
  }
});

module.exports = router;