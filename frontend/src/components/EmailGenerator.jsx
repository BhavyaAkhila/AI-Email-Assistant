import React, { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import ToneSelector from './ToneSelector';
import LengthSelector from './LengthSelector';
import LoadingSpinner from './LoadingSpinner';

const EmailGenerator = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setValidationError('Please describe the email you want to generate.');
      return;
    }
    setValidationError('');
    onGenerate({ prompt, subject, tone, length });
  };

  return (
    <div className="card">
      <div className="card-title">
        <Wand2 size={20} style={{ color: 'var(--primary)' }} />
        <span>Generate Email</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="input-subject">
            Subject Line (Optional)
          </label>
          <input
            id="input-subject"
            type="text"
            className="form-input"
            placeholder="e.g. Leave Request / Project Update"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-prompt">
            Email Prompt / What do you want to say? <span style={{ color: 'var(--accent-rose)' }}>*</span>
          </label>
          <textarea
            id="input-prompt"
            className="form-textarea"
            placeholder="e.g. Ask my manager for one day leave because of a family function on Friday..."
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={isGenerating}
            rows={4}
          />
          {validationError && (
            <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              {validationError}
            </p>
          )}
        </div>

        <div className="form-row">
          <ToneSelector value={tone} onChange={setTone} disabled={isGenerating} />
          <LengthSelector value={length} onChange={setLength} disabled={isGenerating} />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isGenerating}
          style={{ marginTop: '0.5rem' }}
          id="btn-generate-email"
        >
          {isGenerating ? (
            <LoadingSpinner label="Generating your email..." inline />
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate Email</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmailGenerator;
