import React from 'react';

export const LENGTH_OPTIONS = ['Short', 'Medium', 'Long'];

const LengthSelector = ({ value, onChange, disabled }) => {
  return (
    <div className="form-group">
      <label className="form-label">Email Length</label>
      <div className="select-pills">
        {LENGTH_OPTIONS.map((len) => (
          <button
            key={len}
            type="button"
            className={`pill-btn ${value === len ? 'active' : ''}`}
            onClick={() => onChange(len)}
            disabled={disabled}
            id={`length-opt-${len.toLowerCase()}`}
          >
            {len}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LengthSelector;
