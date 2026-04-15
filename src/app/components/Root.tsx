import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";
const logo = "/openviral_logo.png";
import { useAuth } from "../context/AuthContext";
import { ReconsentModal } from "./ReconsentModal";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, needsTermsReconsent, needsPrivacyReconsent, acceptPolicies } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 재동의 모달 표시 여부: 로그인 + 버전 불일치 + 정책 페이지가 아닐 때만
  const isPolicyPage =
    location.pathname === "/terms" ||
    location.pathname === "/privacy" ||
    location.pathname === "/login";
  const showReconsent =
    !!user &&
    !!user.profile &&
    (needsTermsReconsent || needsPrivacyReconsent) &&
    !isPolicyPage;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/");
  };

  const handleMyPage = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/mypage");
  };

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 z-10">
              <img src={logo} alt="Logo" className="h-8 w-8 md:h-12 md:w-12" />
              <span className="text-lg md:text-2xl tracking-[-0.03em]" style={{fontWeight: 600}}><span className="text-gray-900">Open</span><span className="text-[#004DF6]">Space</span></span>
            </Link>

            {/* Desktop Navigation Links - Centered */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-12">
              <Link to="/" className={`text-base font-medium transition-colors ${isActive("/") ? "text-[#004DF6]" : "text-gray-600 hover:text-gray-900"}`}>Home</Link>
              <Link to="/campaign" className={`text-base font-medium transition-colors ${isActive("/campaign") ? "text-[#004DF6]" : "text-gray-600 hover:text-gray-900"}`}>Campaign</Link>
            </div>

            {/* Desktop Auth Area - Right Side */}
            <div className="hidden md:block">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
            <div className="px-4 py-4 space-y-3">
              {/* Navigation Links */}
              <button
                onClick={() => handleNavClick("/")}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive("/") ? "bg-[#f0f4ff] text-[#004DF6]" : "text-gray-700 hover:bg-gray-100"}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("/campaign")}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive("/campaign") ? "bg-[#f0f4ff] text-[#004DF6]" : "text-gray-700 hover:bg-gray-100"}`}
              >
                Campaign
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2" />

              {/* Auth Section */}
              {user ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#004DF6] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
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
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleMyPage}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    My Page
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick("/login")}
                  className="w-full px-4 py-3 rounded-lg bg-[#004DF6] text-white text-base font-medium hover:bg-[#0041cc] transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <Outlet />

      {/* 정책 변경 시 재동의 모달 */}
      {showReconsent && (
        <ReconsentModal
          needsTerms={needsTermsReconsent}
          needsPrivacy={needsPrivacyReconsent}
          onAgree={async () => {
            await acceptPolicies({
              terms: needsTermsReconsent,
              privacy: needsPrivacyReconsent,
            });
          }}
          onLogout={async () => {
            await logout();
            navigate("/");
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-5">
            <img src="/openviral_logo.png" alt="Logo" className="h-8 w-8" />
            <span className="text-base tracking-[-0.03em]" style={{fontWeight: 600}}><span className="text-gray-900">Open</span><span className="text-[#004DF6]">Space</span></span>
          </div>
          <div className="text-xs text-gray-500 space-y-1.5 leading-relaxed">
            <p>대표자 : 이영민 &nbsp;|&nbsp; 소재지 : 인하대학교 인하드림센터 1관 608호</p>
            <p>이메일 : <a href="mailto:likkoreaofficial@gmail.com" className="hover:text-gray-700 underline">likkoreaofficial@gmail.com</a></p>
            <p>인스타그램 : <a href="https://instagram.com/openviral_space" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 underline">openviral_space</a></p>
            <p>개인정보관리책임자 : 임상준 &nbsp;|&nbsp; 호스팅제공자 : Vercel</p>
          </div>
          <div className="mt-5 pt-5 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Link
                to="/terms"
                className="text-xs text-gray-500 hover:text-gray-800 underline text-left"
              >
                이용약관
              </Link>
              <span className="hidden sm:inline text-gray-300 text-xs">/</span>
              <Link
                to="/privacy"
                className="text-xs text-gray-500 hover:text-gray-800 underline text-left"
              >
                개인정보처리방침
              </Link>
            </div>
            <span className="sm:ml-auto text-xs text-gray-400">© 2026 OpenSpace. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
