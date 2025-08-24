import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const PasswordResetConfirmForm = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== passwordConfirm) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      await api.post('/users/password/reset/confirm/', { uid, token, new_password: newPassword });
      toast.success('Password reset successfully. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Reset failed. Please try again.');
    }
  };

  if (!uid || !token) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md text-center text-red-600">
        Invalid or missing reset token.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Set New Password</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold" htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full p-2 border rounded mb-4"
          autoComplete="new-password"
        />

        <label className="block mb-2 font-semibold" htmlFor="passwordConfirm">Confirm New Password</label>
        <input
          id="passwordConfirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          minLength={8}
          className="w-full p-2 border rounded mb-6"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordResetConfirmForm;
