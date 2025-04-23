import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(252, 246, 249, 0.78)'
            }}>
                <div style={{
                    padding: '20px',
                    borderRadius: '10px',
                    background: 'white',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render the protected component if authenticated
    return children;
};

export default PrivateRoute; 