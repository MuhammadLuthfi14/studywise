import { useState } from "react";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { RoleBadge } from "../../components/RoleBadge";
import { PasswordInput } from "../../components/PasswordInput";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";
import { getSemesterOptions, programStudiOptions } from "../../utils/constants";
import avatarLaki from "../../../imports/avatar_laki-laki.png";
import avatarPerempuan from "../../../imports/avatar_perempuan.png";

function getAvatar(jenis_kelamin?: string): string | undefined {
  if (jenis_kelamin === "laki-laki") return avatarLaki;
  if (jenis_kelamin === "perempuan") return avatarPerempuan;
  return undefined;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nimRegex = /^\d{10}$/;

export function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);

  const [nama, setNama] = useState(user?.nama ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [nim, setNim] = useState(user?.nim ?? "");
  const [programStudi, setProgramStudi] = useState(user?.program_studi ?? "");
  const [semester, setSemester] = useState(user?.semester ? String(user.semester) : "");
  const [jenisKelamin, setJenisKelamin] = useState<"laki-laki" | "perempuan" | "">(
    user?.jenis_kelamin ?? "",
  );
  const [pwLama, setPwLama] = useState("");
  const [pwBaru, setPwBaru] = useState("");

  if (!user) return null;

  // Saat edit aktif, avatar preview mengikuti state lokal jenisKelamin
  const avatarSrc = getAvatar(editing ? (jenisKelamin || undefined) : user.jenis_kelamin);
  const semesterOptions = getSemesterOptions(programStudi);

  function cancel() {
    setNama(user.nama);
    setEmail(user.email);
    setNim(user.nim ?? "");
    setProgramStudi(user.program_studi ?? "");
    setSemester(user.semester ? String(user.semester) : "");
    setJenisKelamin(user.jenis_kelamin ?? "");
    setPwLama("");
    setPwBaru("");
    setEditing(false);
  }

  function save() {
    if (!nama.trim()) {
      toast.error("Nama tidak boleh kosong.");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      toast.error("Format email tidak valid.");
      return;
    }
    if (nim.trim() && !nimRegex.test(nim.trim())) {
      toast.error("NIM harus berupa 10 digit angka.");
      return;
    }
    if (pwBaru) {
      if (!pwLama.trim()) {
        toast.error("Kata sandi lama wajib diisi untuk mengganti kata sandi.");
        return;
      }
      if (pwBaru.trim().length < 6) {
        toast.error("Kata sandi baru minimal 6 karakter.");
        return;
      }
      toast.success("Kata sandi berhasil diubah.");
    }
    try {
      updateUser({
        ...user,
        nama: nama.trim(),
        email: email.trim(),
        nim: nim.trim() || user.nim,
        program_studi: programStudi || user.program_studi,
        semester: semester ? Number(semester) : user.semester,
        jenis_kelamin: (jenisKelamin || user.jenis_kelamin) as "laki-laki" | "perempuan" | undefined,
      });
      setPwLama("");
      setPwBaru("");
      setEditing(false);
      toast.success("Profil berhasil diperbarui.");
    } catch {
      toast.error("Gagal menyimpan profil. Coba lagi.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi akun StudyWise-mu."
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancel}>
                <X className="size-4" /> Batal
              </Button>
              <Button onClick={save}>
                <Save className="size-4" /> Simpan Perubahan
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>
              Edit Profil
            </Button>
          )
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kartu ringkas */}
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-3 text-center xs:p-4 sm:p-6">
            <Avatar className="size-16 ring-2 ring-sw-primary/20 ring-offset-2 xs:size-20 sm:size-24" aria-label={`Avatar ${user.nama}`}>
              {avatarSrc && (
                <AvatarImage src={avatarSrc} alt={user.nama} className="object-cover" />
              )}
              <AvatarFallback className="bg-sw-primary text-2xl text-white">
                {initials(user.nama)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{editing ? nama || user.nama : user.nama}</div>
              <div className="text-sm text-muted-foreground">{editing ? email || user.email : user.email}</div>
              {(editing ? jenisKelamin : user.jenis_kelamin) && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {(editing ? jenisKelamin : user.jenis_kelamin) === "laki-laki" ? "Laki-laki" : "Perempuan"}
                </div>
              )}
            </div>
            <RoleBadge role={user.role} />
          </CardContent>
        </Card>

        {/* Detail */}
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4 p-3 xs:p-4 sm:p-6">
            <h3>Data Diri</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  autoComplete="name"
                  value={nama}
                  disabled={!editing}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  disabled={!editing}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  autoComplete="username"
                  value={nim}
                  disabled={!editing}
                  onChange={(e) => setNim(e.target.value)}
                  className={!editing ? "bg-muted text-muted-foreground" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-jenis-kelamin">Jenis Kelamin</Label>
                <Select
                  value={jenisKelamin}
                  onValueChange={(v) => setJenisKelamin(v as "laki-laki" | "perempuan")}
                  disabled={!editing}
                >
                  <SelectTrigger id="profile-jenis-kelamin" className={!editing ? "bg-muted text-muted-foreground" : ""}>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-program-studi">Program Studi</Label>
                <Select
                  value={programStudi}
                  onValueChange={(v) => {
                    setProgramStudi(v);
                    setSemester("");
                  }}
                  disabled={!editing}
                >
                  <SelectTrigger id="profile-program-studi" className={!editing ? "bg-muted text-muted-foreground" : ""}>
                    <SelectValue placeholder="Pilih program studi" />
                  </SelectTrigger>
                  <SelectContent>
                    {programStudiOptions.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-semester">Semester</Label>
                <Select
                  value={semester}
                  onValueChange={setSemester}
                  disabled={!editing || !programStudi}
                >
                  <SelectTrigger id="profile-semester" className={!editing ? "bg-muted text-muted-foreground" : ""}>
                    <SelectValue
                      placeholder={
                        !editing
                          ? user.semester ? `Semester ${user.semester}` : "-"
                          : programStudi
                          ? "Pilih semester"
                          : "Pilih program studi dahulu"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {semesterOptions.map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  disabled={!editing}
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
                  disabled={!editing}
                  value={pwBaru}
                  onChange={(e) => setPwBaru(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Kosongkan jika tidak ingin mengganti kata sandi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
