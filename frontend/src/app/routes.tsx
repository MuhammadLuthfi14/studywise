import { createBrowserRouter, Navigate } from "react-router";
import { AuthLayout } from "./layouts/AuthLayout";
import { AppLayout } from "./layouts/AppLayout";
import { StudentLayout } from "./layouts/StudentLayout";

// Halaman publik
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// Halaman mahasiswa
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { ConsultationPage } from "./pages/student/ConsultationPage";
import { ResultPage } from "./pages/student/ResultPage";
import { ConsultationHistoryPage } from "./pages/student/ConsultationHistoryPage";
import { HistoryDetailPage } from "./pages/student/HistoryDetailPage";
import { StudentProfilePage } from "./pages/student/StudentProfilePage";

// Halaman admin
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { KnowledgeBasePage } from "./pages/admin/KnowledgeBasePage";
import { ConsultationDataPage } from "./pages/admin/ConsultationDataPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AdminProfilePage } from "./pages/admin/AdminProfilePage";

// Wrapper layout sesuai role (Data mode `Component` tidak menerima props).
function AdminLayout() {
  return <AppLayout allowed="admin" />;
}
function RedirectToHome() {
  return <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
    ],
  },
  {
    path: "app",
    Component: StudentLayout,
    children: [
      { path: "beranda", Component: StudentDashboard },
      { path: "konsultasi", Component: ConsultationPage },
      { path: "konsultasi/hasil", Component: ResultPage },
      { path: "riwayat", Component: ConsultationHistoryPage },
      { path: "riwayat/:id", Component: HistoryDetailPage },
      { path: "profil", Component: StudentProfilePage },
    ],
  },
  {
    path: "admin",
    Component: AdminLayout,
    children: [
      { path: "beranda", Component: AdminDashboard },
      { path: "basis-pengetahuan", Component: KnowledgeBasePage },
      { path: "konsultasi", Component: ConsultationDataPage },
      { path: "pengguna", Component: UsersPage },
      { path: "profil", Component: AdminProfilePage },
    ],
  },
  { path: "*", Component: RedirectToHome },
]);
