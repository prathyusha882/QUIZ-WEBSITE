import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/quizzes/leaderboard/')  // Updated API path with /quizzes/ prefix
      .then((res) => {
        setLeaders(res.data);
      })
      .catch(() => {
        setError('Failed to load leaderboard.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-indigo-700">Leaderboard</h1>
      {leaders.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border border-gray-400 px-4 py-2 text-left">Student</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Quiz</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Score</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Submission Time</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map(({ user, quiz, total_score, submission_time }, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-400 px-4 py-2">{user}</td>
                <td className="border border-gray-400 px-4 py-2">{quiz}</td>
                <td className="border border-gray-400 px-4 py-2">{total_score.toFixed(2)}</td>
                <td className="border border-gray-400 px-4 py-2">
                  {new Date(submission_time).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
