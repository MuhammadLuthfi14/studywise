import { useNavigate } from "react-router";
import { Menu, UserCog, UserCircle, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { RoleBadge } from "./RoleBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";
import avatarLaki from "../../imports/avatar_laki-laki.png";
import avatarPerempuan from "../../imports/avatar_perempuan.png";

function getAvatar(jenis_kelamin?: string): string | undefined {
  if (jenis_kelamin === "laki-laki") return avatarLaki;
  if (jenis_kelamin === "perempuan") return avatarPerempuan;
  return undefined;
}

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const avatarSrc = isAdmin ? undefined : getAvatar(user.jenis_kelamin);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="size-11 lg:hidden"
        onClick={onOpenMenu}
        aria-label="Buka menu"
      >
        <Menu className="size-5" />
      </Button>

      {!isAdmin && (
        <div className="hidden sm:block">
          <RoleBadge role={user.role} />
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        {isAdmin ? (
          /* Admin: display statis — logout ada di sidebar */
          <div className="flex items-center gap-2 rounded-full px-1 py-1 pr-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-sw-ai shadow-sm">
              <UserCog className="size-4 text-white" strokeWidth={1.5} />
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium leading-tight">{user.nama}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        ) : (
          /* Mahasiswa: dropdown dengan profil & logout */
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={`Menu akun ${user.nama}`}
                className="flex min-h-11 items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-sw-primary/50"
              >
                <Avatar className="size-9">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt={user.nama} className="object-cover" />}
                  <AvatarFallback className="bg-sw-primary text-white">
                    {initials(user.nama)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-medium leading-tight">{user.nama}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user.nama}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/app/profil")}>
                <UserCircle className="size-4" /> Profil Saya
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <LogOut className="size-4" /> Keluar
                  </DropdownMenuItem>
                }
                title="Keluar dari StudyWise?"
                description="Sesi Anda akan diakhiri. Anda dapat masuk kembali kapan saja."
                confirmLabel="Ya, Keluar"
                cancelLabel="Batal"
                destructive={false}
                onConfirm={handleLogout}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
