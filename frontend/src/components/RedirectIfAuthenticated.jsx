import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
