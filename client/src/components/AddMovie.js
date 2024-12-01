import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);  // State for storing image file
  const [review, setReview] = useState('');  // State for movie review
  const [rating, setRating] = useState('');  // State for movie rating
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('review', review);
    formData.append('rating', rating);

    if (image) {
      formData.append('image', image);  // Append the image file to FormData
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/movies',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Movie added:', response.data);
      navigate('/'); // Redirect to homepage after successful submission
    } catch (error) {
      console.error('Error adding movie:', error);
      setError(error.response?.data?.message || 'Failed to add movie. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Add New Movie</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Name:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="review" className="block mb-1">Review:</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Write your review here"
          ></textarea>
        </div>
        <div>
          <label htmlFor="rating" className="block mb-1">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Rate the movie (1-5)"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">Movie Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
