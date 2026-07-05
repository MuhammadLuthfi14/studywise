import { NavLink, useNavigate } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users,
} from "lucide-react";
import { BrandMark } from "./Logo";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ConfirmDialog";
import { cn } from "./ui/utils";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const studentNav: NavItem[] = [
  { to: "/app/beranda", label: "Beranda", icon: LayoutDashboard },
  { to: "/app/konsultasi", label: "Konsultasi Belajar", icon: BookOpen },
  { to: "/app/riwayat", label: "Riwayat Konsultasi", icon: History },
  { to: "/app/profil", label: "Profil Saya", icon: UserCircle },
];

const adminNav: NavItem[] = [
  { to: "/admin/beranda", label: "Beranda Admin", icon: LayoutDashboard },
  { to: "/admin/basis-pengetahuan", label: "Basis Pengetahuan", icon: Brain },
  { to: "/admin/konsultasi", label: "Data Konsultasi", icon: ClipboardList },
  { to: "/admin/pengguna", label: "Data Pengguna", icon: Users },
  { to: "/admin/profil", label: "Profil Admin", icon: UserCircle },
];

export function Sidebar({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const items = role === "admin" ? adminNav : studentNav;

  function handleLogout() {
    onNavigate?.();
    logout();
    navigate("/login");
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <BrandMark />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            end={item.to.endsWith("beranda")}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sw-primary text-white shadow-sm"
                  : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )
            }
          >
            <item.icon className="size-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <ConfirmDialog
          trigger={
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              Keluar
            </Button>
          }
          title="Keluar dari StudyWise?"
          description="Sesi Anda akan diakhiri. Anda dapat masuk kembali kapan saja."
          confirmLabel="Ya, Keluar"
          cancelLabel="Batal"
          destructive={false}
          onConfirm={handleLogout}
        />
      </div>
    </aside>
  );
}
