import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
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
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching movie details');
        setLoading(false);
        console.error('Error fetching movie details:', err);
      }
    };

    fetchMovie();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://movie-tfrt.onrender.com/api/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/');
      } catch (error) {
        console.error('Error deleting movie:', error);
        setError('Failed to delete movie. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="movie-detail">
      <h2>{movie.title}</h2>
      <img src={movie.image} alt={movie.title} className="movie-image" />
      <p><strong>Description:</strong> {movie.description}</p>
      <p><strong>Review:</strong> {movie.review}</p>
      <p><strong>Rating:</strong> {movie.rating} / 5</p>
      <p><strong>Added by:</strong> {movie.createdBy.name}</p>
      {user && user.id === movie.createdBy._id && (
        <div className="movie-actions">
          <button onClick={() => navigate(`/edit-movie/${id}`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;