import { useEffect, useState } from "react";
import { Pencil, Plus, Power } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import { LoadingState } from "../../components/LoadingState";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { RoleBadge } from "../../components/RoleBadge";
import { StatusBadge } from "../../components/StatusBadge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import * as kb from "../../services/knowledgeService";
import {
  getSemesterOptions,
  programStudiOptions,
} from "../../utils/constants";
import type { User } from "../../types";

export function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<User | null>(null);

  async function refresh() {
    setItems(await kb.listUsers());
  }
  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  function add() {
    setDraft({
      id: `u-${Date.now()}`,
      nama: "",
      email: "",
      role: "mahasiswa", // registrasi admin tidak diizinkan dari sini
      nim: "",
      program_studi: "",
      semester: undefined,
      status: "aktif",
    });
    setOpen(true);
  }
  function edit(u: User) {
    setDraft({ ...u });
    setOpen(true);
  }
  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      await kb.saveUser(draft);
      await refresh();
      setOpen(false);
      toast.success("Data pengguna berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan data pengguna. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }
  async function toggleStatus(u: User) {
    const next = u.status === "aktif" ? "nonaktif" : "aktif";
    try {
      await kb.saveUser({ ...u, status: next });
      await refresh();
      toast.success(
        next === "aktif"
          ? `${u.nama} diaktifkan.`
          : `${u.nama} dinonaktifkan.`,
      );
    } catch {
      toast.error("Gagal mengubah status pengguna.");
    }
  }

  const columns: Column<User>[] = [
    { key: "nama", header: "Nama" },
    { key: "email", header: "Email", render: (r) => <span className="text-muted-foreground">{r.email}</span> },
    { key: "role", header: "Role", className: "w-32", render: (r) => <RoleBadge role={r.role} /> },
    { key: "prodi", header: "Program Studi", render: (r) => r.program_studi ?? "-" },
    { key: "semester", header: "Semester", className: "w-24", render: (r) => (r.semester ? `Smt ${r.semester}` : "-") },
    { key: "status", header: "Status", className: "w-24", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "action",
      header: "Aksi",
      className: "w-28 text-right",
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => edit(r)} aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
          {r.role !== "admin" ? (
            <ConfirmDialog
              title={r.status === "aktif" ? `Nonaktifkan ${r.nama}?` : `Aktifkan ${r.nama}?`}
              description={
                r.status === "aktif"
                  ? "Pengguna nonaktif tidak dapat masuk ke aplikasi."
                  : "Pengguna akan dapat masuk kembali ke aplikasi."
              }
              confirmLabel={r.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
              destructive={r.status === "aktif"}
              onConfirm={() => toggleStatus(r)}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Nonaktifkan / Aktifkan"
                  className={r.status === "aktif" ? "text-destructive hover:text-destructive" : "text-sw-success"}
                >
                  <Power className="size-4" />
                </Button>
              }
            />
          ) : null}
        </div>
      ),
    },
  ];

  const isMahasiswa = draft?.role === "mahasiswa";
  const semesterOptions = getSemesterOptions(draft?.program_studi ?? "");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Pengguna"
        description="Kelola akun mahasiswa dan admin StudyWise."
        actions={
          <Button onClick={add}>
            <Plus className="size-4" /> Tambah Mahasiswa
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable columns={columns} data={items} rowKey={(r) => r.id} />
      )}

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={draft && items.some((i) => i.id === draft.id) ? "Edit Pengguna" : "Tambah Mahasiswa"}
        description="Akun yang dibuat di sini otomatis berperan sebagai mahasiswa."
        onSubmit={save}
        submitDisabled={!draft?.nama || !draft?.email}
        loading={saving}
      >
        {draft ? (
          <>
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </div>
            {isMahasiswa ? (
              <>
                <div className="space-y-2">
                  <Label>NIM</Label>
                  <Input value={draft.nim ?? ""} onChange={(e) => setDraft({ ...draft, nim: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Program Studi</Label>
                  <Select
                    value={draft.program_studi ?? ""}
                    onValueChange={(v) => setDraft({ ...draft, program_studi: v, semester: undefined })}
                  >
                    <SelectTrigger>
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
                  <Label>Semester</Label>
                  <Select
                    value={draft.semester ? String(draft.semester) : ""}
                    onValueChange={(v) => setDraft({ ...draft, semester: Number(v) })}
                    disabled={!draft.program_studi}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={draft.program_studi ? "Pilih semester" : "Pilih prodi dahulu"} />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterOptions.map((s) => (
                        <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </FormModal>
    </div>
  );
}
