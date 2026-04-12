import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loginWithEmail, signupWithEmail, loginWithGoogle, loginWithFacebook, isLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (user) navigate("/campaign");
  }, [user, navigate]);

  useEffect(() => {
    if (searchParams.get("mode") === "signup") setIsLogin(false);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await loginWithEmail(formData.email, formData.password);
      } else {
        await signupWithEmail(formData.username, formData.email, formData.password);
      }
      navigate("/campaign");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "인증에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSocialLoading("google");
    try {
      await loginWithGoogle();
      navigate("/campaign");
    } catch {
      setError("Google 로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setError("");
    setSocialLoading("facebook");
    try {
      await loginWithFacebook();
      navigate("/campaign");
    } catch {
      setError("Facebook 로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Join OpenViral"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? "Login to access your campaigns" : "Create an account to get started"}
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required={!isLogin}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004DF6] focus:border-transparent outline-none transition-all"
                  placeholder="Choose a username" />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004DF6] focus:border-transparent outline-none transition-all"
                placeholder="your@email.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004DF6] focus:border-transparent outline-none transition-all"
                placeholder="Enter your password" />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-[#004DF6] hover:underline">Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-[#004DF6] text-white font-semibold rounded-xl hover:bg-[#0041cc] transition-all shadow-[2px_2px_8px_rgba(0,77,246,0.3),-2px_-2px_8px_rgba(128,167,251,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>Processing...</>
              ) : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-[#004DF6] font-semibold hover:underline">
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button type="button" onClick={handleGoogleLogin} disabled={!!socialLoading || isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {socialLoading === "google" ? (
                <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
              )}
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>

            <button type="button" onClick={handleFacebookLogin} disabled={!!socialLoading || isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {socialLoading === "facebook" ? (
                <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-gray-400">
            소셜 로그인은 Supabase OAuth를 통해 제공됩니다.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
