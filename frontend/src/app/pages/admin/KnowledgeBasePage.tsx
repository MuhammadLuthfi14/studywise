import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import type { Column } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { StatusBadge } from "../../components/StatusBadge";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { LoadingState } from "../../components/LoadingState";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import * as kb from "../../services/knowledgeService";
import type { Recommendation, Rule, Status, Symptom } from "../../types";

const codePatterns = {
  G: /^G\d{2}$/,
  O: /^O\d{2}$/,
  R: /^R\d{2}$/,
};

export function KnowledgeBasePage() {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <PageHeader
        title="Basis Pengetahuan"
        description="Kelola gejala, rekomendasi, rule, dan nilai CF pakar sistem."
      />
      <Tabs defaultValue="gejala">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 p-1">
          <TabsTrigger value="gejala" className="text-xs xs:text-sm">Data Gejala</TabsTrigger>
          <TabsTrigger value="rekomendasi" className="text-xs xs:text-sm">
            <span className="hidden xs:inline">Data Rekomendasi</span>
            <span className="xs:hidden">Rekomendasi</span>
          </TabsTrigger>
          <TabsTrigger value="rule" className="text-xs xs:text-sm">Data Rule</TabsTrigger>
          <TabsTrigger value="cf" className="text-xs xs:text-sm">
            <span className="hidden xs:inline">Nilai CF Pakar</span>
            <span className="xs:hidden">CF Pakar</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gejala" className="mt-3 xs:mt-4">
          <SymptomTab />
        </TabsContent>
        <TabsContent value="rekomendasi" className="mt-3 xs:mt-4">
          <RecommendationTab />
        </TabsContent>
        <TabsContent value="rule" className="mt-3 xs:mt-4">
          <RuleTab />
        </TabsContent>
        <TabsContent value="cf" className="mt-3 xs:mt-4">
          <CFTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ====================== Data Gejala ====================== */
function SymptomTab() {
  const [items, setItems] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Symptom | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  useEffect(() => {
    kb.listSymptoms().then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, []);

  function add() {
    setEditingCode(null);
    setDraft({ code: nextCode("G", items.map((i) => i.code)), name: "", status: "aktif" });
    setOpen(true);
  }
  function edit(item: Symptom) {
    setEditingCode(item.code);
    setDraft({ ...item });
    setOpen(true);
  }
  async function save() {
    if (!draft) return;
    const validationMessage = validateKnowledgeItem({
      code: draft.code,
      name: draft.name,
      prefix: "G",
      entity: "gejala",
      existingCodes: items.map((item) => item.code),
      editingCode,
    });
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const normalizedDraft: Symptom = {
      ...draft,
      code: draft.code.trim().toUpperCase(),
      name: draft.name.trim(),
    };

    setSaving(true);
    try {
      await kb.saveSymptom(normalizedDraft);
      setItems(await kb.listSymptoms());
      setOpen(false);
      setEditingCode(null);
      toast.success("Gejala berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan gejala. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(code: string) {
    try {
      await kb.deleteSymptom(code);
      setItems(await kb.listSymptoms());
      toast.success(`Gejala ${code} dihapus.`);
    } catch {
      toast.error("Gagal menghapus gejala.");
    }
  }

  const columns: Column<Symptom>[] = [
    { key: "code", header: "Kode", className: "w-20 xs:w-24", render: (r) => <Badge variant="outline">{r.code}</Badge> },
    { key: "name", header: "Nama Gejala" },
    { key: "status", header: "Status", className: "w-24 xs:w-28", render: (r) => <StatusBadge status={r.status} /> },
    { key: "action", header: "Aksi", className: "w-24 xs:w-28 text-right", render: (r) => rowActions(() => edit(r), () => remove(r.code), `gejala ${r.code}`) },
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={add}>
          <Plus className="size-4" />
          <span className="hidden xs:inline">Tambah Gejala</span>
          <span className="xs:hidden">Tambah</span>
        </Button>
      </div>
      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <DataTable columns={columns} data={items} rowKey={(r) => r.code} />
      )}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={draft && items.some((i) => i.code === draft.code) ? "Edit Gejala" : "Tambah Gejala"}
        onSubmit={save}
        submitDisabled={!draft || !draft.code.trim() || !draft.name.trim()}
        loading={saving}
      >
        {draft ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="symptom-code">Kode Gejala</Label>
              <Input id="symptom-code" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symptom-name">Nama Gejala</Label>
              <Input id="symptom-name" value={draft.name} placeholder="Masukkan nama gejala" onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <StatusField value={draft.status} onChange={(status) => setDraft({ ...draft, status })} />
          </>
        ) : null}
      </FormModal>
    </div>
  );
}

/* ====================== Data Rekomendasi ====================== */
function RecommendationTab() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Recommendation | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  useEffect(() => {
    kb.listRecommendations().then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, []);

  function add() {
    setEditingCode(null);
    setDraft({ code: nextCode("O", items.map((i) => i.code)), name: "", description: "", status: "aktif" });
    setOpen(true);
  }
  function edit(item: Recommendation) {
    setEditingCode(item.code);
    setDraft({ ...item });
    setOpen(true);
  }
  async function save() {
    if (!draft) return;
    const validationMessage = validateKnowledgeItem({
      code: draft.code,
      name: draft.name,
      prefix: "O",
      entity: "rekomendasi",
      existingCodes: items.map((item) => item.code),
      editingCode,
    });
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const normalizedDraft: Recommendation = {
      ...draft,
      code: draft.code.trim().toUpperCase(),
      name: draft.name.trim(),
      description: draft.description?.trim() ?? "",
    };

    setSaving(true);
    try {
      await kb.saveRecommendation(normalizedDraft);
      setItems(await kb.listRecommendations());
      setOpen(false);
      setEditingCode(null);
      toast.success("Rekomendasi berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan rekomendasi. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(code: string) {
    try {
      await kb.deleteRecommendation(code);
      setItems(await kb.listRecommendations());
      toast.success(`Rekomendasi ${code} dihapus.`);
    } catch {
      toast.error("Gagal menghapus rekomendasi.");
    }
  }

  const columns: Column<Recommendation>[] = [
    { key: "code", header: "Kode", className: "w-20 xs:w-24", render: (r) => <Badge variant="outline">{r.code}</Badge> },
    { key: "name", header: "Nama Rekomendasi" },
    { key: "description", header: "Deskripsi", render: (r) => <span className="text-muted-foreground">{r.description}</span> },
    { key: "status", header: "Status", className: "w-24 xs:w-28", render: (r) => <StatusBadge status={r.status} /> },
    { key: "action", header: "Aksi", className: "w-24 xs:w-28 text-right", render: (r) => rowActions(() => edit(r), () => remove(r.code), `rekomendasi ${r.code}`) },
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={add}>
          <Plus className="size-4" />
          <span className="hidden xs:inline">Tambah Rekomendasi</span>
          <span className="xs:hidden">Tambah</span>
        </Button>
      </div>
      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <DataTable columns={columns} data={items} rowKey={(r) => r.code} />
      )}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={draft && items.some((i) => i.code === draft.code) ? "Edit Rekomendasi" : "Tambah Rekomendasi"}
        onSubmit={save}
        submitDisabled={!draft || !draft.code.trim() || !draft.name.trim()}
        loading={saving}
      >
        {draft ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="recommendation-code">Kode Rekomendasi</Label>
              <Input id="recommendation-code" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendation-name">Nama Rekomendasi</Label>
              <Input id="recommendation-name" value={draft.name} placeholder="Masukkan nama rekomendasi" onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendation-description">Deskripsi</Label>
              <Textarea id="recommendation-description" value={draft.description ?? ""} placeholder="Deskripsi singkat" onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <StatusField value={draft.status} onChange={(status) => setDraft({ ...draft, status })} />
          </>
        ) : null}
      </FormModal>
    </div>
  );
}

/* ====================== Data Rule ====================== */
function RuleTab() {
  const [items, setItems] = useState<Rule[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Rule | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  async function refresh() {
    setItems(await kb.listRules());
  }
  useEffect(() => {
    refresh().then(() => setLoading(false));
    kb.listSymptoms().then(setSymptoms);
    kb.listRecommendations().then(setRecs);
  }, []);

  function recName(code: string) {
    return recs.find((r) => r.code === code)?.name ?? code;
  }

  function add() {
    setEditingCode(null);
    setDraft({
      code: nextCode("R", items.map((i) => i.code)),
      symptom_codes: [],
      recommendation_code: recs[0]?.code ?? "",
      cf_pakar: 0.8,
      status: "aktif",
    });
    setOpen(true);
  }
  function edit(item: Rule) {
    setEditingCode(item.code);
    setDraft({ ...item });
    setOpen(true);
  }
  async function save() {
    if (!draft) return;
    const validationMessage = validateRuleDraft(
      draft,
      items.map((item) => item.code),
      editingCode,
    );
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const normalizedDraft: Rule = {
      ...draft,
      code: draft.code.trim().toUpperCase(),
    };

    setSaving(true);
    try {
      await kb.saveRule(normalizedDraft);
      await refresh();
      setOpen(false);
      setEditingCode(null);
      toast.success("Rule berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan rule. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }
  async function remove(code: string) {
    try {
      await kb.deleteRule(code);
      await refresh();
      toast.success(`Rule ${code} dihapus.`);
    } catch {
      toast.error("Gagal menghapus rule.");
    }
  }
  function toggleSymptom(code: string) {
    if (!draft) return;
    const has = draft.symptom_codes.includes(code);
    setDraft({
      ...draft,
      symptom_codes: has
        ? draft.symptom_codes.filter((c) => c !== code)
        : [...draft.symptom_codes, code],
    });
  }

  const columns: Column<Rule>[] = [
    { key: "code", header: "Kode", className: "w-16 xs:w-20", render: (r) => <Badge variant="outline">{r.code}</Badge> },
    {
      key: "symptoms",
      header: "Gejala",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.symptom_codes.map((c) => (
            <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
          ))}
        </div>
      ),
    },
    { key: "rec", header: "Rekomendasi", render: (r) => recName(r.recommendation_code) },
    { key: "cf", header: "CF", className: "w-16 xs:w-24", render: (r) => <span className="font-semibold text-sw-ai">{r.cf_pakar.toFixed(2)}</span> },
    { key: "status", header: "Status", className: "w-24", render: (r) => <StatusBadge status={r.status} /> },
    { key: "action", header: "Aksi", className: "w-20 xs:w-28 text-right", render: (r) => rowActions(() => edit(r), () => remove(r.code), `rule ${r.code}`) },
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={add}>
          <Plus className="size-4" />
          <span className="hidden xs:inline">Tambah Rule</span>
          <span className="xs:hidden">Tambah</span>
        </Button>
      </div>
      {loading ? (
        <LoadingState rows={5} />
      ) : (
        <DataTable columns={columns} data={items} rowKey={(r) => r.code} />
      )}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={draft && items.some((i) => i.code === draft.code) ? "Edit Rule" : "Tambah Rule"}
        description="Tentukan gejala pemicu, rekomendasi, dan nilai CF pakar."
        onSubmit={save}
        submitDisabled={!draft || !draft.code.trim() || draft.symptom_codes.length === 0 || !draft.recommendation_code}
        loading={saving}
      >
        {draft ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="rule-code">Kode Rule</Label>
              <Input id="rule-code" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} />
            </div>
            <div className="space-y-2">
              <Label>Gejala Terkait</Label>
              <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-border p-2 xs:max-h-40">
                {symptoms.map((s) => (
                  <label key={s.code} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted">
                    <Checkbox
                      checked={draft.symptom_codes.includes(s.code)}
                      onCheckedChange={() => toggleSymptom(s.code)}
                    />
                    <span className="shrink-0 font-medium">{s.code}</span>
                    <span className="min-w-0 truncate text-muted-foreground">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-recommendation">Rekomendasi</Label>
              <Select value={draft.recommendation_code} onValueChange={(v) => setDraft({ ...draft, recommendation_code: v })}>
                <SelectTrigger id="rule-recommendation">
                  <SelectValue placeholder="Pilih rekomendasi" />
                </SelectTrigger>
                <SelectContent>
                  {recs.map((r) => (
                    <SelectItem key={r.code} value={r.code}>
                      {r.code} - {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CFInput key={draft.code} value={draft.cf_pakar} onChange={(cf_pakar) => setDraft({ ...draft, cf_pakar })} />
            <StatusField value={draft.status} onChange={(status) => setDraft({ ...draft, status })} />
          </>
        ) : null}
      </FormModal>
    </div>
  );
}

/* ====================== Nilai CF Pakar ====================== */
function CFTab() {
  const [items, setItems] = useState<Rule[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kb.listRules().then((d) => {
      setItems(d);
      setLoading(false);
    });
    kb.listRecommendations().then(setRecs);
  }, []);

  function recName(code: string) {
    return recs.find((r) => r.code === code)?.name ?? code;
  }
  async function update(rule: Rule, value: number) {
    const updated = { ...rule, cf_pakar: value };
    setItems((prev) => prev.map((r) => (r.code === rule.code ? updated : r)));
    try {
      await kb.saveRule(updated);
    } catch {
      toast.error("Gagal menyimpan nilai CF.");
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="p-3 text-xs text-muted-foreground xs:p-4 xs:text-sm">
          <span className="font-medium text-foreground">Nilai CF Pakar</span> adalah
          tingkat keyakinan pakar terhadap suatu aturan, bernilai{" "}
          <span className="font-medium text-foreground">0.00</span> hingga{" "}
          <span className="font-medium text-foreground">1.00</span>. Nilai ini dipakai
          mesin inferensi untuk menghitung Certainty Factor pada hasil rekomendasi.
        </CardContent>
      </Card>
      {loading ? (
        <LoadingState rows={4} />
      ) : (
        <div className="space-y-2">
          {items.map((r) => (
            <Card key={r.code}>
              <CardContent className="flex flex-col gap-3 p-3 xs:p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-2 xs:gap-3">
                  <Badge variant="outline" className="shrink-0">{r.code}</Badge>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{recName(r.recommendation_code)}</div>
                    <span className="text-xs text-muted-foreground">
                      Gejala: {r.symptom_codes.join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Slider
                    className="w-full xs:w-40 sm:w-36 md:w-40"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[r.cf_pakar]}
                    onValueChange={([v]) => update(r, v)}
                    aria-label={`Nilai CF pakar untuk ${r.code}`}
                  />
                  <span className="w-10 shrink-0 text-right font-semibold text-sw-ai xs:w-12">
                    {r.cf_pakar.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ====================== Helpers ====================== */
function rowActions(onEdit: () => void, onDelete: () => void, label: string) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" className="size-11" onClick={onEdit} aria-label="Edit">
        <Pencil className="size-4" />
      </Button>
      <ConfirmDialog
        title={`Hapus ${label}?`}
        description="Data yang dihapus tidak dapat dikembalikan."
        onConfirm={onDelete}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="size-11 text-destructive hover:text-destructive"
            aria-label="Hapus"
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />
    </div>
  );
}

function StatusField({
  value,
  onChange,
}: {
  value: Status;
  onChange: (status: Status) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Status)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aktif">Aktif</SelectItem>
          <SelectItem value="nonaktif">Nonaktif</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function CFInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));
  const parsed = Number(raw);
  const invalid = raw.trim() === "" || Number.isNaN(parsed) || parsed < 0 || parsed > 1;

  return (
    <div className="space-y-2">
      <Label htmlFor="cf-pakar">Nilai CF Pakar (0.00 - 1.00)</Label>
      <Input
        id="cf-pakar"
        type="number"
        min={0}
        max={1}
        step={0.05}
        value={raw}
        aria-invalid={invalid}
        aria-describedby="cf-pakar-help"
        onChange={(e) => {
          setRaw(e.target.value);
          const n = Number(e.target.value);
          if (!Number.isNaN(n) && n >= 0 && n <= 1) onChange(n);
        }}
      />
      {invalid ? (
        <p id="cf-pakar-help" className="text-sm text-destructive">
          Nilai harus di antara 0.00 dan 1.00.
        </p>
      ) : null}
    </div>
  );
}

function validateKnowledgeItem({
  code,
  name,
  prefix,
  entity,
  existingCodes,
  editingCode,
}: {
  code: string;
  name: string;
  prefix: "G" | "O";
  entity: string;
  existingCodes: string[];
  editingCode: string | null;
}): string | null {
  const normalizedCode = code.trim().toUpperCase();
  if (!codePatterns[prefix].test(normalizedCode)) {
    return `Kode ${entity} harus memakai format ${prefix}01, ${prefix}02, dan seterusnya.`;
  }
  if (!name.trim()) return `Nama ${entity} tidak boleh kosong.`;
  if (isDuplicateCode(normalizedCode, existingCodes, editingCode)) {
    return `Kode ${normalizedCode} sudah digunakan.`;
  }
  return null;
}

function validateRuleDraft(
  draft: Rule,
  existingCodes: string[],
  editingCode: string | null,
): string | null {
  const normalizedCode = draft.code.trim().toUpperCase();
  if (!codePatterns.R.test(normalizedCode)) {
    return "Kode rule harus memakai format R01, R02, dan seterusnya.";
  }
  if (isDuplicateCode(normalizedCode, existingCodes, editingCode)) {
    return `Kode ${normalizedCode} sudah digunakan.`;
  }
  if (draft.symptom_codes.length === 0) return "Rule harus memiliki minimal satu gejala.";
  if (!draft.recommendation_code) return "Rekomendasi wajib dipilih.";
  if (draft.cf_pakar < 0 || draft.cf_pakar > 1) return "Nilai CF harus di antara 0.00 dan 1.00.";
  return null;
}

function isDuplicateCode(
  code: string,
  existingCodes: string[],
  editingCode: string | null,
): boolean {
  return existingCodes.some(
    (existingCode) =>
      existingCode.toUpperCase() === code &&
      existingCode.toUpperCase() !== editingCode?.toUpperCase(),
  );
}

function nextCode(prefix: string, existing: string[]): string {
  const nums = existing
    .map((c) => parseInt(c.replace(prefix, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(2, "0")}`;
}
