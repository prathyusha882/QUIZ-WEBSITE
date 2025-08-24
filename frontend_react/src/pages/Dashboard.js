import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/quizzes/')  // Correct API endpoint with /quizzes/
      .then((res) => setQuizzes(res.data))
      .catch(() => setError('Failed to load quizzes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStartQuiz = (quizId) => {
    api.post(`/quizzes/${quizId}/start/`)  // Correct endpoint with /quizzes/
      .then(({ data }) => {
        navigate(`/quiz/${quizId}?attempt=${data.attempt_id}`);
      })
      .catch((error) => {
        const msg = error.response?.data?.detail || 'Failed to start quiz.';
        setError(msg);
      });
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">Available Quizzes</h1>
      {quizzes.length === 0 && <p>No quizzes available at the moment.</p>}
      <ul className="space-y-4">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="border p-4 rounded shadow-sm hover:shadow-md">
            <h2 className="text-2xl font-semibold">{quiz.title}</h2>
            <p className="mb-2 text-gray-700">{quiz.description}</p>
            <p className="mb-2">
              Duration: {quiz.duration_minutes} min | Total Marks: {quiz.total_marks || 'N/A'}
            </p>
            <button
              onClick={() => handleStartQuiz(quiz.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Start Quiz
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
