import { useState } from "react";
import { Link } from "react-router";

interface Props {
  needsTerms: boolean;
  needsPrivacy: boolean;
  onAgree: () => Promise<void>;
  onLogout: () => void;
}

export function ReconsentModal({ needsTerms, needsPrivacy, onAgree, onLogout }: Props) {
  const [agreedTerms, setAgreedTerms] = useState(!needsTerms);
  const [agreedPrivacy, setAgreedPrivacy] = useState(!needsPrivacy);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = agreedTerms && agreedPrivacy && !submitting;

  const handleAgree = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      await onAgree();
    } catch (e) {
      setError(e instanceof Error ? e.message : "동의 저장에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">정책이 업데이트되었습니다</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          서비스를 계속 이용하려면 아래의 변경된 정책에 동의해주세요.
        </p>

        <div className="space-y-3 mb-6">
          {needsTerms && (
            <label className="flex items-start gap-3 cursor-pointer border border-gray-200 rounded-xl p-4 bg-gray-50">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#004DF6] focus:ring-[#004DF6] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I agree to the updated{" "}
                <Link to="/terms" target="_blank" className="text-[#004DF6] font-semibold hover:underline">
                  Terms of Service
                </Link>
                . <span className="text-red-500">*</span>
              </span>
            </label>
          )}

          {needsPrivacy && (
            <label className="flex items-start gap-3 cursor-pointer border border-gray-200 rounded-xl p-4 bg-gray-50">
              <input
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => setAgreedPrivacy(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#004DF6] focus:ring-[#004DF6] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I agree to the updated{" "}
                <Link to="/privacy" target="_blank" className="text-[#004DF6] font-semibold hover:underline">
                  Privacy Policy
                </Link>
                . <span className="text-red-500">*</span>
              </span>
            </label>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
          <button
            onClick={handleAgree}
            disabled={!canSubmit}
            className="flex-1 py-3 bg-[#004DF6] text-white font-semibold rounded-xl hover:bg-[#003ACB] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Saving..." : "Agree & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
