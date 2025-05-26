import React from 'react';

const Cursor = ({ x, y, color, userName }) => {
  return (
    <div
      className="cursor"
      style={{
        transform: `translate(${x}px, ${y}px)`
      }}
    >
      <div className="cursor-name">{userName}</div>
      <div
        className="cursor-dot"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

export default Cursor;
