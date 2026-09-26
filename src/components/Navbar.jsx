import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const homePath = currentUser?.role === "admin" ? "/admin" : "/student";
  return (
    <header className="navbar">
      <a className="brand" href={homePath}>
        <span className="brand-mark">
          <Icon name="check" />
        </span>
        <span>
          Study<span>Sync</span>
        </span>
      </a>
      <div className="nav-right">
        <span className="role-chip">
          {currentUser?.role === "admin"
            ? "Admin workspace"
            : "Student workspace"}
        </span>
        <div className="user-block">
          <span className="avatar">{currentUser?.name?.charAt(0)}</span>
          <span className="user-name">{currentUser?.name}</span>
        </div>
        <button
          className="icon-button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          aria-label="Log out"
          title="Log out"
        >
          <Icon name="logout" />
        </button>
      </div>
    </header>
  );
}
