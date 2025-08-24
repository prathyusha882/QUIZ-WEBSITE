import React from 'react';

const Question = ({ question, onAnswerChange, currentAnswer, disabled }) => {
  if (!question) return null;
  const { id, text, question_type, options } = question;

  const handleChange = (e) => {
    const { value, checked } = e.target;

    if (question_type === 'mcq') {
      // Single choice - Radio buttons
      // Pass the actual Choice ID (option.id), not index
      onAnswerChange(id, Number(value));
    } else if (question_type === 'tf') {
      // True/False Toggle - use radio buttons for better UX
      // handled by separate change handlers below
    } else if (question_type === 'text') {
      onAnswerChange(id, value);
    }
    // For coding questions, handled separately.
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-3">{text}</h3>

      {question_type === 'mcq' && options && (
        <div>
          {options.map((option) => (
            <label key={option.id} className="block mb-2">
              <input
                type="radio"
                name={`question_${id}`}
                value={option.id} // use actual Choice ID here
                checked={currentAnswer === option.id}
                onChange={handleChange}
                disabled={disabled}
                className="mr-2"
              />
              {option.choice_text}
            </label>
          ))}
        </div>
      )}

      {question_type === 'tf' && (
        <div>
          <label className="block mb-2">
            <input
              type="radio"
              name={`question_${id}`}
              value="true"
              checked={currentAnswer === true}
              onChange={() => onAnswerChange(id, true)}
              disabled={disabled}
              className="mr-2"
            />
            True
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              name={`question_${id}`}
              value="false"
              checked={currentAnswer === false}
              onChange={() => onAnswerChange(id, false)}
              disabled={disabled}
              className="mr-2"
            />
            False
          </label>
        </div>
      )}

      {question_type === 'text' && (
        <textarea
          rows={4}
          className="w-full p-2 border rounded"
          value={currentAnswer || ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Type your answer here..."
        />
      )}
    </div>
  );
};

export default Question;
