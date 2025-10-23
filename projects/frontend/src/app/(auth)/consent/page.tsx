"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { SubmitButton } from "@/components/form/Buttons";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/api";

export default function ConsentPage() {
  const router = useRouter();
  const [policyContent, setPolicyContent] = useState("Loading policy...");
  const [accepted, setAccepted] = useState(false); // ✅ state สำหรับ checkbox

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await apiCall("/api/consent/current-policy");
        setPolicyContent(response.content || response.text || "Policy content not available");
      } catch (error) {
        console.error("Failed to load policy:", error);
        setPolicyContent("Failed to load policy. Please try again later.");
      }
    };
    fetchPolicy();
  }, []);

  const handleNext = () => {
    if (!accepted) {
      toast.error("Please accept the policy before continuing.");
      return;
    }

    // ดำเนินการต่อ เช่น redirect ไปหน้า setup
    router.push("/profile-setup?from=oauth");
  };

  return (
    <main className="font-alt">
      {/* ปุ่ม Back */}
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

      <section className="mx-1 mt-2 rounded-t-[44px] bg-[#FFDCD5] px-10 pt-8 pb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Consent</h2>
      </section>

      <div className="relative -mt-10 w-full max-w-sm mx-auto flex-1 rounded-t-[50px] bg-[var(--color-brand-secondary)] p-5 shadow-lg border border-black/5
        overflow-hidden pb-24 sm:pb-28 ">

      {/* กล่อง policy */}
      <div className="mt-4">
        <div className="rounded-3xl bg-[#D7D0D0]/80 p-4 h-100 overflow-auto text-center text-sm font-semibold text-gray-800">
          {policyContent}
        </div>
      </div>

      {/* checkbox policy */}
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="accept"
          className="size-4 accent-[#F39C12]"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)} // ✅ อัปเดต state
        />
        <span className="font-semibold">I accept the policy</span>
      </label>

      {/* ปุ่ม Next */}
      <SubmitButton
        text="Next"
        type="button"
        onClick={handleNext}
        className={`mt-4 w-full rounded-3xl border border-black px-4 py-2.5 text-base font-bold text-black
          transition-all duration-200
          ${accepted
            ? "bg-[#FFDCD5] hover:bg-[#F2C6C6] active:scale-95"
            : "bg-gray-300 cursor-not-allowed opacity-60"
          }
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB6223]"
        `}
      />
      </div>
    </main>
  );
}
