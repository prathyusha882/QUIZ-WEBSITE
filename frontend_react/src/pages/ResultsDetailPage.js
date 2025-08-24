import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import api from '../services/api';

const ResultsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/student-quizzes/${id}/`)
      .then((res) => setAttempt(res.data))
      .catch(() => setError('Failed to load result details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!attempt) return null;

  const totalQuestions = attempt.quiz.questions.length;
  const attemptedQuestions = new Set(attempt.answers.map(a => a.question.id)).size; // Unique attempted questions
  const unattemptedQuestions = totalQuestions - attemptedQuestions;
  const totalScore = attempt.total_score.toFixed(2);
  const totalPossiblePoints = attempt.total_possible_points;

  const handleExit = () => {
    // Redirect to login page (adjust the path if different)
    navigate('/login');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const feedbackText = e.target.feedback.value;

    try {
      await api.post('/quizzes/feedback/', {
        attempt: attempt.id,
        quiz: attempt.quiz.id,
        feedback_text: feedbackText,
      });
      setFeedbackGiven(true);
    } catch (err) {
      alert('Failed to submit feedback.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-indigo-700">
        Results Summary for {attempt.quiz.title}
      </h1>
      <p className="mb-2">Total Questions: {totalQuestions}</p>
      <p className="mb-2">Attempted Questions: {attemptedQuestions}</p>
      <p className="mb-2">Unattempted Questions: {unattemptedQuestions}</p>
      <p className="mb-6">
        Total Score: {totalScore} / {totalPossiblePoints}
      </p>

      {!feedbackGiven ? (
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <label htmlFor="feedback" className="block font-semibold">
            Please provide your feedback:
          </label>
          <textarea
            id="feedback"
            name="feedback"
            rows="5"
            className="w-full p-2 border rounded"
            required
            placeholder="Enter your feedback here..."
          />
          <button
            type="submit"
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
          >
            Submit Feedback
          </button>
        </form>
      ) : (
        <div className="text-center mt-8">
          <p className="mb-4 text-lg font-semibold">Thank you for your feedback!</p>
          <button
            onClick={handleExit}
            className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsDetailPage;
