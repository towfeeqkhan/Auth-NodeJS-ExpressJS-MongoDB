import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) {
    // Not authenticated — redirect
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md text-center bg-white/6 border border-white/10 rounded-2xl px-8 py-10">
        <h1 className="text-white text-3xl font-medium">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-2">Welcome back!</p>

        <div className="mt-6 space-y-3 text-left">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              Name
            </p>
            <p className="text-white text-lg">{user.name}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              Email
            </p>
            <p className="text-white text-lg">{user.email}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              Role
            </p>
            <p className="text-white text-lg capitalize">{user.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full h-11 rounded-full text-white bg-red-600 hover:bg-red-500 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
