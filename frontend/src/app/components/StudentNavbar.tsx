import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { BookOpen, History, LayoutDashboard, LogOut, Menu, UserCircle } from "lucide-react";
import { BrandMark } from "./Logo";
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "./ui/sheet";
import { ConfirmDialog } from "./ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { cn } from "./ui/utils";
import { initials } from "../utils/format";
import avatarLaki from "../../imports/avatar_laki-laki.png";
import avatarPerempuan from "../../imports/avatar_perempuan.png";

const studentNav = [
  { to: "/app/beranda", label: "Beranda", icon: LayoutDashboard },
  { to: "/app/konsultasi", label: "Konsultasi", icon: BookOpen },
  { to: "/app/riwayat", label: "Riwayat", icon: History },
];

function getAvatar(jenis_kelamin?: string): string | undefined {
  if (jenis_kelamin === "laki-laki") return avatarLaki;
  if (jenis_kelamin === "perempuan") return avatarPerempuan;
  return undefined;
}

export function StudentNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const avatarSrc = getAvatar(user.jenis_kelamin);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleLogoutMobile() {
    setMobileOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <BrandMark />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            {studentNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.endsWith("beranda")}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sw-primary text-white shadow-md shadow-sw-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Menu & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 border-l border-border pl-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={`Menu akun ${user.nama}`}
                  className="flex items-center gap-3 rounded-full p-1 pr-3 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-sw-primary/50"
                >
                  <Avatar className="size-8 shadow-sm">
                    {avatarSrc && <AvatarImage src={avatarSrc} alt={user.nama} className="object-cover" />}
                    <AvatarFallback className="bg-sw-primary text-white text-xs font-medium">
                      {initials(user.nama)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-foreground leading-none">{user.nama}</span>
                    <span className="text-xs text-muted-foreground mt-1 leading-none">Mahasiswa</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[min(16rem,calc(100vw-2rem))] rounded-xl p-2">
                <DropdownMenuLabel className="p-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0">
                      {avatarSrc && <AvatarImage src={avatarSrc} alt={user.nama} className="object-cover" />}
                      <AvatarFallback className="bg-sw-primary text-white text-sm">
                        {initials(user.nama)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 overflow-hidden">
                      <p className="text-sm font-semibold leading-none truncate">{user.nama}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/profil")} className="rounded-lg p-2.5 cursor-pointer">
                  <UserCircle className="mr-2 size-4 text-muted-foreground" />
                  <span className="font-medium">Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg p-2.5 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <LogOut className="mr-2 size-4" />
                      <span className="font-medium">Keluar</span>
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
          </div>

          {/* Mobile Navigation */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                <Menu className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(18rem,90vw)] border-l border-border/50 p-0">
              <SheetHeader className="p-4 xs:p-6 border-b border-border/50">
                <SheetTitle className="text-left">
                  <BrandMark />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
                <div className="p-4 xs:p-6 pb-2">
                  <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl border border-border/50">
                    <Avatar className="size-10 shrink-0 border border-background shadow-sm">
                      {avatarSrc && <AvatarImage src={avatarSrc} alt={user.nama} className="object-cover" />}
                      <AvatarFallback className="bg-sw-primary text-white">
                        {initials(user.nama)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-foreground truncate">{user.nama}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                  {studentNav.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      end={item.to.endsWith("beranda")}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "bg-sw-primary text-white shadow-md shadow-sw-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={cn("size-5 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}

                  <div className="my-3 border-t border-border/50" />

                  <NavLink
                    to="/app/profil"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-sw-primary text-white shadow-md shadow-sw-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <UserCircle className={cn("size-5 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                        <span>Profil Saya</span>
                      </>
                    )}
                  </NavLink>
                </nav>

                <div className="mt-auto p-4 border-t border-border/50">
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-12 rounded-xl"
                      >
                        <LogOut className="mr-2 size-5" />
                        Keluar
                      </Button>
                    }
                    title="Keluar dari StudyWise?"
                    description="Sesi Anda akan diakhiri. Anda dapat masuk kembali kapan saja."
                    confirmLabel="Ya, Keluar"
                    cancelLabel="Batal"
                    destructive={false}
                    onConfirm={handleLogoutMobile}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
