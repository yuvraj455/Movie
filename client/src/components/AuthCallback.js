import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallback = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // You might want to verify the token here and set the user
      // For simplicity, we're just setting a dummy user object
      setUser({ id: 'google-user' });
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate, setUser]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;