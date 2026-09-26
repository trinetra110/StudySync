import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const result =
      mode === "login" ? login(form.email, form.password) : signup(form);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate(`/${result.user.role}`);
  };
  return (
    <main className="login-page">
      <div className="login-art">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-note note-one">Read</div>
        <div className="art-note note-two">Make</div>
        <div className="art-note note-three">Share</div>
        <div className="art-card">
          <Icon name="clipboard" />
          <strong>
            One place for
            <br />
            every deadline.
          </strong>
        </div>
      </div>
      <section className="login-panel">
        <div className="eyebrow">THE QUIETLY ORGANIZED CLASSROOM</div>
        <h1>
          Keep your
          <br />
          <em>momentum.</em>
        </h1>
        <p className="login-copy">
          A focused workspace for assignments, submissions, and the small wins
          that move your semester forward.
        </p>
        <div className="auth-switcher">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Log in
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Create account
          </button>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Full name{" "}
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Your name"
              />
            </label>
          )}
          <label>
            Email address{" "}
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password{" "}
            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="At least 6 characters"
            />
          </label>
          {mode === "signup" && (
            <label>
              Workspace{" "}
              <select
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="auth-submit" type="submit">
            {mode === "login" ? "Log in" : "Create account"}
            <Icon name="arrow" />
          </button>
        </form>
        <p className="login-foot">
          Your account and workspace data stay in this browser.
        </p>
      </section>
    </main>
  );
}
