import { UserCog, User as UserIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Role } from "../types";

export function RoleBadge({ role }: { role: Role }) {
  if (role === "admin") {
    return (
      <Badge className="gap-1 border-transparent bg-sw-ai text-white hover:bg-sw-ai">
        <UserCog className="size-3" />
        Admin
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 border-transparent bg-sw-primary text-white hover:bg-sw-primary">
      <UserIcon className="size-3" />
      Mahasiswa
    </Badge>
  );
}
