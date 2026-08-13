import React from 'react';

const LoadingSpinner = ({ label = 'Loading...', inline = false }) => {
  if (inline) {
    return (
      <span className="spinner-container">
        <span className="spinner" />
        {label && <span>{label}</span>}
      </span>
    );
  }

  return (
    <div className="full-loader">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
