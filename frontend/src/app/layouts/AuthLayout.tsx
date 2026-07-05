import { Outlet } from "react-router";

// Layout halaman publik (landing, login, register).
// Sengaja minimal — tiap halaman mengatur tampilannya sendiri.
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}
