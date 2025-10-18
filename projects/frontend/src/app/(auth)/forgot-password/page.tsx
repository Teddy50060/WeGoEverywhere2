"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { FormInput } from "@/components/form/input/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { toast } from "react-hot-toast";
import { apiCall } from "@/utils/api";
import Image from "next/image";

export default function ForgotPasswordRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ state สำหรับโหลด

  // validate email แบบเดียวกับหน้า register
  const isValidEmail = useMemo(() => {
    const v = email.trim();
    if (!v) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [email]);

  const canSubmit = isValidEmail && !isLoading; // ปิดปุ่มระหว่างโหลด

  // ยิง API + redirect
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true); // ✅ เริ่มโหลด

    try {
      await apiCall("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });

      // เก็บ email ไว้ใน sessionStorage
      sessionStorage.setItem("reset_email", email.trim());

      // แสดงสถานะโหลดประมาณ 1.5 วิ ก่อน redirect
      setTimeout(() => {
        router.push("/forgot-password/email-sent");
      }, 1500);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="font-alt">
      {/* ปุ่มย้อนกลับ */}
      <div className="px-5 pt-4">
        <Link
          href="/login"
          aria-label="Back to login"
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black
                    bg-[#EB6223] text-black active:scale-95 transition"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>

      {/* หัวเรื่อง */}
      <section className="mx-1 mt-2 rounded-t-[44px] bg-[var(--color-brand-primary)] px-10 pt-8 pb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
      </section>

      {/* การ์ดเนื้อหา */}
      <div className="relative -mt-10 w-full max-w-sm mx-auto flex-1 rounded-t-[50px] bg-[var(--color-brand-secondary)] p-5 shadow-lg border border-black/5 overflow-hidden pb-24 sm:pb-28">
        {/* ไอคอน */}
        <div className="mt-10 mb-6 flex items-center justify-center">
          <div className="relative h-40 w-40 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center overflow-hidden">
            <Image
              src="/images/request-password-reset-icon.svg"
              alt="Forgot password icon"
              fill
              className="object-contain scale-[0.75]"
              sizes="160px"
              priority
            />
          </div>
        </div>

        {/* คำอธิบาย */}
        <p className="px-2 text-center text-sm text-gray-700 font-medium mb-6">
          Please enter the email you used to sign up.
          <br />
          We’ll send you a link to reset your password
        </p>

        {/* ฟอร์ม */}
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <FormInput
            name="email"
            label="E-mail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />

          <SubmitButton
            text={isLoading ? "Sending..." : "Send reset link"} // ✅ เปลี่ยนข้อความตอนโหลด
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            className="mt-2 w-full rounded-3xl border border-black px-4 py-2.5 text-base font-bold text-black
                       bg-[#FFDCD5] hover:bg-[#F2C6C6] active:scale-95 transition-all duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB6223]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFDCD5] disabled:active:scale-100"
          />
        </form>
      </div>
    </main>
  );
}
