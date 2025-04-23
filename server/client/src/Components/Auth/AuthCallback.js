import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      navigate('/login');
      return;
    }

    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      
      // Decode the JWT to get user info
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const user = JSON.parse(jsonPayload);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, location, setUser, setIsAuthenticated]);

  return (
    <CallbackStyled>
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Completing authentication...</p>
      </div>
    </CallbackStyled>
  );
};

const CallbackStyled = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(252, 246, 249, 0.78);

  .loading-container {
    text-align: center;

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #2ABF4A;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default AuthCallback; 