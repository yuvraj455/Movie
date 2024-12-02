import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EditMovie = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(1);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Change background color of the entire page
    document.body.style.backgroundColor = '#153448';

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMovie = async () => {
      try {
        const res = await axios.get(`https://movie-tfrt.onrender.com/api/movies/${id}`, { withCredentials: true });
        setTitle(res.data.title);
        setDescription(res.data.description);
        setReview(res.data.review || '');
        setRating(res.data.rating || 1);
        setCurrentImage(res.data.image || '');
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Failed to fetch movie data.');
        navigate('/'); // Redirect if movie data fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();

    // Cleanup: Reset background color when the component unmounts
    return () => {
      document.body.style.backgroundColor = ''; // Reset background color
    };
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !review || !rating) {
      setError('Title, description, review, and rating are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('review', review);
    formData.append('rating', rating);
    if (image) {
      formData.append('image', image); // Append new image if uploaded
    }

    try {
      const res = await axios.put(
        `https://movie-tfrt.onrender.com/api/movies/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        navigate('/'); // Redirect to home after successful edit
      }
    } catch (error) {
      console.error('Error updating movie:', error);

      if (error.response && error.response.status === 403) {
        setError('You are not authorized to update this movie.');
        navigate(`/movie/${id}`, { state: { errorMessage: 'You are not authorized to update this movie.' } });
        
      } else {
        setError('Failed to update movie.');
      }
    }
  };

  // Inline Styles
  const containerStyle = {
    maxWidth: '1500px',
    margin: '2rem auto',
    padding: '4rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',  // Row layout for left and right sections
    gap: '2rem',
  };

  const formTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const formInputStyle = {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    border: '1px solid #dcdcdc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const formTextareaStyle = {
    width: '100%',
    minHeight: '120px',
    padding: '1rem',
    fontSize: '1rem',
    border: '1px solid #dcdcdc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    resize: 'none',
  };

  const formSelectStyle = {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    border: '1px solid #dcdcdc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const formButtonStyle = {
    padding: '1rem',
    backgroundColor: '#3C5B6F',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const formButtonHoverStyle = {
    backgroundColor: '#346da3',
  };

 const errorStyle = {
  color: '#f8d7da', // Light red text color for error messages
  backgroundColor: '#070F2B', // Deep blue background
  border: '1px solid #1B1A55', // Darker blue border for the error message
  padding: '1rem',
  borderRadius: '8px',
  marginTop: '1rem',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};


  const loadingStyle = {
    color: '#333',
    textAlign: 'center',
    fontSize: '1.5rem',
  };

  const moviePosterStyle = {
    maxWidth: '500px',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Left Column: Movie Poster */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {currentImage && (
          <img src={currentImage} alt="Movie Poster" style={moviePosterStyle} />
        )}
      </div>

      {/* Right Column: Form to Edit Movie */}
      <div style={{ flex: 2 }}>
        <h1 style={formTitleStyle}>Edit Movie</h1>

        {/* Movie Title Editing */}
        <div style={formGroupStyle}>
          <label htmlFor="title">Movie Title:</label>
          <input
            type="text"
            id="title"
            style={formInputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description and Review */}
        <div style={formGroupStyle}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            style={formTextareaStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <label htmlFor="review">Review:</label>
          <textarea
            id="review"
            style={formTextareaStyle}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Rating */}
        <div style={formGroupStyle}>
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            style={formSelectStyle}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div style={formGroupStyle}>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            style={formInputStyle}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Submit Button */}
        <button
          style={formButtonStyle}
          onClick={handleSubmit}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#346da3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#3C5B6F')}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditMovie;
