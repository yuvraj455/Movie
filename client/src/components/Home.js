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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      console.log("Attempting to delete movie with ID:", id);  // Debugging the ID
      try {
        const response = await axios.delete(`http://localhost:5000/api/movies/${id}`, { withCredentials: true });
        if (response.status === 200) {
          setSuccessMessage('Movie deleted successfully!');
          fetchMovies(); // Refresh the movie list after deletion
        }
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Error deleting movie');
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleEdit = (id) => {
    if (user) {
      navigate(`/edit-movie/${id}`);
    } else {
      navigate('/login');
    }
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
    <div
      style={{
        backgroundColor: '#f8fafc',
        padding: '2rem',
        maxWidth: '1200px',
        margin: 'auto',
        borderRadius: '10px',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2d3748',
          marginBottom: '2rem',
        }}
      >
        Movie Recommendations & Reviews
      </h1>

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
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
            <div
              key={movie._id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Movie Image */}
              <img
                src={movie.image || 'https://via.placeholder.com/280x420'} // Placeholder image if no movie image exists
                alt={movie.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                }}
              />
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1a202c',
                  marginBottom: '0.5rem',
                }}
              >
                {movie.title}
              </h2>
              <p style={{ color: '#4a5568', marginBottom: '1rem' }}>{movie.description}</p>

              {/* Movie Review and Rating */}
              <div style={{ marginBottom: '1rem' }}>
                <strong>Review:</strong>
                <p style={{ color: '#4a5568' }}>{movie.review || 'No review available'}</p>
                <strong>Rating:</strong>
                <p style={{ color: '#4a5568' }}>
                  {movie.rating ? renderStars(movie.rating) : 'No rating available'}
                </p>
              </div>

              {user && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => handleEdit(movie._id)}
                    style={{
                      backgroundColor: '#3182ce',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = '#2c5282')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = '#3182ce')
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id)}
                    style={{
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = '#c53030')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = '#e53e3e')
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
