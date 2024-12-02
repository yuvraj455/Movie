import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallback = () => {
  const { loginWithToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      loginWithToken(token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, loginWithToken, navigate]);

  return <div>Processing login...</div>;
};

export default AuthCallback;