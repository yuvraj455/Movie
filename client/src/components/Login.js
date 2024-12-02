import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        alert('Login failed, please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://movie-tfrt.onrender.com/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        <div className="google-login">
          <button onClick={handleGoogleLogin} className="google-button">
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;