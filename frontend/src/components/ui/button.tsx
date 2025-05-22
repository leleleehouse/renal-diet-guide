import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
  {
    variants: {
      variant: {
        default: "bg-[#3182F6] text-white hover:bg-[#1e6ae1]",
        secondary:
          "bg-white border border-[#D1D6DB] text-[#333D4B] hover:bg-[#F2F4F6]",
        outline:
          "bg-transparent border border-[#D1D6DB] text-[#333D4B] hover:bg-[#F2F4F6]",
        ghost:
          "bg-transparent text-[#333D4B] hover:bg-[#F9FAFB]",
        link: "text-[#3182F6] underline underline-offset-4 hover:text-[#1e6ae1]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#dc2626] focus-visible:ring-red-500",
      },
      size: {
        default: "h-12 px-6 text-[15px] rounded-full",
        sm: "h-10 px-4 text-sm rounded-full",
        lg: "h-14 px-8 text-base rounded-full",
        icon: "w-12 h-12 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
