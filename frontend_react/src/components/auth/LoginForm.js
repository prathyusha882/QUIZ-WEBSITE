import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username: usernameOrEmail, password });
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Quiz Website Login</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold" htmlFor="usernameOrEmail">Username or Email</label>
        <input
          id="usernameOrEmail"
          type="text"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
          autoComplete="username"
        />
        <label className="block mb-2 font-semibold" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-6"
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        New user? <a className="text-indigo-600 hover:underline" href="/signup">Sign up</a>
      </p>
      <p className="mt-2 text-center text-gray-600">
        <a className="text-indigo-600 hover:underline" href="/password-reset">Forgot Password?</a>
      </p>
    </div>
  );
};

export default LoginForm;
