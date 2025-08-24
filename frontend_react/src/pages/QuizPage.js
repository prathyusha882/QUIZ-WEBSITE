import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Question from '../components/quiz/Question';
import CodeEditor from '../components/quiz/CodeEditor';
import Timer from '../components/quiz/Timer';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import SubmitConfirmationDialog from '../components/quiz/SubmitConfirmationDialog';
import { toast } from 'react-toastify';
import api from '../services/api';  // Axios instance with auth interceptor

const LOCAL_STORAGE_KEY = 'quiz_answers_draft';

const QuizPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attempt');
  const navigate = useNavigate();

  const [quizDetails, setQuizDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Initialize answers state with null for each question so nothing is selected by default
  useEffect(() => {
    if (!id || !attemptId) {
      setError('Quiz ID or Attempt ID missing in URL');
      setLoading(false);
      return;
    }
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${attemptId}`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {}
    }
    api.get(`/quizzes/student-quizzes/${attemptId}/`)
      .then(({ data }) => {
        setAlreadySubmitted(data.submitted);
        setQuizDetails(data.quiz);
        setQuestions(data.quiz.questions);

        // Set answers state with null for each question (unless already loaded from localStorage)
        if (!saved) {
          const initialAnswers = {};
          data.quiz.questions.forEach((q) => {
            initialAnswers[q.id] = null;
          });
          setAnswers(initialAnswers);
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.detail || 'Failed to load quiz details.';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [id, attemptId]);

  useEffect(() => {
    if (attemptId) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${attemptId}`, JSON.stringify(answers));
    }
  }, [answers, attemptId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const goToNext = () => {
    if (currentQIndex < questions.length - 1) setCurrentQIndex(currentQIndex + 1);
  };

  const goToPrev = () => {
    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
  };

  // Handle timer finishing: auto-submit quiz immediately
  const handleTimeUp = () => {
    if (!alreadySubmitted) {
      confirmSubmission(true); // true means auto submission, no confirm dialog
    }
  };

  // Handle manual submit button click: show confirm dialog only if time left
  const handleSubmit = useCallback(() => {
    if (alreadySubmitted) {
      toast.info('Quiz already submitted.');
      return;
    }
    setConfirmSubmitOpen(true);
  }, [alreadySubmitted]);

  // Confirm submission handler; supports auto-submit bypass for confirmation dialog
  const confirmSubmission = (auto = false) => {
    if (isSubmitting) return; // Prevent multiple submissions
    setConfirmSubmitOpen(false);
    setSubmitError('');
    setIsSubmitting(true);

    const answersToSubmit = questions
      .map((q) => ({
        question: q.id,
        selected_option: answers[q.id] !== undefined ? answers[q.id] : null,
        answer_text: q.question_type === 'text' ? answers[q.id] : undefined,
        code_submitted: q.question_type === 'code' ? answers[q.id] : undefined,
      }))
      .filter((a) => a.selected_option !== null || a.answer_text || a.code_submitted);

    if (answersToSubmit.length === 0 && !auto) {
      setSubmitError('Please answer at least one question before submitting.');
      setIsSubmitting(false);
      return;
    }

    api
      .post(`/quizzes/student-quizzes/${attemptId}/submit/`, { answers: answersToSubmit })
      .then(() => {
        toast.success('Quiz submitted successfully!');
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_${attemptId}`);
        setAlreadySubmitted(true);
        navigate(`/results/${attemptId}`);
      })
      .catch((err) => {
        const msg = err.response?.data?.detail || 'Failed to submit quiz.';
        setSubmitError(msg);
        toast.error(msg);
      })
      .finally(() => setIsSubmitting(false));
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">{quizDetails?.title}</h1>
        <Timer durationMinutes={quizDetails?.duration_minutes || 60} onTimeUp={handleTimeUp} />
      </div>
      {submitError && (
        <div className="mb-4 p-3 rounded border border-red-600 bg-red-100 text-red-700">{submitError}</div>
      )}
      {currentQuestion && (
        <>
          <div className="mb-2 text-lg font-semibold">
            {/* Show question number */}
            Q {currentQIndex + 1} of {questions.length}
          </div>
          {currentQuestion.question_type === 'code' ? (
            <CodeEditor
              code={answers[currentQuestion.id] || ''}
              onChange={(code) => handleAnswerChange(currentQuestion.id, code)}
              disabled={alreadySubmitted}
            />
          ) : (
            <Question
              question={currentQuestion}
              onAnswerChange={handleAnswerChange}
              currentAnswer={answers[currentQuestion.id]}
              disabled={alreadySubmitted}
            />
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrev}
              disabled={currentQIndex === 0}
              className={`btn px-6 py-2 rounded ${
                currentQIndex === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Previous
            </button>
            {currentQIndex < questions.length - 1 ? (
              <button
                onClick={goToNext}
                className="btn px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || alreadySubmitted}
                className={`btn px-6 py-2 rounded ${
                  alreadySubmitted
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {alreadySubmitted ? 'Submitted' : isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </>
      )}
      <SubmitConfirmationDialog
        isOpen={confirmSubmitOpen}
        onCancel={() => setConfirmSubmitOpen(false)}
        onConfirm={() => confirmSubmission(false)}
      />
    </div>
  );
};

export default QuizPage;
