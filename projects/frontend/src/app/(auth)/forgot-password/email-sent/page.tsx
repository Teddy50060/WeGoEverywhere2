"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiCall } from "@/utils/api";
import { SubmitButton } from "@/components/form/Buttons";

export default function ForgotPasswordEmailSentPage() {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  const resendEmail = async () => {
    const email = sessionStorage.getItem("reset_email");
    if (!email) {
      toast.error("No email found, please try again.");
      router.push("/forgot-password");
      return;
    }

    try {
      setIsSending(true);
      await apiCall("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("Password reset email resent!");
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="font-alt">
      {/* แบรนด์ + ปุ่มย้อนกลับ */}
      <div className="px-5 pt-4">
        <Link
          href="/login"
          aria-label="Back to login"
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black
                    bg-[#EB6223] text-black active:scale-95 transition"
        >
          ←
        </Link>
      </div>

      {/* หัวเรื่อง */}
      <section className="mx-1 mt-2 rounded-t-[44px] bg-[var(--color-brand-primary)] px-10 pt-8 pb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
      </section>

      {/* การ์ดเนื้อหา */}
      <div className="relative -mt-10 w-full max-w-sm mx-auto flex-1 rounded-t-[50px] bg-[var(--color-brand-secondary)] p-5 shadow-lg border border-black/5 overflow-hidden pb-20 sm:pb-24">
        {/* ไอคอน */}
        <div className="mt-10 mb-6 flex items-center justify-center">
          <div className="relative h-40 w-40 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center overflow-hidden">
            <Image
              src="/images/email-sent-icon.svg"
              alt="Email sent icon"
              fill
              className="object-contain scale-[0.8]"
              sizes="160px"
              priority
            />
          </div>
        </div>

        {/* ข้อความหลัก */}
        <h3 className="text-center text-xl font-bold text-gray-900 mb-2">
          Check your inbox
        </h3>
        <p className="px-4 text-center text-sm text-gray-700 font-medium mb-8 leading-relaxed">
          If an account exists with that email,
          <br />
          we’ve sent the password reset link.
        </p>

        {/* ปุ่ม resend */}
        <div className="text-center text-sm text-gray-700">
          Didn’t get the email?
        </div>

        <SubmitButton
          text={isSending ? "Resending..." : "Resend"}
          disabled={isSending}
          onClick={resendEmail}
          className="mt-2 w-full rounded-3xl border border-black px-4 py-2.5 text-base font-bold text-black
                    bg-[#FFDCD5] hover:bg-[#F2C6C6] active:scale-95 transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB6223]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFDCD5] disabled:active:scale-100"
        />
      </div>
    </main>
  );
}
