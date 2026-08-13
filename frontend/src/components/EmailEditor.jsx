import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Save, Edit3 } from 'lucide-react';
import ToneSelector from './ToneSelector';
import LengthSelector from './LengthSelector';
import LoadingSpinner from './LoadingSpinner';
import { extractGeneratedEmail } from '../services/api';

const EmailEditor = ({
  emailData,
  onSave,
  onRegenerate,
  isSaving,
  isRegenerating,
  onCopySuccess,
}) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Regeneration panel options
  const [showRegenPanel, setShowRegenPanel] = useState(false);
  const [regenTone, setRegenTone] = useState('Professional');
  const [regenLength, setRegenLength] = useState('Medium');

  useEffect(() => {
    if (emailData) {
      setSubject(emailData.subject || 'Untitled Email');
      // Safely parse generatedEmail from string or object format
      const extractedText = extractGeneratedEmail(emailData);
      setContent(extractedText || '');
      setRegenTone(emailData.tone || 'Professional');
      setRegenLength(emailData.length || 'Medium');
    }
  }, [emailData]);

  if (!emailData) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy email content: ', err);
    }
  };

  const handleConfirmRegenerate = () => {
    onRegenerate(emailData.id, {
      prompt: emailData.prompt,
      tone: regenTone,
      length: regenLength,
    });
  };

  const handleSaveClick = () => {
    onSave({
      id: emailData.id,
      prompt: emailData.prompt,
      subject,
      generatedEmail: content,
      tone: regenTone,
      length: regenLength,
    });
    setIsEditing(false);
  };

  return (
    <div className="card editor-wrapper">
      <div className="editor-header">
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            SUBJECT
          </div>
          {isEditing ? (
            <input
              type="text"
              className="form-input"
              style={{ fontWeight: 700, fontSize: '1.05rem' }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          ) : (
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {subject || 'Untitled Email'}
            </h3>
          )}
        </div>

        <div className="editor-actions">
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            title="Copy email to clipboard"
            id="btn-copy-email"
          >
            {copied ? (
              <>
                <Check size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span style={{ color: 'var(--accent-emerald)' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            className={`btn ${showRegenPanel ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowRegenPanel(!showRegenPanel)}
            disabled={isRegenerating}
            title="Regenerate with different options"
            id="btn-toggle-regen"
          >
            <RefreshCw size={16} className={isRegenerating ? 'spin' : ''} />
            <span>Regenerate</span>
          </button>

          <button
            className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsEditing(!isEditing)}
            id="btn-toggle-edit"
          >
            <Edit3 size={16} />
            <span>{isEditing ? 'Previewing' : 'Edit'}</span>
          </button>
        </div>
      </div>

      {showRegenPanel && (
        <div className="regen-box">
          <div className="regen-title">
            <RefreshCw size={14} /> Change Tone & Length to Regenerate
          </div>
          <div className="form-row">
            <ToneSelector value={regenTone} onChange={setRegenTone} disabled={isRegenerating} />
            <LengthSelector value={regenLength} onChange={setRegenLength} disabled={isRegenerating} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowRegenPanel(false)}
              disabled={isRegenerating}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleConfirmRegenerate}
              disabled={isRegenerating}
              id="btn-submit-regen"
            >
              {isRegenerating ? <LoadingSpinner label="Regenerating..." inline /> : 'Apply & Regenerate'}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span className="form-label">Generated Email Content</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span className="badge badge-tone">{emailData.tone || regenTone}</span>
            <span className="badge badge-length">{emailData.length || regenLength}</span>
          </div>
        </div>

        {isEditing ? (
          <textarea
            className="editor-body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Generated content will appear here..."
            rows={10}
          />
        ) : (
          <div
            className="editor-body"
            style={{
              whiteSpace: 'pre-wrap', // Guarantee newline characters format as real paragraphs
              wordBreak: 'break-word',
              overflowY: 'auto',
            }}
          >
            {content || 'No email content generated.'}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="editor-footer">
          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
            disabled={isSaving}
            id="btn-save-email"
          >
            {isSaving ? (
              <LoadingSpinner label="Saving Changes..." inline />
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailEditor;
