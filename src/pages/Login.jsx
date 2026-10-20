import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    const email = event.currentTarget.email.value.trim();
    const password = event.currentTarget.password.value;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message || "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 28px 16px;
          color: #f7f5ff;
          font-family: Inter, system-ui, sans-serif;
          background:
            radial-gradient(circle at 15% 20%, #252060 0%, transparent 35%),
            radial-gradient(circle at 85% 80%, #401354 0%, transparent 35%),
            #070515;
        }
        .auth-page * { box-sizing: border-box; }
        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 36px;
          border: 1px solid #a78bfa45;
          border-radius: 26px;
          background: linear-gradient(145deg, #191532f5, #0e0b22f5);
          box-shadow: 0 20px 80px #0006, 0 0 35px #7040ff12;
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          color: white;
          text-decoration: none;
          font-size: 20px;
          font-weight: 850;
        }
        .auth-logo {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 15px;
          background: linear-gradient(135deg, #a855f7, #6129ee);
          box-shadow: 0 0 24px #8b5cf655;
        }
        .auth-card h1 {
          margin: 0 0 10px;
          font-size: 30px;
          letter-spacing: -1px;
        }
        .auth-muted {
          color: #aaa6c7;
          font-size: 14px;
          line-height: 1.7;
        }
        .auth-form { margin-top: 26px; }
        .auth-field { margin-bottom: 19px; }
        .auth-field label {
          display: block;
          margin-bottom: 9px;
          color: #e8e3ff;
          font-size: 13px;
          font-weight: 700;
        }
        .auth-field input {
          width: 100%;
          min-width: 0;
          padding: 14px 15px;
          border: 1px solid #ffffff20;
          border-radius: 13px;
          outline: none;
          background: #ffffff08;
          color: white;
          font-size: 14px;
        }
        .auth-field input:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px #8b5cf51c;
        }
        .auth-password { display: flex; gap: 8px; }
        .auth-password input { flex: 1; }
        .auth-show {
          border: 1px solid #ffffff20;
          border-radius: 12px;
          padding: 0 12px;
          background: #ffffff0a;
          color: #d8caff;
          cursor: pointer;
        }
        .auth-button {
          width: 100%;
          padding: 15px;
          border: 0;
          border-radius: 14px;
          background: linear-gradient(100deg, #8b5cf6, #642ee8);
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 25px #713df535;
        }
        .auth-button:hover { filter: brightness(1.12); }
        .auth-button:disabled { opacity: 0.65; cursor: wait; }
        .auth-error {
          margin: 0 0 16px;
          color: #ff9eb5;
          font-size: 13px;
          line-height: 1.6;
        }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          color: #aaa6c7;
          font-size: 13px;
        }
        .auth-link {
          color: #c4a5ff;
          font-weight: 750;
          text-decoration: none;
        }
        .auth-link:hover { text-decoration: underline; }
        .auth-back { display: inline-block; margin-top: 20px; }
        @media (max-width: 480px) {
          .auth-card { padding: 26px 21px; }
          .auth-card h1 { font-size: 26px; }
        }
      `}</style>

      <section className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-logo">S</span>
          <span>Skill2Project</span>
        </Link>

        <h1>Welcome back 👋</h1>
        <p className="auth-muted">
          Sign in and continue turning your skills into real projects.
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth-password">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-show"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>

        <Link to="/" className="auth-link auth-back">
          ← Back to Home
        </Link>
      </section>
    </div>
  );
}

export default Login;