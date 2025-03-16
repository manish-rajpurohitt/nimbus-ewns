import { User, Mail, Lock } from "lucide-react";
import Link from "next/link";

interface RegisterFormProps {
  businessName?: string;
  error?: string;
}

export default function RegisterForm({
  businessName,
  error
}: RegisterFormProps) {
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-content">
          <div className="brand-section">
            <div className="brand-logo">
              <User className="shopping-cart-icon" />
            </div>
            <h1>Join {businessName || "our store"}</h1>
            <p>Create your account today</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form
            action="/api/auth/register"
            method="POST"
            className="register-form"
          >
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-container">
                <User className="input-icon" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="John Doe"
                />
              </div>
            </div>

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

            <input
              type="hidden"
              name="redirect"
              value="/login?registered=true"
            />
            <button type="submit" className="register-button">
              <span className="button-text">Create Account</span>
              <span
                className="loading-spinner"
                style={{ display: "none" }}
              ></span>
            </button>
          </form>

          <div className="form-footer-center">
            <Link href="/login" className="login-link">
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        <div className="decoration-section">
          <div className="animated-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="signup-illustration">
            <div className="illustration-container">
              <div className="profile-card">
                <div className="profile-circle"></div>
                <div className="profile-lines">
                  <div className="line line-1"></div>
                  <div className="line line-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
