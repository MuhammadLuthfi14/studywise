import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const Icon = visible ? EyeOff : Eye;
    const label = visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi";

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sw-primary/30 disabled:pointer-events-none disabled:opacity-50"
          aria-label={label}
          aria-pressed={visible}
          title={label}
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
