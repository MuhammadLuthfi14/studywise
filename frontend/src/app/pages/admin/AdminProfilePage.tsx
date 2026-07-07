import { useState } from "react";
import { UserCog } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { RoleBadge } from "../../components/RoleBadge";
import { PasswordInput } from "../../components/PasswordInput";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../context/AuthContext";

export function AdminProfilePage() {
  const { user } = useAuth();
  const [pwLama, setPwLama] = useState("");
  const [pwBaru, setPwBaru] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function savePassword() {
    if (!pwLama.trim()) {
      toast.error("Kata sandi lama wajib diisi.");
      return;
    }
    if (pwBaru.trim().length < 6) {
      toast.error("Kata sandi baru minimal 6 karakter.");
      return;
    }
    setSaving(true);
    try {
      // Backend FastAPI: PUT /auth/password
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Kata sandi berhasil diperbarui.");
      setPwLama("");
      setPwBaru("");
    } catch {
      toast.error("Gagal memperbarui kata sandi. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profil Admin" description="Informasi akun admin StudyWise." />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-3 text-center xs:p-4 sm:p-6">
            <div
              className="flex size-16 items-center justify-center rounded-full bg-sw-ai shadow-md ring-4 ring-sw-ai/20 xs:size-20"
              aria-label={`Avatar ${user.nama}`}
            >
              <UserCog className="size-9 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-medium">{user.nama}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <RoleBadge role={user.role} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="space-y-4 p-3 xs:p-4 sm:p-6">
            <h3>Data Akun</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-nama">Nama</Label>
                <Input id="admin-nama" autoComplete="name" value={user.nama} disabled className="bg-muted text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" autoComplete="email" value={user.email} disabled className="bg-muted text-muted-foreground" />
              </div>
            </div>

            <Separator />

            <h3>Ubah Kata Sandi</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pw-lama">Kata Sandi Lama</Label>
                <PasswordInput
                  id="pw-lama"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={pwLama}
                  onChange={(e) => setPwLama(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw-baru">Kata Sandi Baru</Label>
                <PasswordInput
                  id="pw-baru"
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  value={pwBaru}
                  onChange={(e) => setPwBaru(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={savePassword} disabled={saving || (!pwLama.trim() && !pwBaru.trim())}>
                {saving ? "Menyimpan..." : "Simpan Kata Sandi"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
