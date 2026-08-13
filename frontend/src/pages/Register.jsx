import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { register } from '../services/authService';

const Register = ({ onNavigateLogin, onNavigateHome, showToast }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Inline field errors
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password && confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const data = await register(
        fullName.trim(),
        email.trim(),
        password
      );

      showToast(
        `Welcome, ${data.name || "User"}! Your account has been created.`,
        "success"
      );

      // Navigate to home/dashboard
      if (onNavigateHome) {
        onNavigateHome();
      }

    } catch (error) {
      let message = "Registration failed. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 409) {
          message =
            responseData?.message ||
            "Email is already registered.";
        } else if (status === 400) {
          message =
            responseData?.message ||
            "Invalid registration details. Email may already be in use.";
        } else if (status === 404) {
          message =
            "Registration endpoint was not found. Check your backend AuthController.";
        } else if (status === 500) {
          message =
            responseData?.message ||
            "Server error. Please try again.";
        }
      } else if (error.request) {
        message =
          "Unable to connect to the server. Please try again later.";
      }

      showToast(message, "error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-brand-icon">
          <Sparkles size={24} />
        </div>
        <h1 className="auth-title">AI Email Assistant</h1>
        <p className="auth-subtitle">Create a new account</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-fullname">
              Full Name *
            </label>
            <input
              id="register-fullname"
              type="text"
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
            />
            {errors.fullName && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address *
            </label>
            <input
              id="register-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
            />
            {errors.email && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password *
            </label>
            <div className="password-input-wrapper">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              Confirm Password *
            </label>
            <div className="password-input-wrapper">
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: '1.5rem' }}
            id="btn-register-submit"
            disabled={loading}
          >
            <UserPlus size={16} />
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <button
            type="button"
            className="auth-link"
            onClick={onNavigateLogin}
            id="link-go-to-login"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
