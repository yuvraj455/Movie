import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './style.css';

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Movie ID from the URL
  const location = useLocation(); // To access passed state

  useEffect(() => {
    fetchMovieDetail();
  }, [id]);

  const fetchMovieDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/movies/${id}`, { withCredentials: true });
      setMovie(res.data);
    } catch (error) {
      setError('Error fetching movie details');
      console.error('Error fetching movie details:', error);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      setError('You are not authorized to delete the movie');
      return;
    }
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/movies/${id}`, { withCredentials: true });
        if (response.status === 200) {
          navigate('/'); // Redirect to home after successful deletion
        }
      } catch (error) {
        setError('You are not authorized to delete this movie');
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-movie/${id}`);
  };

  return (
    <div className="movie-detail">
      

      {movie && (
        <div className="movie-container">
          <div className="movie-poster">
            <img
              src={movie.image || 'https://via.placeholder.com/300x450'}
              alt={movie.title}
              className="movie-image"
            />
          </div>
          <div className="movie-content">
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <div className="review">
              <p><strong>Review:</strong> {movie.review || 'No review available'}</p>
            </div>
            <div className="rating">
              <p><strong>Rating:</strong> {movie.rating ? `${movie.rating} / 5` : 'No rating available'}</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {location.state?.errorMessage && (
              <div className="error-message">{location.state.errorMessage}</div>
            )}

            {user && (
              <div className="button-container">
                <button className="edit-button" onClick={handleEdit}>Edit</button>
                <button className="delete-button" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
