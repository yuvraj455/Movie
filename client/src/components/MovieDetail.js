import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://moviehub-hfvs.onrender.com/api/movies/${id}`, {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="movie-detail-container">
      <h2>{movie.title}</h2>
      <img src={movie.image} alt={movie.title} className="movie-detail-image" />
      <p><strong>Description:</strong> {movie.description}</p>
      <p><strong>Review:</strong> {movie.review}</p>
      <p><strong>Rating:</strong> {movie.rating} / 5</p>
    </div>
  );
};

export default MovieDetail;