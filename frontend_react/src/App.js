import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import ErrorBoundary from './components/shared/ErrorBoundary';

import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import PasswordResetRequestForm from './components/auth/PasswordResetRequestForm';
import PasswordResetConfirmForm from './components/auth/PasswordResetConfirmForm';

import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import QuizPage from './pages/QuizPage';
import Leaderboard from './pages/Leaderboard';
import ResultsPage from './pages/ResultsPage';
import ResultsDetailPage from './pages/ResultsDetailPage';

import Watermark from './components/shared/Watermark';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { user } = useAuth();
  const watermarkText = user
    ? `${user.username} | ${user.email ?? ''} | ${user.phone ?? ''}`
    : '';

  return (
    // Use a relative wrapper to allow Watermark's fixed positioning
    <div style={{ position: 'relative' }}>
      {user && <Watermark text={watermarkText} />}
      <Header />
      <ErrorBoundary>
        <main className="min-h-[calc(100vh-6rem)] bg-gray-50 pt-6 pb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/password-reset" element={<PasswordResetRequestForm />} />
            <Route path="/password-reset-confirm" element={<PasswordResetConfirmForm />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:id"
              element={
                <ProtectedRoute>
                  <ResultsDetailPage />
                </ProtectedRoute>
              }
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </ErrorBoundary>
      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
