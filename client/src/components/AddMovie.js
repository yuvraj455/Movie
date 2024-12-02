import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('review', review);
    formData.append('rating', rating);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://moviehub-hfvs.onrender.com/api/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie. Please try again.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="add-movie-container">
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="review">Review:</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;