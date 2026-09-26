import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  getStudents,
  getSubmissions,
} from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";

function getResponse(submissions, assignmentId, studentId) {
  return (
    submissions.find(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.studentId === studentId,
    )?.response || ""
  );
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState(() =>
    getAssignments().filter(
      (assignment) => assignment.adminId === currentUser.id,
    ),
  );
  const [submissions, setSubmissions] = useState(() => getSubmissions());
  const [students, setStudents] = useState(() => getStudents());
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    driveLink: "",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    const refresh = () => {
      setAssignments(
        getAssignments().filter(
          (assignment) => assignment.adminId === currentUser.id,
        ),
      );
      setSubmissions(getSubmissions());
      setStudents(getStudents());
    };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [currentUser.id]);
  const handleCreate = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.driveLink.trim()) {
      setError("Add a title and Drive link to publish.");
      return;
    }
    setAssignments([
      ...assignments,
      createAssignment({ ...form, adminId: currentUser.id }),
    ]);
    setForm({ title: "", description: "", driveLink: "" });
    setError("");
  };
  const handleDelete = () => {
    deleteAssignment(deleting.id, currentUser.id);
    setAssignments(
      getAssignments().filter(
        (assignment) => assignment.adminId === currentUser.id,
      ),
    );
    setSubmissions(getSubmissions());
    setDeleting(null);
  };
  const submittedCount = assignments.reduce(
    (total, assignment) =>
      total +
      students.filter((student) =>
        submissions.some(
          (submission) =>
            submission.assignmentId === assignment.id &&
            submission.studentId === student.id &&
            submission.isSubmitted,
        ),
      ).length,
    0,
  );
  return (
    <>
      <Navbar />
      <main className="dashboard admin-dashboard">
        <div className="dashboard-heading">
          <div>
            <div className="eyebrow">ADMIN CONSOLE / OVERVIEW</div>
            <h1>Shape the study flow.</h1>
            <p>
              Publish clear work, then keep an eye on the progress that follows.
            </p>
          </div>
          <div className="stat-card">
            <span className="stat-accent">
              <Icon name="check" />
            </span>
            <div>
              <strong>{submittedCount}</strong>
              <span>
                submissions
                <br />
                across all work
              </span>
            </div>
          </div>
        </div>
        <div className="admin-grid">
          <section className="create-panel">
            <div className="section-header">
              <div>
                <h2>New assignment</h2>
                <p>Give your students a clear next step.</p>
              </div>
              <span className="form-number">01</span>
            </div>
            <form onSubmit={handleCreate}>
              <label>
                Assignment title{" "}
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Read chapter three"
                />
              </label>
              <label>
                What should they know?{" "}
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Add a short description or helpful context..."
                  rows="4"
                />
              </label>
              <label>
                Google Drive link{" "}
                <input
                  type="url"
                  value={form.driveLink}
                  onChange={(event) =>
                    setForm({ ...form, driveLink: event.target.value })
                  }
                  placeholder="https://drive.google.com/..."
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="publish-button" type="submit">
                Publish assignment <Icon name="plus" />
              </button>
            </form>
          </section>
          <section className="overview-panel">
            <div className="section-header">
              <div>
                <h2>Live assignments</h2>
                <p>Visibility across your class</p>
              </div>
              <span className="count-badge">{assignments.length} live</span>
            </div>
            <div className="admin-assignment-list">
              {assignments.length === 0 ? (
                <EmptyState title="Nothing live yet">
                  Create your first assignment to see class progress.
                </EmptyState>
              ) : (
                assignments.map((assignment) => (
                  <article className="admin-assignment" key={assignment.id}>
                    <div className="admin-assignment-top">
                      <div>
                        <h3>{assignment.title}</h3>
                        <p>
                          {assignment.description || "No description added."}
                        </p>
                      </div>
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open Drive link"
                        title="Open Drive link"
                      >
                        <Icon name="external" />
                      </a>
                      <button
                        className="delete-button"
                        onClick={() => setDeleting(assignment)}
                        aria-label={`Delete ${assignment.title}`}
                        title="Delete assignment"
                      >
                        ×
                      </button>
                    </div>
                    <div className="student-status-list">
                      {students.map((student) => {
                        const done = submissions.some(
                          (submission) =>
                            submission.assignmentId === assignment.id &&
                            submission.studentId === student.id &&
                            submission.isSubmitted,
                        );
                        const response = getResponse(
                          submissions,
                          assignment.id,
                          student.id,
                        );
                        return (
                          <div className="student-status" key={student.id}>
                            <div className="student-name">
                              <span
                                className={`student-avatar ${done ? "complete" : ""}`}
                              >
                                {student.name.charAt(0)}
                              </span>
                              <span>{student.name}</span>
                            </div>
                            <ProgressBar
                              value={done ? 100 : 0}
                              label={done ? "Submitted" : "Not submitted"}
                            />
                            {done && response && (
                              <p className="student-response">
                                &quot;{response}&quot;
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      {deleting && (
        <ConfirmModal
          eyebrow="DELETE ASSIGNMENT"
          title="Remove this assignment?"
          icon="clipboard"
          confirmLabel="Delete for everyone"
          confirmClassName="danger-button"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        >
          <p>
            <strong>{deleting.title}</strong> and every student submission will
            be deleted for everyone.
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
