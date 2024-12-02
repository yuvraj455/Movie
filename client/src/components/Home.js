import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://movie-tfrt.onrender.com/api/movies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(res.data);
    } catch (error) {
      setError('Error fetching movies');
      console.error('Error fetching movies:', error);
    }
  };

  const handleLearnMore = (id) => {
    navigate(`/movie/${id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '⭐' : '☆');
    }
    return stars.join('');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div className="header">
        <h1>Movie Recommendations & Reviews</h1>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#e53e3e',
          color: 'white',
          padding: '1rem',
          marginBottom: '2rem',
          borderRadius: '8px',
        }}>
          <strong>{error}</strong>
        </div>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: '#38a169',
          color: 'white',
          padding: '1rem',
          marginBottom: '2rem',
          borderRadius: '8px',
        }}>
          <strong>{successMessage}</strong>
        </div>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{renderStars(movie.rating)}</p>
              <button onClick={() => handleLearnMore(movie._id)}>Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;