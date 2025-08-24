import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { Link } from 'react-router-dom';

const ResultsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/quizzes/student-quizzes/')  // Updated API path with /quizzes/ prefix
      .then((res) => setAttempts(res.data))
      .catch(() => setError('Failed to load results.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-indigo-700">Your Quiz Results</h1>
      {attempts.length === 0 ? (
        <p>You have not completed any quiz attempts yet.</p>
      ) : (
        <ul className="space-y-4">
          {attempts.map((attempt) => (
            <li key={attempt.id} className="border rounded p-4 shadow-sm hover:shadow-md">
              <Link to={`/results/${attempt.id}`} className="text-xl font-semibold text-indigo-600 hover:underline">
                {attempt.quiz.title}
              </Link>
              <p>
                Score: {attempt.total_score.toFixed(2)} / {attempt.total_possible_points}
              </p>
              <p>Submitted: {attempt.submission_time ? new Date(attempt.submission_time).toLocaleString() : 'Not submitted'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultsPage;
