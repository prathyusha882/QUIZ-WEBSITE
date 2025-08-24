import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-700 text-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-indigo-300">
          Quiz Website
        </Link>

        <nav className="space-x-6 text-white font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'underline' : 'hover:text-indigo-300'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive ? 'underline' : 'hover:text-indigo-300'
            }
          >
            Leaderboard
          </NavLink>
          {user ? (
            <>
              <span className="mr-4">Hello, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'underline' : 'hover:text-indigo-300'
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? 'underline' : 'hover:text-indigo-300'
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
