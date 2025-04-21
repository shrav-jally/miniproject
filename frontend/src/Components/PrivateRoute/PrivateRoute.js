import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    
    // If there's no user, redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If there is a user, render the protected component
    return children;
};

export default PrivateRoute; 