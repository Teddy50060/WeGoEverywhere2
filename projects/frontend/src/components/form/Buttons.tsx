"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

type BtnSize = "default" | "lg" | "sm";

type SubmitButtonProps = {
  className?: string;
  size?: BtnSize;
  text?: string;
  type?: "submit" | "button" | "reset"; // เพิ่ม
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // เพิ่ม

  disabled?: boolean;
};

export const SubmitButton = ({
  className,
  size,
  text,
  type = "submit",
  onClick,
  disabled,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  const isSubmit = type === "submit";

  const computedDisabled = isSubmit ? pending || disabled : disabled;

  return (
    <Button
      type={type}
      size={size}
      onClick={onClick} // ส่งต่อ onClick
      disabled={computedDisabled}
      className={`
        ${className} capitalize
        ${
          computedDisabled
            ? "bg-gray-300 cursor-not-allowed opacity-60 border border-black text-black"
            : "bg-[#FFDCD5] hover:bg-[#F2C6C6] active:scale-95 border border-black text-black"
        }
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB6223]
      `}
    >
      {isSubmit && pending ? (
        <>
          <RotateCw className="animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </Button>
  );
};
