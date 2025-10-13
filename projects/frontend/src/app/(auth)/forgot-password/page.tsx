"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { FormInput } from "@/components/form/input/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { toast } from "react-hot-toast";

export default function ForgotPasswordRequestPage() {
  const router = useRouter();

  // UI-only: แค่เดโม กดแล้วพาไปหน้าถัดไป (ยังไม่ยิง API)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & {
      email: HTMLInputElement;
    };
    const email = form.email.value.trim();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Check your inbox for the reset link");
    router.push("/forgot-password/email-sent"); // หน้าคอนเฟิร์มส่งอีเมล (เดี๋ยวอธิบายโครงสร้างไฟล์ด้านล่าง)
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
          <ArrowLeft size={16} />
        </Link>
      </div>

      {/* หัวเรื่องโค้งสีชมพู */}
      <section className="mx-1 mt-2 rounded-t-[44px] bg-[#FFDCD5] px-10 pt-8 pb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
      </section>

      {/* การ์ดเนื้อหาโทนครีม */}
      <div className="relative -mt-10 w-full max-w-sm mx-auto flex-1 rounded-t-[50px] bg-[var(--color-brand-secondary)] p-5 shadow-lg border border-black/5 overflow-hidden pb-24 sm:pb-28">
        {/* วงกลมไอคอนกุญแจ */}
        <div className="mt-4 mb-6 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full bg-[#F6C7C1] flex items-center justify-center border border-black/10">
            <Lock className="opacity-80" size={64} />
          </div>
        </div>

        {/* คำอธิบาย */}
        <p className="px-2 text-center text-sm text-gray-700 font-medium mb-6">
          Please enter the email you used to sign up.
          <br />
          We’ll send you a link to reset your password
        </p>

        {/* ฟอร์ม */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormInput
            name="email"
            label="E-mail"
            type="email"
            placeholder="you@example.com"
          />

          <SubmitButton
            text="Send reset link"
            className="
              mt-2 w-full rounded-3xl border border-black px-4 py-2.5 text-base font-bold text-black
              bg-[#FFDCD5] hover:bg-[#F2C6C6] active:scale-95 transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB6223]
            "
          />
        </form>
      </div>
    </main>
  );
}
