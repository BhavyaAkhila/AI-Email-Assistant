import React, { useState } from 'react';
import EmailGenerator from '../components/EmailGenerator';
import EmailEditor from '../components/EmailEditor';
import { apiService } from '../services/api';

const Dashboard = ({ showToast }) => {
  const [currentEmail, setCurrentEmail] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    try {
      // POST /api/ai/generate generates & saves in MySQL
      const result = await apiService.generateEmail(formData);
      setCurrentEmail(result);
      showToast('Email generated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to generate email.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (id, regenData) => {
    setIsRegenerating(true);
    try {
      // POST /api/ai/regenerate or /api/ai/regenerate/{id}
      const updatedResult = await apiService.regenerateEmail(id, regenData);
      setCurrentEmail(updatedResult);
      showToast('Email regenerated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to regenerate email.', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = async (emailToSave) => {
    setIsSaving(true);
    try {
      let result;
      if (emailToSave.id) {
        // PUT /api/emails/{id}
        result = await apiService.updateEmail(emailToSave.id, emailToSave);
      } else {
        // POST /api/ai/save
        result = await apiService.saveEmail(emailToSave);
      }
      setCurrentEmail(result);
      showToast('Email saved successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save email.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="main-container">
      <section className="hero-section">
        <h1 className="hero-title">Write better emails with AI</h1>
        <p className="hero-subtitle">
          Describe what you want to say and let AI create a polished email in seconds.
        </p>
      </section>

      <div className={`generator-grid ${currentEmail ? 'has-output' : ''}`}>
        <EmailGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />

        {currentEmail && (
          <EmailEditor
            emailData={currentEmail}
            onSave={handleSave}
            onRegenerate={handleRegenerate}
            isSaving={isSaving}
            isRegenerating={isRegenerating}
            onCopySuccess={() => showToast('Email copied to clipboard!', 'success')}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
