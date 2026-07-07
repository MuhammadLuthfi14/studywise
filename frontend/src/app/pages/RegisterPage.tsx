import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/PasswordInput";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { getSemesterOptions, programStudiOptions } from "../utils/constants";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nimRegex = /^\d{10}$/;

interface FormValues {
  nama: string;
  nim: string;
  jenis_kelamin: "laki-laki" | "perempuan" | "";
  email: string;
  password: string;
  konfirmasi: string;
  program_studi: string;
  semester: string;
}

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nama: "",
      nim: "",
      jenis_kelamin: "",
      email: "",
      password: "",
      konfirmasi: "",
      program_studi: "",
      semester: "",
    },
  });

  const programStudi = watch("program_studi");
  const password = watch("password");
  const semesterOptions = getSemesterOptions(programStudi);

  async function onSubmit(values: FormValues) {
    const nama = values.nama.trim();
    const nim = values.nim.trim();
    const email = values.email.trim();

    setError(null);
    setLoading(true);
    try {
      const user = await registerUser({
        nama,
        nim,
        email,
        password: values.password,
        program_studi: values.program_studi,
        semester: Number(values.semester),
        jenis_kelamin: values.jenis_kelamin as "laki-laki" | "perempuan",
      });
      navigate(user.role === "admin" ? "/admin/beranda" : "/app/beranda", {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  }

  const fieldError = "text-xs text-destructive xs:text-sm";
  const labelClass = "text-xs font-medium xs:text-sm";
  const inputClass = "h-10 xs:h-11";
  const selectClass = "h-10 xs:h-11";

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-3 xs:p-4">
      <div className="w-full max-w-lg py-3 xs:py-4 sm:py-8">
        <div className="mb-3 flex flex-col items-center text-center xs:mb-4 sm:mb-6">
          <Logo size={48} className="xs:hidden" />
          <Logo size={56} className="hidden xs:inline-flex" />
          <h1 className="mt-2 xs:mt-3">Daftar Mahasiswa</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Buat akun untuk mulai menggunakan StudyWise.
          </p>
        </div>

        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 xs:space-y-4"
            >
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-xs xs:text-sm">{error}</AlertDescription>
                </Alert>
              ) : null}

              {/* Nama Lengkap */}
              <div className="space-y-1 xs:space-y-1.5">
                <Label htmlFor="nama" className={labelClass}>Nama Lengkap</Label>
                <Controller
                  name="nama"
                  control={control}
                  rules={{
                    required: "Nama wajib diisi",
                    validate: (v) => v.trim().length > 0 || "Nama wajib diisi",
                  }}
                  render={({ field }) => (
                    <Input
                      id="nama"
                      autoComplete="name"
                      placeholder="Masukkan nama lengkap"
                      className={inputClass}
                      {...field}
                    />
                  )}
                />
                {errors.nama && <p className={fieldError}>{errors.nama.message}</p>}
              </div>

              {/* NIM + Jenis Kelamin */}
              <div className="grid gap-3 xs:gap-4 sm:grid-cols-2">
                <div className="space-y-1 xs:space-y-1.5">
                  <Label htmlFor="nim" className={labelClass}>NIM</Label>
                  <Controller
                    name="nim"
                    control={control}
                    rules={{
                      required: "NIM wajib diisi",
                      validate: (v) =>
                        nimRegex.test(v.trim()) || "NIM harus berupa 10 digit angka",
                    }}
                    render={({ field }) => (
                      <Input
                      id="nim"
                      autoComplete="username"
                      placeholder="Contoh: 2231140012"
                      className={inputClass}
                      {...field}
                      />
                    )}
                  />
                  {errors.nim && <p className={fieldError}>{errors.nim.message}</p>}
                </div>

                <div className="space-y-1 xs:space-y-1.5">
                  <Label htmlFor="jenis-kelamin" className={labelClass}>Jenis Kelamin</Label>
                  <Controller
                    name="jenis_kelamin"
                    control={control}
                    rules={{ required: "Jenis kelamin wajib dipilih" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="jenis-kelamin" className={selectClass}>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.jenis_kelamin && <p className={fieldError}>{errors.jenis_kelamin.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 xs:space-y-1.5">
                <Label htmlFor="email" className={labelClass}>Email</Label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email wajib diisi",
                    validate: (v) =>
                      emailRegex.test(v.trim()) || "Format email tidak valid",
                  }}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nama@email.com"
                      className={inputClass}
                      {...field}
                    />
                  )}
                />
                {errors.email && <p className={fieldError}>{errors.email.message}</p>}
              </div>

              {/* Kata Sandi + Konfirmasi */}
              <div className="grid gap-3 xs:gap-4 sm:grid-cols-2">
                <div className="space-y-1 xs:space-y-1.5">
                  <Label htmlFor="password" className={labelClass}>Kata Sandi</Label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Kata sandi wajib diisi",
                      minLength: { value: 6, message: "Minimal 6 karakter" },
                      validate: (v) => v.trim().length >= 6 || "Minimal 6 karakter",
                    }}
                    render={({ field }) => (
                      <PasswordInput
                        id="password"
                        autoComplete="new-password"
                        placeholder="Minimal 6 karakter"
                        className={inputClass}
                        {...field}
                      />
                    )}
                  />
                  {errors.password && <p className={fieldError}>{errors.password.message}</p>}
                </div>

                <div className="space-y-1 xs:space-y-1.5">
                  <Label htmlFor="konfirmasi" className={labelClass}>
                    <span className="hidden xs:inline">Konfirmasi Kata Sandi</span>
                    <span className="xs:hidden">Konfirmasi</span>
                  </Label>
                  <Controller
                    name="konfirmasi"
                    control={control}
                    rules={{
                      required: "Konfirmasi wajib diisi",
                      validate: (v) => v === password || "Kata sandi tidak cocok",
                    }}
                    render={({ field }) => (
                      <PasswordInput
                        id="konfirmasi"
                        autoComplete="new-password"
                        placeholder="Ulangi kata sandi"
                        className={inputClass}
                        {...field}
                      />
                    )}
                  />
                  {errors.konfirmasi && <p className={fieldError}>{errors.konfirmasi.message}</p>}
                </div>
              </div>

              {/* Program Studi + Semester */}
              <div className="grid gap-3 xs:gap-4 sm:grid-cols-2">
                <div className="space-y-1 xs:space-y-1.5">
                  <Label htmlFor="program-studi" className={labelClass}>Program Studi</Label>
                  <Controller
                    name="program_studi"
                    control={control}
                    rules={{ required: "Program studi wajib dipilih" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                          setValue("semester", "");
                        }}
                      >
                        <SelectTrigger id="program-studi" className={selectClass}>
                          <SelectValue placeholder="Pilih program studi" />
                        </SelectTrigger>
                        <SelectContent>
                          {programStudiOptions.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.program_studi && <p className={fieldError}>{errors.program_studi.message}</p>}
                </div>

                <div className="space-y-1 xs:space-y-1.5">
                  <Label htmlFor="semester" className={labelClass}>Semester</Label>
                  <Controller
                    name="semester"
                    control={control}
                    rules={{ required: "Semester wajib dipilih" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!programStudi}
                      >
                        <SelectTrigger id="semester" className={selectClass}>
                          <SelectValue
                            placeholder={
                              programStudi
                                ? "Pilih semester"
                                : "Pilih prodi dahulu"
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
                    )}
                  />
                  {errors.semester && <p className={fieldError}>{errors.semester.message}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="h-10 w-full xs:h-11"
                disabled={loading}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Daftar
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground xs:mt-5 xs:text-sm sm:mt-6">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-medium text-sw-primary hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
