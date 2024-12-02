import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://movie-tfrt.onrender.com/api/movies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching movies');
        setLoading(false);
        console.error('Error fetching movies:', err);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home-container">
      <h1>Movie Reviews</h1>
      {user && (
        <Link to="/add-movie" className="add-movie-btn">
          Add New Movie
        </Link>
      )}
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <Link to={`/movie/${movie._id}`}>
              <img src={movie.image} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>Rating: {movie.rating}/5</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;