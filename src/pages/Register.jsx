import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const form = event.currentTarget;
    const name = form.fullName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (signupError) throw signupError;

      if (data.session) {
        await supabase.auth.signOut();
      }

      setMessage(
        "Registration successful! Please sign in with your email and password."
      );

      window.setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
          max-width: 460px;
          padding: 34px;
          border: 1px solid #a78bfa45;
          border-radius: 26px;
          background: linear-gradient(145deg, #191532f5, #0e0b22f5);
          box-shadow: 0 20px 80px #0006, 0 0 35px #7040ff12;
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 26px;
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
        .auth-form { margin-top: 24px; }
        .auth-field { margin-bottom: 16px; }
        .auth-field label {
          display: block;
          margin-bottom: 8px;
          color: #e8e3ff;
          font-size: 13px;
          font-weight: 700;
        }
        .auth-field input {
          width: 100%;
          min-width: 0;
          padding: 13px 14px;
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
        .auth-error, .auth-message {
          margin: 0 0 16px;
          font-size: 13px;
          line-height: 1.6;
        }
        .auth-error { color: #ff9eb5; }
        .auth-message { color: #86efac; }
        .auth-footer {
          margin-top: 22px;
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
        .auth-back { display: inline-block; margin-top: 18px; }
        @media (max-width: 480px) {
          .auth-card { padding: 25px 20px; }
          .auth-card h1 { font-size: 26px; }
        }
      `}</style>

      <section className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-logo">S</span>
          <span>Skill2Project</span>
        </Link>

        <h1>Create your account âœ¨</h1>
        <p className="auth-muted">
          Start your learning journey and discover projects that match your skills.
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-message" role="status">{message}</p>}

          <div className="auth-field">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <div className="auth-password">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="auth-show"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm">Confirm password</label>
            <input
              id="register-confirm"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password again"
              autoComplete="new-password"
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

        <Link to="/" className="auth-link auth-back">
          â† Back to Home
        </Link>
      </section>
    </div>
  );
}

export default Register;
