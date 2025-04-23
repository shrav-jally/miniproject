import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';

const RegisterSuccess = () => {
  const location = useLocation();
  const { message, email } = location.state || {
    message: 'Registration successful! Please check your email to verify your account.',
    email: ''
  };

  return (
    <SuccessStyled>
      <div className="success-container">
        <div className="success-content">
          <h2>Registration Successful!</h2>
          <div className="success-message">
            <img src="https://img.icons8.com/fluency/96/mail.png" alt="Email" />
            <p>{message}</p>
            {email && (
              <p className="email-sent">
                We've sent a verification email to: <strong>{email}</strong>
              </p>
            )}
          </div>
          <div className="instructions">
            <h3>Next steps:</h3>
            <ol>
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Once verified, you can log in to your account</li>
            </ol>
          </div>
          <div className="actions">
            <Link to="/login" className="login-link">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </SuccessStyled>
  );
};

const SuccessStyled = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(252, 246, 249, 0.78);

  .success-container {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    text-align: center;
  }

  .success-content {
    h2 {
      color: #222260;
      margin-bottom: 2rem;
    }
  }

  .success-message {
    margin-bottom: 2rem;
    
    img {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
    }

    p {
      color: #2ABF4A;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .email-sent {
      color: #666;
      font-size: 0.9rem;
      
      strong {
        color: #222260;
      }
    }
  }

  .instructions {
    text-align: left;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fc;
    border-radius: 10px;

    h3 {
      color: #222260;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    ol {
      color: #666;
      padding-left: 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }
    }
  }

  .actions {
    .login-link {
      display: inline-block;
      padding: 0.8rem 2rem;
      background: #222260;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: #2a2a7c;
        transform: translateY(-2px);
      }
    }
  }
`;

export default RegisterSuccess; 