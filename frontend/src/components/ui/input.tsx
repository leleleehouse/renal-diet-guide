import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full h-11 px-4 py-2 rounded-md text-[15px] text-[#333D4B] placeholder:text-[#8B95A1] bg-white border border-[#D1D6DB] shadow-sm transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6] focus-visible:border-[#3182F6]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500",
        "dark:bg-[#1a1a1a] dark:text-white dark:border-[#3a3d40] dark:placeholder:text-[#6b7684]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
