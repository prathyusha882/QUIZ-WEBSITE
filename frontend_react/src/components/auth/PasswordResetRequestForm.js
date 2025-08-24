import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/password/reset/', { email });
      toast.success('If this email exists, a reset link has been sent.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Request failed. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold" htmlFor="email">Enter your registered email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-6"
          autoComplete="email"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default PasswordResetRequestForm;
