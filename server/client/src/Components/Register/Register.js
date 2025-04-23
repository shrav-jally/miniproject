import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

// Declare google as a global variable for ESLint
/* global google */

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "596079188368-2hh5360q26vpb2c4dv9tm3vv3v4jsiso.apps.googleusercontent.com";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register, loginWithGoogle, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [googleError, setGoogleError] = useState(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRequirements(requirements);
    return requirements;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate password
    const requirements = validatePassword(formData.password);
    if (!Object.values(requirements).every(Boolean)) {
      setError("Password does not meet all requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
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
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      if (!response?.credential) {
        setGoogleError("Failed to get Google credentials");
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
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error(data.message || "Google login failed");
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setGoogleError("Google login failed. Please try again later.");
    }
  };

  useEffect(() => {
    // Load Google Sign-In script if not already loaded
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = initializeGoogleSignIn;
    } else if (window.google?.accounts) {
      initializeGoogleSignIn();
    }

    return () => {
      if (window.google?.accounts) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { 
          theme: "outline", 
          size: "large",
          width: "100%",
          text: "signup_with",
          shape: "rectangular",
        }
      );
    }
  };

  return (
    <RegisterStyled>
      <div className="register-container">
        <div className="register-content">
          <h2>Create your account</h2>
          {error && <div className="error-message">{error}</div>}
          {googleError && <div className="error-message">{googleError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-control">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            <div className="input-control">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="input-control">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
              />
              <div className="password-requirements">
                <p className={passwordRequirements.length ? "met" : ""}>
                  ✓ At least 6 characters
                </p>
                <p className={passwordRequirements.uppercase ? "met" : ""}>
                  ✓ One uppercase letter
                </p>
                <p className={passwordRequirements.number ? "met" : ""}>
                  ✓ One number
                </p>
                <p className={passwordRequirements.special ? "met" : ""}>
                  ✓ One special character
                </p>
              </div>
            </div>
            <div className="input-control">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Register</button>
          </form>
          <div className="divider">
            <span>OR</span>
          </div>
          <div id="google-signin-button"></div>
          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </RegisterStyled>
  );
};

const RegisterStyled = styled.div`
  min-height: 100vh;
  background: var(--bg-light);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  .register-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    padding: 2rem;
  }

  .register-content {
    h2 {
      text-align: center;
      color: var(--primary-color);
      margin-bottom: 2rem;
      font-size: 2rem;
    }
  }

  .input-control {
    margin-bottom: 1.5rem;

    input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e6e6e6;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        border-color: var(--primary-color);
        outline: none;
      }
    }
  }

  .password-requirements {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;

    p {
      margin: 0.2rem 0;
      color: #ff4444;

      &.met {
        color: var(--primary-color);
      }
    }
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--primary-color-dark);
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
      background: #e6e6e6;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }

    span {
      background: white;
      padding: 0 1rem;
      color: #666;
      font-size: 0.9rem;
    }
  }

  .error-message {
    background: #ffe6e6;
    color: #ff4444;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .login-link {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;

    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default Register;
