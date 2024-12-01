import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';  // Importing the custom CSS for styling

const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);  // State for storing image file
  const [review, setReview] = useState('');  // State for movie review
  const [rating, setRating] = useState('');  // State for movie rating
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('review', review);
    formData.append('rating', rating);

    if (image) {
      formData.append('image', image);  // Append the image file to FormData
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/movies',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Movie added:', response.data);
      navigate('/'); // Redirect to homepage after successful submission
    } catch (error) {
      console.error('Error adding movie:', error);
      setError(error.response?.data?.message || 'Failed to add movie. Please try again.');
    }
  };

  return (
<div className="add-movie-container">
  <div className="add-movie-card">
    <h2 className="add-movie-title">Add New Movie</h2>
    {error && <p className="add-movie-error">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="add-movie-form-group">
        <label htmlFor="title" className="add-movie-label">Name:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="add-movie-input"
        />
      </div>
      <div className="add-movie-form-row">
        <div className="add-movie-form-group">
          <label htmlFor="description" className="add-movie-label">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="add-movie-textarea"
          ></textarea>
        </div>
        <div className="add-movie-form-group">
          <label htmlFor="review" className="add-movie-label">Review:</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            className="add-movie-textarea"
            placeholder="Write your review here"
          ></textarea>
        </div>
      </div>
      <div className="add-movie-form-row">
      <div className="add-movie-form-group">
        <label htmlFor="rating" className="add-movie-label">Rating (1-5):</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
          className="add-movie-input"
          placeholder="Rate the movie (1-5)"
        />
      </div>
      <div className="add-movie-form-group">
        <label htmlFor="image" className="add-movie-label">Movie Image:</label>
        <input
          type="file"
          id="image"
          required
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          className="add-movie-file-input"
        />
      </div>
      </div>
      <button type="submit" className="add-movie-button">
        Add Movie
      </button>
    </form>
  </div>
</div>
  );
};

export default AddMovie;