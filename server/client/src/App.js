import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import Orb from "./Components/Orb/Orb";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import FinancialAdvisor from "./Components/FinancialAdvisor/FinancialAdvisor";
import Homepage from "./Components/Homepage/Homepage";
import { useGlobalContext } from "./context/globalContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import AuthCallback from "./Components/Auth/AuthCallback";
import { GlobalStyle } from "./styles/GlobalStyle";
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

// Main App Content
const AppContent = () => {
  const [active, setActive] = useState(2);
  const global = useGlobalContext();
  const { user } = useAuth();

  const displayData = () => {
    switch (active) {
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      case 5:
        return <FinancialAdvisor />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>{displayData()}</main>
      </MainLayout>
    </AppStyled>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AppContent />
                </PrivateRoute>
              }
            />
            <Route
              path="/income"
              element={
                <PrivateRoute>
                  <AppContent />
                </PrivateRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <PrivateRoute>
                  <AppContent />
                </PrivateRoute>
              }
            />
            <Route
              path="/financial-advisor"
              element={
                <PrivateRoute>
                  <AppContent />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  position: relative;
  main {
    flex: 1;
    background: var(--card-bg);
    border: 3px solid var(--border-color);
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }

  @media (max-width: 968px) {
    main {
      margin-top: 80px;
    }
  }
`;

export default App;
