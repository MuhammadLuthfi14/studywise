import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(emailValue: string, passwordValue: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue.trim())) {
      setError("Format email tidak valid.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await login({ email: emailValue, password: passwordValue });
      navigate(user.role === "admin" ? "/admin/beranda" : "/app/beranda", {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-3 xs:p-4">
      <div className="w-full max-w-md">
        <div className="mb-3 flex flex-col items-center text-center xs:mb-4 sm:mb-6">
          <Logo size={48} className="xs:hidden" />
          <Logo size={56} className="hidden xs:inline-flex" />
          <h1 className="mt-2 xs:mt-3">Masuk ke StudyWise</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Masuk untuk memulai konsultasi belajarmu.
          </p>
        </div>

        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(email, password);
              }}
              className="space-y-3 xs:space-y-4"
            >
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-xs xs:text-sm">{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-1 xs:space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium xs:text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@studywise.ac.id"
                  className="h-10 xs:h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1 xs:space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium xs:text-sm">
                  Kata Sandi
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-10 xs:h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="h-10 w-full xs:h-11"
                disabled={loading}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Masuk
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground xs:mt-5 xs:text-sm sm:mt-6">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-medium text-sw-primary hover:underline"
              >
                Daftar Mahasiswa
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-3 text-center text-xs xs:mt-4">
          <Link to="/" className="text-muted-foreground hover:underline">
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
