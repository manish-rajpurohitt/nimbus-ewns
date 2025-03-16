import Link from "next/link";
import { Mail } from "lucide-react";

interface ForgotPasswordFormProps {
  error?: string;
  success?: string;
  businessName?: string;
}

export default function ForgotPasswordForm({
  businessName,
  error,
  success
}: ForgotPasswordFormProps) {
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-content">
          <div className="brand-section">
            <div className="brand-logo">
              <Mail className="shopping-cart-icon" />
            </div>
            <h1>Reset Password</h1>
            <p>Enter your email to receive reset instructions</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-4">
              {success}
            </div>
          )}

          <form
            action="/api/auth/forgot-password"
            method="POST"
            className="forgot-password-form"
          >
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button type="submit" className="reset-button">
              <span className="button-text">Send Reset Link</span>
              <span
                className="loading-spinner"
                style={{ display: "none" }}
              ></span>
            </button>
          </form>

          <div className="form-footer-center">
            <Link href="/login" className="back-to-login">
              Back to Login
            </Link>
          </div>
        </div>

        <div className="decoration-section">
          <div className="animated-keys">
            <div className="key key-1"></div>
            <div className="key key-2"></div>
            <div className="key key-3"></div>
          </div>
          <div className="reset-illustration">
            <div className="illustration-container">
              <div className="envelope">
                <div className="envelope-top"></div>
                <div className="envelope-body">
                  <div className="letter">
                    <div className="letter-line"></div>
                    <div className="letter-line"></div>
                    <div className="letter-line"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
