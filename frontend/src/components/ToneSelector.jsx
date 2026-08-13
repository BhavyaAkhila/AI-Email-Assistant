import React from 'react';

export const TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Formal',
  'Casual',
  'Apologetic',
  'Thank You',
  'Follow-up',
];

const ToneSelector = ({ value, onChange, disabled }) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="tone-select">
        Email Tone
      </label>
      <select
        id="tone-select"
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {TONE_OPTIONS.map((tone) => (
          <option key={tone} value={tone}>
            {tone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ToneSelector;
