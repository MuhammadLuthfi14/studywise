import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

// Modal generik untuk form tambah/edit (CRUD).
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Simpan",
  submitDisabled,
  loading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl p-0 xs:w-[calc(100vw-2rem)] sm:max-w-lg sm:rounded-xl">
        <DialogHeader className="shrink-0 px-4 pb-0 pt-5 xs:px-5 xs:pt-6 sm:px-6">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 xs:px-5 xs:py-4 sm:px-6">
          <div className="space-y-3 xs:space-y-4">{children}</div>
        </div>
        <DialogFooter className="shrink-0 border-t border-border px-4 py-3 xs:px-5 sm:px-6 sm:py-4">
          <Button
            variant="outline"
            className="h-10 w-full xs:h-9 sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            className="h-10 w-full xs:h-9 sm:w-auto"
            onClick={onSubmit}
            disabled={submitDisabled || loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
