import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EditMovie = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://movie-tfrt.onrender.com/api/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const movie = response.data;
        setTitle(movie.title);
        setDescription(movie.description);
        setReview(movie.review);
        setRating(movie.rating);
        setLoading(false);
      } catch (err) {
        setError('Error fetching movie details');
        setLoading(false);
        console.error('Error fetching movie details:', err);
      }
    };

    fetchMovie();
  }, [id]);

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
      await axios.put(`https://movie-tfrt.onrender.com/api/movies/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      navigate(`/movie/${id}`);
    } catch (error) {
      console.error('Error updating movie:', error);
      setError('Failed to update movie. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-movie-form">
      <h2>Edit Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <textarea
          placeholder="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">Update Movie</button>
      </form>
    </div>
  );
};

export default EditMovie;