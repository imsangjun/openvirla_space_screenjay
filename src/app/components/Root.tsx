import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { User, LogOut, ChevronDown } from "lucide-react";
const logo = "/openviral_logo.png";
import { useAuth } from "../context/AuthContext";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  const handleMyPage = () => {
    setDropdownOpen(false);
    navigate("/mypage");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-12 w-12" />
              <span className="font-semibold text-2xl text-gray-900">OpenViral</span>
            </Link>

            {/* Navigation Links - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-12">
              <Link to="/" className={`text-base font-medium transition-colors ${isActive("/") ? "text-[#004DF6]" : "text-gray-600 hover:text-gray-900"}`}>Home</Link>
              <Link to="/campaign" className={`text-base font-medium transition-colors ${isActive("/campaign") ? "text-[#004DF6]" : "text-gray-600 hover:text-gray-900"}`}>Campaign</Link>
            </div>

            {/* Auth Area - Right Side */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full hover:opacity-80 transition-all focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-[#004DF6] flex items-center justify-center text-white text-sm font-bold overflow-hidden ring-2 ring-[#004DF6]/20 shadow-md">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-14 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1.5">
                      <button
                        onClick={handleMyPage}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f0f4ff] hover:text-[#004DF6] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Page
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-[#004DF6] font-medium hover:text-[#0041cc] transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <span className="font-semibold text-lg text-gray-900">OpenViral</span>
              </div>
              <p className="text-gray-600 text-sm">
                Global viral marketing agency helping brands reach millions through innovative campaigns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link></li>
                <li><Link to="/campaign" className="text-gray-600 hover:text-gray-900 text-sm">Campaign</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600 text-sm">
                Email: hello@openviral.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2026 OpenViral. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
