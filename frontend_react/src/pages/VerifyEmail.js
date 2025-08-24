import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    async function verify() {
      try {
        await api.post('/users/email/verify/', { uid, token });
        setMessage("Your email has been verified! You can now login.");
      } catch (error) {
        setMessage("Verification failed. Please check your link or try again.");
      }
    }

    if (uid && token) verify();
    else setMessage("Missing verification details.");
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 400, margin: "5rem auto", padding: "2rem", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }}>
      <h1 style={{ color: "#4f46e5", textAlign: "center" }}>Email Verification</h1>
      <p style={{ textAlign: "center", fontSize: "1.15rem" }}>{message}</p>
    </div>
  );
};

export default VerifyEmail;
