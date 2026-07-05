import * as React from "react";

import { cn } from "./utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          // Base layout
          "flex h-10 w-full min-w-0 rounded-lg border px-3 py-2 text-base outline-none",
          // Colors — background putih bersih, border tipis slate
          "border-border/60 bg-white text-foreground placeholder:text-muted-foreground/50",
          // Transition halus
          "transition-all duration-200 ease-in-out",
          // Hover — border sedikit lebih gelap
          "hover:border-border",
          // Focus — border primary + ring lembut tanpa shadow keras
          "focus-visible:border-sw-primary focus-visible:ring-2 focus-visible:ring-sw-primary/15",
          // File input
          "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Selection
          "selection:bg-sw-primary/20 selection:text-foreground",
          // Disabled
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60",
          // Invalid
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
          // Desktop — font sedikit lebih kecil agar proporsional
          "md:text-sm",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
