import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== role)
    return <Navigate to={`/${currentUser.role}`} replace />;
  return children;
}

export function PublicOnlyRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Navigate to={`/${currentUser.role}`} replace />;
  return children;
}

export function HomeRoute() {
  const { currentUser } = useAuth();
  return (
    <Navigate to={currentUser ? `/${currentUser.role}` : "/login"} replace />
  );
}
