import React from 'react';

const Watermark = ({ text }) => (
  <div
    style={{
      position: 'fixed',         // covers whole viewport
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      opacity: 0.09,
      zIndex: 0,       // ensure below other content
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: '#999',
      background: 'transparent', // No extra background
      overflow: 'hidden',        // Prevent scrollbars
    }}
  >
    {[...Array(12)].map((_, i) => (
      <div key={i} style={{
        margin: '40px',
        userSelect: 'none',
        wordBreak: 'break-all',
        whiteSpace: 'nowrap',
        transform: `rotate(-18deg)`,
        opacity: 0.5,
      }}>
        {text}
      </div>
    ))}
  </div>
);

export default Watermark;
