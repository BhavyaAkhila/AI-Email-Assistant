import React, { useState } from "react";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { login } from "../services/authService";

const Login = ({
  onNavigateRegister,
  onNavigateHome,
  showToast,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // ==========================================
  // VALIDATION
  // ==========================================

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const data = await login(
        email.trim(),
        password
      );

      showToast(
        `Welcome back, ${data.name || "User"}!`,
        "success"
      );

      // Navigate to home/dashboard
      if (onNavigateHome) {
        onNavigateHome();
      }

    } catch (error) {
      let message = "Login failed. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 401) {
          message = "Invalid email or password.";
        } else if (status === 400) {
          message =
            responseData?.message ||
            "Invalid login details.";
        } else if (status === 404) {
          message =
            "Login endpoint was not found. Check your backend AuthController.";
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

        <h1 className="auth-title">
          AI Email Assistant
        </h1>

        <p className="auth-subtitle">
          Sign in to your account
        </p>

      </div>

      <div className="card">

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* EMAIL */}

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="login-email"
            >
              Email Address *
            </label>

            <div style={{ position: "relative" }}>

              <input
                id="login-email"
                type="email"
                className={`form-input ${
                  errors.email
                    ? "input-error"
                    : ""
                }`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {

                  setEmail(e.target.value);

                  if (errors.email) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }

                }}
              />

            </div>

            {errors.email && (

              <div className="form-error">

                <AlertCircle size={14} />

                <span>
                  {errors.email}
                </span>

              </div>

            )}

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.4rem",
              }}
            >

              <label
                className="form-label"
                htmlFor="login-password"
                style={{
                  marginBottom: 0,
                }}
              >
                Password *
              </label>

              <button
                type="button"
                className="auth-link"
                style={{
                  fontSize: "0.8rem",
                }}
                onClick={() =>
                  showToast(
                    "Password reset functionality will be added later.",
                    "success"
                  )
                }
              >
                Forgot password?
              </button>

            </div>


            <div className="password-input-wrapper">

              <input
                id="login-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className={`form-input ${
                  errors.password
                    ? "input-error"
                    : ""
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {

                  setPassword(e.target.value);

                  if (errors.password) {
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }

                }}
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>

            {errors.password && (

              <div className="form-error">

                <AlertCircle size={14} />

                <span>
                  {errors.password}
                </span>

              </div>

            )}

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{
              marginTop: "1.5rem",
            }}
            id="btn-login-submit"
            disabled={loading}
          >

            <span>
              {loading
                ? "Logging in..."
                : "Login"}
            </span>

            {!loading && (
              <ArrowRight size={16} />
            )}

          </button>

        </form>


        {/* REGISTER */}

        <div className="auth-footer">

          <span>
            Don't have an account?{" "}
          </span>

          <button
            type="button"
            className="auth-link"
            onClick={onNavigateRegister}
            id="link-go-to-register"
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
};

export default Login;