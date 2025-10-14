"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/lib/api/services/AuthService";
import { ApiError } from "@/lib/api/core/ApiError";

// Password validation rules - matching your backend
const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    id: "lowercase",
    label: "Contains lowercase letters",
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  {
    id: "uppercase",
    label: "Contains uppercase letters",
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    id: "number",
    label: "Contains numbers",
    test: (pwd: string) => /\d/.test(pwd),
  },
  {
    id: "symbol",
    label: "Contains symbols",
    test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(pwd),
  },
  {
    id: "no-repetition",
    label: "No character repetition (aaa, 111)",
    test: (pwd: string) => !/(.)\1{2,}/.test(pwd),
  },
  {
    id: "no-number-sequence",
    label: "No number sequence (123, 789)",
    test: (pwd: string) => {
      const sequences = ["0123456789", "9876543210"];
      return !sequences.some((seq) =>
        Array.from({ length: pwd.length - 2 }, (_, i) => pwd.slice(i, i + 3)).some(
          (chunk) => seq.includes(chunk)
        )
      );
    },
  },
  {
    id: "no-letter-sequence",
    label: "No letter sequence (abc, xyz)",
    test: (pwd: string) => {
      const lower = "abcdefghijklmnopqrstuvwxyz";
      const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return ![lower, upper, lower.split("").reverse().join(""), upper.split("").reverse().join("")].some(
        (seq) =>
          Array.from({ length: pwd.length - 2 }, (_, i) => pwd.slice(i, i + 3)).some((chunk) =>
            seq.includes(chunk)
          )
      );
    },
  },
  {
    id: "no-keyboard-pattern",
    label: "No keyboard pattern (qwerty, asdf)",
    test: (pwd: string) => {
      const patterns = ["qwerty", "asdfgh", "zxcvbn", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
      const lowerPwd = pwd.toLowerCase();
      return !patterns.some((pattern) => lowerPwd.includes(pattern));
    },
  },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  // Check if token exists in URL (Option B)
  useEffect(() => {
    if (!token) {
      setError("No reset token provided. Please check your email for the reset link.");
    }
  }, [token]);

  const validatePassword = (pwd: string) => {
    return PASSWORD_RULES.every((rule) => rule.test(pwd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password requirements
    if (!validatePassword(newPassword)) {
      setError("Password does not meet all requirements");
      setShowRequirements(true);
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setIsSubmitting(true);

    try {
      await AuthService.authControllerResetPassword({
        token,
        password: newPassword,
      });

      setSuccess(true);
    } catch (err: any) {
      // Handle ApiError from generated client
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setInvalidToken(true);
        } else {
          setError(err.message || "Failed to reset password. Please try again.");
        }
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error state - no token in URL OR invalid/expired token
  if (!token || invalidToken) {
    return (
      <div className="relative flex min-h-screen items-start justify-center bg-white pt-[30px]">
        <div className="relative w-full">
          {/* Pink Rectangle - positioned absolutely */}
          <div 
            className="absolute left-0 top-0 w-full rounded-[60px] bg-[#FFDCD5] shadow-xl"
            style={{ height: '201px', zIndex: 1 }}
          >
            {/* Header */}
            <div className="flex h-full items-center justify-center">
              <h1 className="text-[28px] font-bold text-black" style={{ transform: 'translateY(-50px)' }}>Reset Password</h1>
            </div>
          </div>

          {/* Yellow Rectangle - positioned below with overlap */}
          <div 
            className="relative rounded-[65px] bg-[#FFFBF0] px-8 shadow-lg"
            style={{ 
              marginTop: '81px',
              height: 'auto',
              paddingTop: '140px',
              paddingBottom: '40px',
              zIndex: 2
            }}
          >
            {/* Form inputs (disabled state) */}
            <div className="mb-6 opacity-50">
              <label className="mb-2 block text-[15px] font-semibold text-black">New Password</label>
              <input
                type="password"
                disabled
                className="w-full rounded-full border border-gray-800 bg-gray-100 px-5 py-3 text-base"
              />
            </div>

            <div className="mb-32 opacity-50">
              <label className="mb-2 block text-[15px] font-semibold text-black">Confirm Password</label>
              <input
                type="password"
                disabled
                className="w-full rounded-full border border-gray-800 bg-gray-100 px-5 py-3 text-base"
              />
            </div>

            <button
              disabled
              className="w-full rounded-full border border-gray-800 bg-[#FFDCD5] px-6 py-3.5 text-[17px] font-semibold text-black opacity-50"
            >
              Save
            </button>
          </div>

          {/* Dark overlay - on top of cards */}
          <div className="absolute inset-0 bg-black/50" style={{ zIndex: 3 }}></div>

          {/* Error Popup - on top of everything */}
          <div 
            className="absolute left-1/2 top-1/2 w-[calc(100%-64px)] max-w-lg -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 4 }}
          >
            <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-lg">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-800">Expired / Invalid link</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-white pt-[30px]">
        <div className="relative w-full">
          {/* Pink Rectangle - positioned absolutely */}
          <div 
            className="absolute left-0 top-0 w-full rounded-[60px] bg-[#FFDCD5] shadow-xl"
            style={{ height: '201px', zIndex: 1 }}
          >
            {/* Header */}
            <div className="flex h-full items-center justify-center">
              <h1 className="text-[28px] font-bold text-black" style={{ transform: 'translateY(-50px)' }}>Reset Password</h1>
            </div>
          </div>

          {/* Yellow Rectangle - positioned below with overlap */}
          <div 
            className="relative rounded-[65px] bg-[#FFFBF0] px-8 shadow-lg"
            style={{ 
              marginTop: '81px',
              height: 'auto',
              paddingTop: '140px',
              paddingBottom: '40px',
              zIndex: 2
            }}
          >
            {/* Success content */}
            <div className="flex flex-col items-center pb-20">
              {/* Lock icon with checkmark */}
              <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-[#FFE5E5]">
                <div className="relative">
                  <svg className="h-20 w-20 text-[#C9999E]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1C8.676 1 6 3.676 6 7v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2h-1V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                  </svg>
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-black">Password changed</h2>
              <p className="mb-12 text-center text-gray-600">Your Password has been changed successfully.</p>

              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-full border border-gray-800 bg-[#FFDCD5] px-6 py-3.5 text-[17px] font-semibold text-black transition-colors hover:bg-[#ffccc3]"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main reset form
  return (
    <div className="flex min-h-screen items-start justify-center bg-white pt-[30px]">
      <div className="relative w-full">
        {/* Pink Rectangle - positioned absolutely */}
        <div 
          className="absolute left-0 top-0 w-full rounded-[60px] bg-[#FFDCD5] shadow-xl"
          style={{ height: '201px' }}
        >
          {/* Header */}
          <div className="flex h-full items-center justify-center">
            <h1 className="text-[28px] font-bold text-black z-10" style={{ transform: 'translateY(-50px)' }}>Reset Password</h1>
          </div>
        </div>

        {/* Yellow Rectangle - positioned below with overlap */}
        <div 
          className="relative rounded-[65px] bg-[#FFFBF0] px-8 shadow-lg"
          style={{ 
            marginTop: '81px',
            height: 'auto',
            paddingTop: '140px',
            paddingBottom: '40px'
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div>
              {/* New Password Input */}
              <div className="mb-6">
                <label htmlFor="new-password" className="mb-2 block text-[15px] font-semibold text-black">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setShowRequirements(e.target.value.length > 0);
                      setError("");
                    }}
                    required
                    className="w-full rounded-full border border-gray-800 bg-white px-5 py-3 pr-12 text-base focus:border-gray-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-32">
                <label htmlFor="confirm-password" className="mb-2 block text-[15px] font-semibold text-black">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    required
                    className="w-full rounded-full border border-gray-800 bg-white px-5 py-3 pr-12 text-base focus:border-gray-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full border border-gray-800 bg-[#FFDCD5] px-6 py-3.5 text-[17px] font-semibold text-black transition-colors hover:bg-[#ffccc3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>

        {/* Password Requirements (shown when typing) */}
        {showRequirements && (
            <div className="mt-4 rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-700">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">
                  i
                </span>
                Password Requirements
              </h3>
              <div className="space-y-2">
                {PASSWORD_RULES.map((rule) => {
                  const isValid = rule.test(newPassword);
                  return (
                    <div key={rule.id} className="flex items-center text-sm">
                      {isValid ? (
                        <svg
                          className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="mr-2 h-5 w-5 flex-shrink-0 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={isValid ? "text-green-700" : "text-red-600"}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}