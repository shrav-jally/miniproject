import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers } from 'react-icons/fa';

const UserCount = () => {
  const [userCount, setUserCount] = useState(0);
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/user-count`);
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
    // Fetch user count every 5 minutes
    const interval = setInterval(fetchUserCount, 300000);

    return () => clearInterval(interval);
  }, [BACKEND_URL]);

  return (
    <UserCountStyled>
      <div className="count-container">
        <FaUsers className="users-icon" />
        <div className="count-info">
          <h3>{userCount}</h3>
          <p>Registered Users</p>
        </div>
      </div>
    </UserCountStyled>
  );
};

const UserCountStyled = styled.div`
  .count-container {
    background: var(--card-bg);
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .users-icon {
      font-size: 2rem;
      color: var(--color-accent);
    }

    .count-info {
      h3 {
        font-size: 1.5rem;
        color: var(--text-color);
        margin: 0;
      }

      p {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.9rem;
      }
    }
  }

  @media (max-width: 768px) {
    .count-container {
      padding: 0.8rem;
      
      .users-icon {
        font-size: 1.5rem;
      }

      .count-info {
        h3 {
          font-size: 1.2rem;
        }

        p {
          font-size: 0.8rem;
        }
      }
    }
  }
`;

export default UserCount; 