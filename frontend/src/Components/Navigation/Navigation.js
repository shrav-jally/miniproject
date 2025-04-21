import React from "react";
import styled from "styled-components";
import { menuItems } from "../../utils/menuItems";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';

const Navigation = ({ active, setActive }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleNavigation = (item) => {
    setActive(item.id);
    navigate(item.link);
    setIsMenuOpen(false);
  };

  return (
    <NavStyled darkMode={darkMode}>
      <div className="user-container">
        <div className="avatar-container">
          <img 
            src={user?.picture || "https://img.icons8.com/bubbles/100/user.png"}
            alt="User Avatar" 
            className="avatar"
          />
          <h4>Welcome, {user?.username || "User"}</h4>
        </div>
        <div className="nav-controls">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars />
          </button>
        </div>
      </div>
      <ul className={`menu-items ${isMenuOpen ? 'open' : ''}`}>
        {menuItems.map((item) => {
          return (
            <li
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={active === item.id ? "active" : ""}
            >
              {item.icon}
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
      <div className="bottom-nav">
        <button onClick={() => {
          logout();
          navigate('/');
        }} className="logout-btn">
          Sign Out
        </button>
      </div>
    </NavStyled>
  );
};

const NavStyled = styled.nav`
  padding: 2rem 1.5rem;
  width: 374px;
  height: 100%;
  background: var(--sidebar-bg);
  border: 3px solid #FFFFFF;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  transition: all 0.3s ease;

  .user-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .avatar-container {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }

      h4 {
        color: var(--text-color);
      }
    }

    .nav-controls {
      display: flex;
      gap: 1rem;

      button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;

        &:hover {
          background: var(--border-color);
        }
      }
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--text-color);
      padding: 0.8rem 1rem;
      border-radius: 8px;

      &:hover {
        background: var(--border-color);
      }

      &.active {
        background: var(--primary-color);
        color: white;
      }
    }
  }

  .bottom-nav {
    .logout-btn {
      width: 100%;
      padding: 0.8rem;
      background: var(--color-accent);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #e84d76;
      }
    }
  }

  .menu-toggle {
    display: none;
  }

  @media (max-width: 968px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    padding: 1rem;
    border-radius: 0;
    z-index: 100;

    .menu-toggle {
      display: block;
    }

    .menu-items {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: var(--sidebar-bg);
      padding: 1rem;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;

      &.open {
        display: flex;
      }
    }

    .bottom-nav {
      display: none;
    }
  }
`;

export default Navigation;
