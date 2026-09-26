import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAssignments,
  getSubmissions,
  markSubmission,
} from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState(() => getAssignments());
  const [submissions, setSubmissions] = useState(() => getSubmissions());
  const [pending, setPending] = useState(null);
  const [response, setResponse] = useState("");
  useEffect(() => {
    const refresh = () => {
      setAssignments(getAssignments());
      setSubmissions(getSubmissions());
    };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  const completed = assignments.filter((assignment) =>
    submissions.some(
      (submission) =>
        submission.assignmentId === assignment.id &&
        submission.studentId === currentUser.id &&
        submission.isSubmitted,
    ),
  ).length;
  const openSubmission = (assignment) => {
    setPending(assignment);
    setResponse(
      submissions.find(
        (submission) =>
          submission.assignmentId === assignment.id &&
          submission.studentId === currentUser.id,
      )?.response || "",
    );
  };
  const submit = () => {
    markSubmission(pending.id, currentUser.id, response);
    setSubmissions(getSubmissions());
    setPending(null);
    setResponse("");
  };
  return (
    <>
      <Navbar />
      <main className="dashboard">
        <div className="dashboard-heading">
          <div>
            <div className="eyebrow">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h1>Good morning, {currentUser.name.split(" ")[0]}.</h1>
            <p>
              Here is your learning queue. Take it one clear step at a time.
            </p>
          </div>
          <div className="completion-card">
            <span className="completion-number">
              {completed}
              <small>/{assignments.length}</small>
            </span>
            <span>
              assignments
              <br />
              complete
            </span>
            <ProgressBar
              value={
                assignments.length ? (completed / assignments.length) * 100 : 0
              }
            />
          </div>
        </div>
        <div className="section-header">
          <div>
            <h2>Your assignments</h2>
            <p>{assignments.length - completed} still on your plate</p>
          </div>
          <span className="count-badge">{assignments.length} total</span>
        </div>
        <div className="assignment-list">
          {assignments.length === 0 ? (
            <EmptyState title="You are all caught up">
              New assignments from your admin will appear here.
            </EmptyState>
          ) : (
            assignments.map((assignment, index) => {
              const done = submissions.some(
                (submission) =>
                  submission.assignmentId === assignment.id &&
                  submission.studentId === currentUser.id &&
                  submission.isSubmitted,
              );
              return (
                <article
                  className={`assignment-row ${done ? "is-done" : ""}`}
                  key={assignment.id}
                >
                  <div className="assignment-index">0{index + 1}</div>
                  <div className="assignment-content">
                    <div className="assignment-meta">
                      <span>{done ? "Completed" : "In progress"}</span>
                      <span className="dot" /> <span>Assignment</span>
                    </div>
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <a
                      className="drive-link"
                      href={assignment.driveLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name="external" /> Open Drive submission
                    </a>
                  </div>
                  <div className="assignment-action">
                    {done ? (
                      <div className="submitted-state">
                        <span>
                          <Icon name="check" />
                        </span>{" "}
                        Submitted
                      </div>
                    ) : (
                      <button
                        className="submit-button"
                        onClick={() => openSubmission(assignment)}
                      >
                        Submit work <Icon name="arrow" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
      {pending && (
        <ConfirmModal
          eyebrow="FINAL CHECK"
          title="Ready to mark this done?"
          confirmLabel="Yes, I have submitted"
          onConfirm={submit}
          onCancel={() => setPending(null)}
        >
          <p>
            Add an optional written response below, then confirm after you have
            uploaded <strong>{pending.title}</strong> to the Drive link.
          </p>
          <textarea
            className="response-input"
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            placeholder="Write a response, reflection, or note (optional)..."
            rows="5"
          />
        </ConfirmModal>
      )}
    </>
  );
}
