import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";
import { Sheet, SheetContent } from "../components/ui/sheet";

// Layout aplikasi setelah login: sidebar + topbar + konten.
// `allowed` membatasi akses berdasarkan role.
export function AppLayout({ allowed }: { allowed: Role }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowed) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/beranda" : "/app/beranda"}
        replace
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <Sidebar role={user.role} />
      </div>

      {/* Sidebar mobile (drawer) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(16rem,85vw)] p-0">
          <Sidebar role={user.role} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-5 md:p-6 xl:p-8">
          <div className="mx-auto max-w-6xl 3xl:max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
