import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, passwordConfirm } = formData;
    if (!username.trim() || !email.trim() || !password || !passwordConfirm) {
      toast.error('Please fill all fields.');
      return;
    }
    if (password !== passwordConfirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    try {
      await signup({ username, email, password });
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      const data = error?.response?.data || {};
      let msg = 'Registration failed.';
      if (data.email) msg = `Email: ${data.email.join(' ')}`;
      else if (data.username) msg = `Username: ${data.username.join(' ')}`;
      else if (data.password) msg = `Password: ${data.password.join(' ')}`;
      else if (data.non_field_errors) msg = data.non_field_errors.join(' ');
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Create a Quiz Website Account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-2 font-semibold" htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
          autoComplete="username"
          autoFocus
        />

        <label className="block mb-2 font-semibold" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
          autoComplete="email"
        />

        <label className="block mb-2 font-semibold" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full p-2 border rounded mb-4"
          autoComplete="new-password"
        />

        <label className="block mb-2 font-semibold" htmlFor="passwordConfirm">Confirm Password</label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full p-2 border rounded mb-6"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Already have an account? <a className="text-indigo-600 hover:underline" href="/login">Log in</a>
      </p>
    </div>
  );
};

export default SignupForm;
