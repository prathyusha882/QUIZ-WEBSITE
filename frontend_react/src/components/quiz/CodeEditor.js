import React, { useState, useEffect } from 'react';

const CodeEditor = ({ code, onChange, disabled }) => {
  const [localCode, setLocalCode] = useState(code || '');

  useEffect(() => {
    setLocalCode(code || '');
  }, [code]);

  const handleChange = (e) => {
    setLocalCode(e.target.value);
    onChange && onChange(e.target.value);
  };

  return (
    <div>
      <textarea
        value={localCode}
        onChange={handleChange}
        disabled={disabled}
        spellCheck={false}
        className="w-full h-48 p-2 font-mono border rounded resize-none"
        placeholder="Write your code here..."
      />
    </div>
  );
};

export default CodeEditor;
