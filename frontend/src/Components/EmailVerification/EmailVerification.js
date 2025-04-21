import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const EmailVerification = () => {
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                
                if (!token) {
                    setStatus('error');
                    setMessage('Invalid verification link');
                    return;
                }

                const isLoginVerification = location.pathname.includes('verify-login');
                const endpoint = isLoginVerification ? '/verify-login' : '/verify-email';

                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth${endpoint}/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);
                    
                    // Store the token and update auth context
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        await login(data.token);
                        
                        // Redirect after 3 seconds
                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 3000);
                    } else {
                        throw new Error('No token received from server');
                    }
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('An error occurred during verification');
            }
        };

        verifyEmail();
    }, [location, navigate, login]);

    return (
        <VerificationStyled>
            <div className="verification-container">
                <div className={`verification-content ${status}`}>
                    <div className="status-icon">
                        {status === 'verifying' && '⏳'}
                        {status === 'success' && '✅'}
                        {status === 'error' && '❌'}
                    </div>
                    <h2>{message}</h2>
                    {status === 'success' && (
                        <p>Redirecting to dashboard...</p>
                    )}
                    {status === 'error' && (
                        <button onClick={() => navigate('/login')}>
                            Return to Login
                        </button>
                    )}
                </div>
            </div>
        </VerificationStyled>
    );
};

const VerificationStyled = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(252, 246, 249, 0.78);

    .verification-container {
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
    }

    .verification-content {
        .status-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        h2 {
            color: #222260;
            margin-bottom: 1rem;
        }

        p {
            color: #666;
            margin-bottom: 1rem;
        }

        button {
            background: #222260;
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;

            &:hover {
                background: #2a2a7c;
            }
        }

        &.verifying .status-icon {
            animation: spin 2s linear infinite;
        }

        &.success {
            h2 {
                color: #28a745;
            }
        }

        &.error {
            h2 {
                color: #dc3545;
            }
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export default EmailVerification; 