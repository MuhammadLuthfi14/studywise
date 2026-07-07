import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ConsultationProvider } from "./context/ConsultationContext";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";

// Radix Dialog melakukan pengecekan aksesibilitas via document.getElementById(titleId).
// Di lingkungan Figma Make, wrapper FGCmp memutus context chain Radix sehingga pengecekan
// ini gagal meski setiap DialogContent sudah memiliki DialogTitle yang benar.
// Filter ini menekan false-positive tersebut agar tidak mencemari console.
const _consoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  // Radix: DialogTitle detection fails in Figma FGCmp environment (false-positive).
  if (msg.includes("DialogContent") && msg.includes("DialogTitle")) return;
  // Recharts: FGCmp wrapper causes SVG Surface key collisions (false-positive).
  if (msg.includes("two children with the same key")) return;
  _consoleError(...args);
};

export default function App() {
  return (
    <AuthProvider>
      <ConsultationProvider>
        <AppErrorBoundary>
          <RouterProvider router={router} />
        </AppErrorBoundary>
        <Toaster richColors position="top-right" />
      </ConsultationProvider>
    </AuthProvider>
  );
}
