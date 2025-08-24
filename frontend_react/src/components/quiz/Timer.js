import React, { useEffect, useState, useRef } from 'react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const Timer = ({ durationMinutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const hasCalledTimeUp = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp && !hasCalledTimeUp.current) {
        onTimeUp();
        hasCalledTimeUp.current = true; // Ensure onTimeUp called once
      }
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((sec) => sec - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft, onTimeUp]);

  return (
    <div className="text-right text-lg font-semibold text-red-600">
      Time Left: {formatTime(secondsLeft)}
    </div>
  );
};

export default Timer;
