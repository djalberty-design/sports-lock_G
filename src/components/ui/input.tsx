import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md bg-wash px-3 text-ink shadow-[var(--shadow-paper)] tabular-nums",
        "placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        className,
      )}
      {...props}
    />
  );
}
