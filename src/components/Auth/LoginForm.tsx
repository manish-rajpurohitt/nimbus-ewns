import Link from "next/link";
import { Mail, Lock, ShoppingCart } from "lucide-react";

interface LoginFormProps {
  businessName?: string;
  error?: string;
  showSuccessMessage?: boolean;
}

export default function LoginForm({
  businessName,
  error,
  showSuccessMessage
}: LoginFormProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-content">
          <div className="brand-section">
            <div className="brand-logo">
              <ShoppingCart className="shopping-cart-icon" />
            </div>
            <h1>Welcome to {businessName || "our store"}</h1>
            <p>Sign in to your account</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {showSuccessMessage && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-4">
              Registration successful! Please login with your credentials.
            </div>
          )}

          <form action="/api/auth/login" method="POST" className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <input type="hidden" name="redirect" value="/" />

            <button type="submit" className="login-button">
              <span className="button-text">Sign in</span>
              <span
                className="loading-spinner"
                style={{ display: "none" }}
              ></span>
            </button>
          </form>

          <div className="form-footer">
            <Link href="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
            <Link href="/register" className="register-link">
              Register here
            </Link>
          </div>
        </div>

        <div className="decoration-section">
          <div className="animated-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
          <div className="shopping-illustration">
            <div className="illustration-container">
              <div className="shopping-bag">
                <div className="bag-body"></div>
                <div className="bag-handle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
