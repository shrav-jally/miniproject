import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

// Declare google as a global variable for ESLint
/* global google */

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "596079188368-2hh5360q26vpb2c4dv9tm3vv3v4jsiso.apps.googleusercontent.com";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, loginWithGoogle, isAuthenticated, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleResponse = async (response) => {
    try {
      if (!response?.credential) {
        setError("Failed to get Google credentials");
        return;
      }

      const googleResponse = await fetch(`${BACKEND_URL}/api/v1/auth/google/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await googleResponse.json();

      if (googleResponse.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update authentication context
        setUser(data.user);
        setIsAuthenticated(true);
        
        // First redirect to homepage
        navigate('/');
        // Then redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(data.message || "Google login failed");
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError("Google login failed. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update authentication context
        setUser(data.user);
        setIsAuthenticated(true);
        
        // First redirect to homepage
        navigate('/');
        // Then redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    // Remove any existing Google Sign-In scripts
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Load the Google Sign-In script
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (window.google?.accounts) {
        window.google.accounts.id.cancel();
      }
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (isGoogleScriptLoaded && window.google?.accounts) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { 
            theme: "outline", 
            size: "large",
            width: "100%",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "center"
          }
        );
      } catch (err) {
        console.error("Error initializing Google Sign-In:", err);
        setError("Failed to initialize Google Sign-In");
      }
    }
  }, [isGoogleScriptLoaded]);

  return (
    <LoginStyled>
      <div className="login-container">
        <div className="login-content">
          <h2>Sign in to your account</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-control">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-control">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="submit-btn">
              <button type="submit">Sign in</button>
            </div>
          </form>
          <div className="divider">
            <span>OR</span>
          </div>
          <div className="google-btn">
            <div id="google-signin-button"></div>
          </div>
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </LoginStyled>
  );
};

const LoginStyled = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(252, 246, 249, 0.78);

  .login-container {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .login-content {
    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #222260;
    }
  }

  .input-control {
    margin-bottom: 1rem;

    input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #222260;
      }
    }
  }

  .submit-btn {
    button {
      width: 100%;
      padding: 0.8rem;
      background: #222260;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #2a2a7c;
      }
    }
  }

  .error-message {
    background: #ff6b6b;
    color: white;
    padding: 0.8rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .register-link {
    text-align: center;
    margin-top: 1rem;

    a {
      color: #222260;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .divider {
    text-align: center;
    margin: 1.5rem 0;
    position: relative;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 45%;
      height: 1px;
      background: #ddd;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }

    span {
      background: white;
      padding: 0 10px;
      color: #666;
      font-size: 0.9rem;
    }
  }

  .google-btn {
    margin-bottom: 1rem;
  }
`;

export default Login;
