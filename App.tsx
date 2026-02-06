
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsControlPage from './pages/LeadsControlPage';
import ContactPage from './pages/ContactPage';
import ConfigurationPage from './pages/ConfigurationPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Authenticated Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leadsControl" element={<LeadsControlPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
