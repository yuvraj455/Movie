import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './style.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null); // For handling errors
  const [successMessage, setSuccessMessage] = useState(''); // For success messages
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/movies', { withCredentials: true });
      setMovies(res.data);
    } catch (error) {
      setError('Error fetching movies'); // Set error state
      console.error('Error fetching movies:', error);
    }
  };

  const handleLearnMore = (id) => {
    navigate(`/movie/${id}`); // Navigate to the movie detail page
  };

  // Function to render the stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '⭐' : '☆'); // Full star for rating, empty star for remaining
    }
    return stars.join(''); // Join the stars as a string
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
      {/* Header Section */}
      <div className="header">
        <h1>Movie Recommendations & Reviews</h1>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#e53e3e',
            color: 'white',
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '8px',
          }}
        >
          <strong>{error}</strong>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            backgroundColor: '#38a169',
            color: 'white',
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '8px',
          }}
        >
          <strong>{successMessage}</strong>
        </div>
      )}

      {/* Movie Grid Section */}
      <div className="movie-grid">
        {movies.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              color: '#4a5568',
            }}
          >
            No movies available
          </p>
        ) : (
          movies.map((movie) => (
            <div className="movie-card" key={movie._id}>
              {/* Movie Image */}
              <img
                src={movie.image || 'https://via.placeholder.com/280x420'} // Placeholder image if no movie image exists
                alt={movie.title}
                className="movie-image"
              />
              <div className="movie-info">
                <h2>{movie.title}</h2>
                <p>{movie.description}</p>

                {/* Movie Review and Rating */}
                <div>
                  <strong>Review:</strong>
                  <p>{movie.review || 'No review available'}</p>
                  <strong>Rating:</strong>
                  <p>{movie.rating ? renderStars(movie.rating) : 'No rating available'}</p>
                </div>
                     {/* Learn More Button */}
              <div className="button-container">
                <button
                  className="learn-more-button"
                  onClick={() => handleLearnMore(movie._id)}
                >
                  Learn More
                </button>
              </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

