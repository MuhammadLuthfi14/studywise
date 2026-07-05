import { Badge } from "./ui/badge";
import type { Status } from "../types";

// Badge status aktif/nonaktif.
export function StatusBadge({ status }: { status: Status }) {
  if (status === "aktif") {
    return (
      <Badge className="border-transparent bg-sw-success/15 text-sw-success hover:bg-sw-success/15">
        Aktif
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Nonaktif
    </Badge>
  );
}
