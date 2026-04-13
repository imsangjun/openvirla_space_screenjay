import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { Check } from "lucide-react";

// ── 상수 ──────────────────────────────────────────────────────────────
const NATIONALITIES = [
  "Korean","American","Japanese","Chinese","British","Canadian",
  "Australian","German","French","Spanish","Italian","Brazilian",
  "Mexican","Indian","Filipino","Thai","Vietnamese","Indonesian","Other",
];
const COUNTRIES = [
  "South Korea","United States","Japan","China","United Kingdom",
  "Canada","Australia","Germany","France","Spain","Italy","Brazil",
  "Mexico","India","Philippines","Thailand","Vietnam","Indonesia","Other",
];
const CONTENT_SPECIALTIES = ["Product reviews","Lifestyle","Storytelling","Aesthetic shots","etc"];
const STRONGEST_POINTS    = ["Editing","Storytelling","Acting","Voiceover","etc"];
const SHOOT_FORMATS       = ["Talking to camera","Voiceover","Product-only shots","Trend-based content"];

// ── 공통 스타일 ────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004DF6] focus:border-transparent outline-none transition-all text-sm";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

// ── 스피너 ─────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
  </svg>
);

// ── 타입 ──────────────────────────────────────────────────────────────
type Mode = "login" | "signup" | "forgot" | "verify";

export function Login() {
  const navigate    = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loginWithEmail, signupWithEmail, loginWithGoogle, isLoading } = useAuth();

  const [mode, setMode]   = useState<Mode>("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Login fields ──
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // ── Sign Up fields ──
  const [signupData, setSignupData] = useState({
    username: "", email: "", password: "", confirmPassword: "",
    fullName: "", phoneNumber: "", birthYear: "",
    nationality: "", countryLocation: "",
    instagramLink: "",
    telegramId: "", tiktokLink: "", youtubeLink: "", otherPlatformLink: "",
    contentSpecialtyEtc: "",
    strongestPointEtc: "",
    equipment: "",
  });
  const [shootFormats, setShootFormats] = useState<string[]>([]);
  const [contentSpecialties, setContentSpecialties] = useState<string[]>([]);
  const [strongestPoints, setStrongestPoints] = useState<string[]>([]);

  // ── Forgot password fields ──
  const [forgotEmail, setForgotEmail] = useState("");

  // ── Verify / Reset fields ──
  const [verifyCode, setVerifyCode]       = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmNewPw, setConfirmNewPw]   = useState("");
  const [resetEmail, setResetEmail]       = useState(""); // 이전 단계에서 넘어온 이메일

  // ── 초기화 ────────────────────────────────────────────────────────
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useEffect(() => { if (user) navigate("/campaign"); }, [user, navigate]);
  useEffect(() => {
    if (searchParams.get("mode") === "signup") setMode("signup");
  }, [searchParams]);

  const reset = () => { setError(""); setSuccess(""); };

  // ── 핸들러: 로그인 ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); reset();
    try {
      await loginWithEmail(loginData.email, loginData.password);
      navigate("/campaign");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    }
  };

  // ── 핸들러: 회원가입 ──────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); reset();

    if (signupData.password !== signupData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다."); return;
    }
    if (signupData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다."); return;
    }
    if (contentSpecialties.length === 0) {
      setError("Content Specialty를 하나 이상 선택해주세요."); return;
    }
    if (strongestPoints.length === 0) {
      setError("Strongest Point를 하나 이상 선택해주세요."); return;
    }

    const profile = {
      fullName:             signupData.fullName,
      phoneNumber:          signupData.phoneNumber,
      telegramId:           signupData.telegramId,
      birthYear:            signupData.birthYear,
      nationality:          signupData.nationality,
      countryLocation:      signupData.countryLocation,
      instagramLink:        signupData.instagramLink,
      tiktokLink:           signupData.tiktokLink,
      youtubeLink:          signupData.youtubeLink,
      otherPlatformLink:    signupData.otherPlatformLink,
      contentSpecialties,
      contentSpecialtyEtc:  signupData.contentSpecialtyEtc,
      strongestPoints,
      strongestPointEtc:    signupData.strongestPointEtc,
      shootFormats,
      equipment:            signupData.equipment,
    };

    try {
      setSubmitting(true);
      await signupWithEmail(signupData.username, signupData.email, signupData.password, profile);
      setSuccess("가입이 완료됐습니다! 이메일을 확인해 인증 후 로그인해주세요.");
      setMode("login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── 핸들러: 비밀번호 찾기 (이메일 전송) ──────────────────────────
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); reset(); setSubmitting(true);
    try {
      const { error: sbErr } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/login?mode=reset`,
      });
      if (sbErr) throw new Error(sbErr.message);
      setResetEmail(forgotEmail);
      setSuccess("인증 코드가 이메일로 전송됐습니다. 이메일을 확인해주세요.");
      setMode("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "이메일 전송에 실패했습니다.");
    } finally { setSubmitting(false); }
  };

  // ── 핸들러: 인증코드 확인 + 비밀번호 재설정 ─────────────────────
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault(); reset();

    if (newPassword !== confirmNewPw) {
      setError("새 비밀번호가 일치하지 않습니다."); return;
    }
    if (newPassword.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다."); return;
    }

    setSubmitting(true);
    try {
      // OTP(이메일 인증코드)로 세션 교환
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: resetEmail,
        token: verifyCode,
        type: "recovery",
      });
      if (verifyErr) throw new Error("인증 코드가 올바르지 않습니다.");

      // 새 비밀번호로 업데이트
      const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
      if (updateErr) throw new Error(updateErr.message);

      setSuccess("비밀번호가 성공적으로 변경됐습니다!");
      setTimeout(() => { setMode("login"); setSuccess(""); }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "비밀번호 재설정에 실패했습니다.");
    } finally { setSubmitting(false); }
  };

  // ── 핸들러: Google 로그인 ────────────────────────────────────────
  const handleGoogle = async () => {
    reset(); setGoogleLoading(true);
    try { await loginWithGoogle(); }
    catch { setError("Google 로그인에 실패했습니다."); }
    finally { setGoogleLoading(false); }
  };

  const toggleShootFormat = (fmt: string) => {
    setShootFormats(prev => prev.includes(fmt) ? prev.filter(f => f !== fmt) : [...prev, fmt]);
  };
  const toggleContentSpecialty = (opt: string) => {
    setContentSpecialties(prev => {
      const next = prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt];
      if (!next.includes("etc")) setSignupData(d => ({ ...d, contentSpecialtyEtc: "" }));
      return next;
    });
  };
  const toggleStrongestPoint = (opt: string) => {
    setStrongestPoints(prev => {
      const next = prev.includes(opt) ? prev.filter(v => v !== opt) : [...prev, opt];
      if (!next.includes("etc")) setSignupData(d => ({ ...d, strongestPointEtc: "" }));
      return next;
    });
  };

  // ── 렌더 헬퍼 ─────────────────────────────────────────────────────
  const renderFeedback = () => (
    <>
      {error   && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{success}</div>}
    </>
  );

  const submitBtn = (label: string, loading: boolean) => (
    <button type="submit" disabled={loading || isLoading}
      className="w-full py-3 bg-[#004DF6] text-white font-semibold rounded-xl hover:bg-[#0041cc] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
      {(loading || isLoading) ? <><Spinner />Processing...</> : label}
    </button>
  );

  // ════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-600 mt-2">Login to access your campaigns</p>
              </div>
              {renderFeedback()}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})}
                    required className={inputCls} placeholder="your@email.com" />
                </div>
                <div>
                  <label className={labelCls}>Password</label>
                  <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})}
                    required className={inputCls} placeholder="Enter your password" />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => { reset(); setMode("forgot"); }}
                    className="text-sm text-[#004DF6] hover:underline">Forgot password?</button>
                </div>
                {submitBtn("Login", false)}
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">Don't have an account?{" "}
                  <button onClick={() => { reset(); setMode("signup"); }} className="text-[#004DF6] font-semibold hover:underline">Sign up</button>
                </p>
              </div>

              {/* Google 로그인 */}
              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div>
              </div>
              <div className="mt-6">
                <button type="button" onClick={handleGoogle} disabled={googleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-60">
                  {googleLoading ? <Spinner /> : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.266 9.765C6.199 6.939 8.854 4.91 12 4.91c1.691 0 3.218.6 4.418 1.582l3.491-3.491C17.782 1.145 15.054 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
                      <path fill="#34A853" d="M16.041 18.013C14.951 18.716 13.566 19.09 12 19.09c-3.133 0-5.781-2.014-6.723-4.822L1.237 17.335C3.193 21.294 7.265 24 12 24c2.933 0 5.735-1.043 7.834-3.001l-3.793-2.986z"/>
                      <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.09-1.473-.273-2.182H12v4.636h6.436c-.301 1.56-1.154 2.767-2.379 3.559L19.834 21z"/>
                      <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.135-1.533.368-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.444 3.73 1.237 5.335l4.04-3.067z"/>
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                </button>
              </div>
              <p className="mt-3 text-xs text-center text-gray-400">소셜 로그인은 Supabase OAuth를 통해 제공됩니다.</p>
            </>
          )}

          {/* ── SIGN UP ── */}
          {mode === "signup" && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Join OpenViral</h1>
                <p className="text-gray-600 mt-2">Create your account to get started</p>
              </div>
              {renderFeedback()}
              <form onSubmit={handleSignup} className="space-y-6">

                {/* Account Info */}
                <div>
                  <h3 className="text-sm font-bold text-[#004DF6] uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Account Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className={labelCls}>Username *</label>
                      <input type="text" value={signupData.username} onChange={e => setSignupData({...signupData, username: e.target.value})}
                        required className={inputCls} placeholder="Choose a username" />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Email *</label>
                      <input type="email" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})}
                        required className={inputCls} placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className={labelCls}>Password *</label>
                      <input type="password" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})}
                        required className={inputCls} placeholder="Min. 6 characters" />
                    </div>
                    <div>
                      <label className={labelCls}>Confirm Password *</label>
                      <input type="password" value={signupData.confirmPassword} onChange={e => setSignupData({...signupData, confirmPassword: e.target.value})}
                        required className={`${inputCls} ${signupData.confirmPassword && signupData.password !== signupData.confirmPassword ? "border-orange-400 focus:ring-orange-400" : ""}`} placeholder="Re-enter password" />
                      {signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
                        <p className="mt-1.5 text-xs font-medium text-orange-500">Passwords do not match.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div>
                  <h3 className="text-sm font-bold text-[#004DF6] uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Personal Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input type="text" value={signupData.fullName} onChange={e => setSignupData({...signupData, fullName: e.target.value})}
                        required className={inputCls} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <input type="tel" value={signupData.phoneNumber} onChange={e => setSignupData({...signupData, phoneNumber: e.target.value})}
                        required className={inputCls} placeholder="+82 10-0000-0000" />
                    </div>
                    <div>
                      <label className={labelCls}>Birth Year *</label>
                      <input type="text" value={signupData.birthYear} onChange={e => setSignupData({...signupData, birthYear: e.target.value})}
                        required className={inputCls} placeholder="e.g. 1995" maxLength={4} />
                    </div>
                    <div>
                      <label className={labelCls}>Telegram ID <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" value={signupData.telegramId} onChange={e => setSignupData({...signupData, telegramId: e.target.value})}
                        className={inputCls} placeholder="@username" />
                    </div>
                    <div>
                      <label className={labelCls}>Nationality *</label>
                      <select value={signupData.nationality} onChange={e => setSignupData({...signupData, nationality: e.target.value})}
                        required className={inputCls}>
                        <option value="">Select nationality</option>
                        {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Country of Residence *</label>
                      <select value={signupData.countryLocation} onChange={e => setSignupData({...signupData, countryLocation: e.target.value})}
                        required className={inputCls}>
                        <option value="">Select country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Instagram Link *</label>
                      <input type="url" value={signupData.instagramLink} onChange={e => setSignupData({...signupData, instagramLink: e.target.value})}
                        required className={inputCls} placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                      <label className={labelCls}>TikTok Link <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="url" value={signupData.tiktokLink} onChange={e => setSignupData({...signupData, tiktokLink: e.target.value})}
                        className={inputCls} placeholder="https://tiktok.com/@..." />
                    </div>
                    <div>
                      <label className={labelCls}>YouTube Link <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="url" value={signupData.youtubeLink} onChange={e => setSignupData({...signupData, youtubeLink: e.target.value})}
                        className={inputCls} placeholder="https://youtube.com/@..." />
                    </div>
                    <div>
                      <label className={labelCls}>Other Platform <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="url" value={signupData.otherPlatformLink} onChange={e => setSignupData({...signupData, otherPlatformLink: e.target.value})}
                        className={inputCls} placeholder="https://..." />
                    </div>
                  </div>
                </div>

                {/* Creator Profile */}
                <div>
                  <h3 className="text-sm font-bold text-[#004DF6] uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Creator Profile</h3>
                  <div className="space-y-4">

                    {/* Q1 */}
                    <div>
                      <label className={labelCls}>Q1. Content Specialty * <span className="text-gray-400 font-normal">(복수 선택 가능)</span></label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {CONTENT_SPECIALTIES.map(opt => (
                          <button key={opt} type="button" onClick={() => toggleContentSpecialty(opt)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                              contentSpecialties.includes(opt)
                                ? "bg-[#004DF6] text-white border-[#004DF6]"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#004DF6]"
                            }`}>
                            {contentSpecialties.includes(opt) && <Check className="w-3.5 h-3.5" />}
                            {opt === "etc" ? "Other" : opt}
                          </button>
                        ))}
                      </div>
                      {contentSpecialties.includes("etc") && (
                        <input type="text" value={signupData.contentSpecialtyEtc}
                          onChange={e => setSignupData({...signupData, contentSpecialtyEtc: e.target.value})}
                          className={`${inputCls} mt-2`} placeholder="Please specify" />
                      )}
                    </div>

                    {/* Q2 */}
                    <div>
                      <label className={labelCls}>Q2. Strongest Point * <span className="text-gray-400 font-normal">(복수 선택 가능)</span></label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {STRONGEST_POINTS.map(opt => (
                          <button key={opt} type="button" onClick={() => toggleStrongestPoint(opt)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                              strongestPoints.includes(opt)
                                ? "bg-[#004DF6] text-white border-[#004DF6]"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#004DF6]"
                            }`}>
                            {strongestPoints.includes(opt) && <Check className="w-3.5 h-3.5" />}
                            {opt === "etc" ? "Other" : opt}
                          </button>
                        ))}
                      </div>
                      {strongestPoints.includes("etc") && (
                        <input type="text" value={signupData.strongestPointEtc}
                          onChange={e => setSignupData({...signupData, strongestPointEtc: e.target.value})}
                          className={`${inputCls} mt-2`} placeholder="Please specify" />
                      )}
                    </div>

                    {/* Q3 Shoot Formats */}
                    <div>
                      <label className={labelCls}>Q3. Shoot Formats *</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {SHOOT_FORMATS.map(fmt => (
                          <button key={fmt} type="button" onClick={() => toggleShootFormat(fmt)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                              shootFormats.includes(fmt)
                                ? "bg-[#004DF6] text-white border-[#004DF6]"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#004DF6]"
                            }`}>{fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q4 Equipment */}
                    <div>
                      <label className={labelCls}>Q4. Equipment *</label>
                      <input type="text" value={signupData.equipment}
                        onChange={e => setSignupData({...signupData, equipment: e.target.value})}
                        required className={inputCls} placeholder="e.g. iPhone 15 Pro, Sony A7III" />
                    </div>
                  </div>
                </div>

                {submitBtn("Create Account", false)}
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">Already have an account?{" "}
                  <button onClick={() => { reset(); setMode("login"); }} className="text-[#004DF6] font-semibold hover:underline">Login</button>
                </p>
              </div>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === "forgot" && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
                <p className="text-gray-600 mt-2">Enter your email to receive a reset code</p>
              </div>
              {renderFeedback()}
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    required className={inputCls} placeholder="your@email.com" />
                </div>
                {submitBtn("Send Reset Code", submitting)}
              </form>
              <div className="mt-6 text-center">
                <button onClick={() => { reset(); setMode("login"); }} className="text-sm text-gray-500 hover:text-gray-900">
                  ← Back to Login
                </button>
              </div>
            </>
          )}

          {/* ── VERIFY CODE + RESET PASSWORD ── */}
          {mode === "verify" && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-600 mt-2">Enter the code sent to <span className="font-semibold text-gray-800">{resetEmail}</span></p>
              </div>
              {renderFeedback()}
              <form onSubmit={handleVerifyAndReset} className="space-y-5">
                <div>
                  <label className={labelCls}>Verification Code</label>
                  <input type="text" value={verifyCode} onChange={e => setVerifyCode(e.target.value)}
                    required className={inputCls} placeholder="Enter 6-digit code" maxLength={6} />
                </div>
                <div>
                  <label className={labelCls}>New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    required className={inputCls} placeholder="Min. 6 characters" />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <input type="password" value={confirmNewPw} onChange={e => setConfirmNewPw(e.target.value)}
                    required className={`${inputCls} ${confirmNewPw && newPassword !== confirmNewPw ? "border-orange-400 focus:ring-orange-400" : ""}`} placeholder="Re-enter new password" />
                  {confirmNewPw && newPassword !== confirmNewPw && (
                    <p className="mt-1.5 text-xs font-medium text-orange-500">Passwords do not match.</p>
                  )}
                </div>
                {submitBtn("Reset Password", submitting)}
              </form>
              <div className="mt-6 text-center">
                <button onClick={() => { reset(); setMode("forgot"); }} className="text-sm text-gray-500 hover:text-gray-900">
                  ← Resend Code
                </button>
              </div>
            </>
          )}

        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
