import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-black text-white shadow-[0px_4px_25px_0px_#0000000D] transition-all">
      <Link to="/" className="text-indigo-500">
        <h1 className="text-2xl font-bold">AgentHub</h1>
      </Link>

      <ul className="md:flex hidden items-center gap-10">
        <li>
          <Link className="hover:text-gray-500/80 transition" to="/">
            Home
          </Link>
        </li>
        <li>
          <a className="hover:text-gray-500/80 transition" href="#">
            Services
          </a>
        </li>
        <li>
          <a className="hover:text-gray-500/80 transition" href="#">
            Portfolio
          </a>
        </li>
        <li>
          <a className="hover:text-gray-500/80 transition" href="#">
            Pricing
          </a>
        </li>
      </ul>

      {/* ── Conditional: Avatar (logged in) or Get Started (guest) ── */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          {/* Avatar Button */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm cursor-pointer transition-all active:scale-95"
            aria-label="User menu"
          >
            {getInitials(user.name)}
          </button>

          {/* Dropdown Card */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-6 z-50">
              {/* Arrow */}
              <div className="absolute -top-2 right-4 w-4 h-4 bg-[#1a1a2e] border-l border-t border-white/10 rotate-45"></div>

              {/* User Info */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-xl mb-3">
                  {getInitials(user.name)}
                </div>
                <h3 className="text-white text-lg font-semibold">
                  {user.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                {user.role && (
                  <span className="mt-2 text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full capitalize">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Divider */}
              <hr className="border-white/10 my-4" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full h-10 rounded-full text-white bg-red-600 hover:bg-red-500 transition cursor-pointer text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          type="button"
          className="bg-white text-gray-600 border border-gray-300 md:inline hidden text-sm hover:bg-gray-50 active:scale-95 transition-all w-40 h-11 rounded-full"
        >
          Get started
        </button>
      )}

      {/* Mobile menu button */}
      <button
        aria-label="menu-btn"
        type="button"
        className="menu-btn inline-block md:hidden active:scale-90 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="#fff"
        >
          <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
        </svg>
      </button>

      {/* Mobile menu */}
      <div className="mobile-menu absolute top-[70px] left-0 w-full bg-white p-6 hidden md:hidden">
        <ul className="flex flex-col space-y-4 text-lg">
          <li>
            <a href="#" className="text-sm">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-sm">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="text-sm">
              Portfolio
            </a>
          </li>
          <li>
            <a href="#" className="text-sm">
              Pricing
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
