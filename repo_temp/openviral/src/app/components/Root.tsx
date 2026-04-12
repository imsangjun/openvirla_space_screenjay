import { Outlet, Link, useLocation, useNavigate } from "react-router";
const logo = "/openviral_logo.png";
import { useAuth } from "../context/AuthContext";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
              <Link to="/contact" className={`text-base font-medium transition-colors ${isActive("/contact") ? "text-[#004DF6]" : "text-gray-600 hover:text-gray-900"}`}>Contact</Link>
              <Link to="/admin" className={`text-base font-medium transition-colors flex items-center gap-1 ${isActive("/admin") ? "text-[#004DF6]" : "text-gray-600 hover:text-gray-900"}`}>
                <span className="text-xs bg-[#004DF6] text-white px-1.5 py-0.5 rounded font-semibold">ADMIN</span>
              </Link>
            </div>

            {/* Auth Area - Right Side */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* User avatar & name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#004DF6] flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Logout
                </button>
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
                <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link></li>
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
