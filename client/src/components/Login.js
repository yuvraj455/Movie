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
        navigate('/'); // Redirect on success
      } else {
        alert('Login failed, please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google'; // Ensure this matches your backend route
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(90deg, rgba(56, 87, 242, 1) 0%, rgba(155, 48, 255, 1) 100%)' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#4c51bf', textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '1rem', marginBottom: '0.75rem' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e0', borderRadius: '8px', fontSize: '1rem', marginBottom: '0.75rem' }}
              required
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#3182ce', color: 'white', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2b6cb0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
          >
            Login
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={handleGoogleLogin}
            style={{ width: '100%', backgroundColor: '#e53e3e', color: 'white', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c53030'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
