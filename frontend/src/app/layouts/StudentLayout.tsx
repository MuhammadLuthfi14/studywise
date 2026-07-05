import { Navigate, Outlet } from "react-router";
import { StudentNavbar } from "../components/StudentNavbar";
import { useAuth } from "../context/AuthContext";

export function StudentLayout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "mahasiswa") {
    return <Navigate to="/admin/beranda" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StudentNavbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl 3xl:max-w-7xl p-3 py-4 xs:p-4 xs:py-5 sm:p-5 sm:py-6 md:p-6 md:py-8 space-y-5 sm:space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
