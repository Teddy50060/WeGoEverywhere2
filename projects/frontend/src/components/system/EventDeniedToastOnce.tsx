"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
let lastFiredKey: string | null = null;

export default function EventDeniedToastOnce() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const denied = sp.get("denied") === "1";
    const key = `${window.location.pathname}?${sp.toString()}`;

    if (denied) {
      if (lastFiredKey === key) return; 
      lastFiredKey = key;

      toast.error("Unauthorized to edit this event");

      const params = new URLSearchParams(sp.toString());
      params.delete("denied");
      const nextUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      router.replace(nextUrl, { scroll: false });
    } else {
      lastFiredKey = null;
    }
  }, [sp, router]);

  return null;
}
