import React from 'react';
import './Spinner.css'; // CSS 파일을 import

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="squirrel">
        <div className="squirrel-body"></div>
        <div className="squirrel-tail"></div>
        <div className="acorn"></div>
      </div>
    </div>
  );
};

export default Spinner;