"use client";

import { useState } from "react";
import {
  updateAttributeDefinitionAction,
  createAttributeDefinitionAction,
  deleteAttributeDefinitionAction,
  updateScoringModelAction,
  createScoringModelAction,
  deleteScoringModelAction,
} from "./settingsActions";

type AttributeDefinitionRecord = {
  id: string;
  name: string;
  description?: string;
  scaleMin?: number;
  scaleMax?: number;
  category?: string;
  active?: boolean;
  weight?: number;
  trait?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type ScoringModelRecord = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  weights?: Record<string, number>;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

interface SettingsClientProps {
  attrs: AttributeDefinitionRecord[];
  models: ScoringModelRecord[];
}

const DEFAULT_WEIGHTS = { lifestyle: 0.2, stress: 0.15, procedures: 0.2, patientContact: 0.15, intellectual: 0.15, income: 0.15 };

export function SettingsClient({ attrs, models }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"attributes" | "scoring">("attributes");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Réglages (Settings)</h1>
        <p className="text-sm text-muted mt-1">
          Gérer les définitions d&apos;attributs et les modèles de scoring.
        </p>
      </div>

      <div className="flex gap-1 rounded-xl border border-border/40 bg-muted/20 p-1">
        <button onClick={() => setActiveTab("attributes")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "attributes" ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}>
          Définitions d&apos;attributs
        </button>
        <button onClick={() => setActiveTab("scoring")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "scoring" ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}>
          Modèles de scoring
        </button>
      </div>

      {activeTab === "attributes" && (
        <AttributeDefinitionsSection attrs={attrs} onDelete={deleteAttributeDefinitionAction} />
      )}
      {activeTab === "scoring" && (
        <ScoringModelsSection models={models} onDelete={deleteScoringModelAction} />
      )}
    </div>
  );
}

function AttributeDefinitionsSection({ attrs, onDelete }: { attrs: AttributeDefinitionRecord[]; onDelete: (id: string) => Promise<void> }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AttributeDefinitionRecord | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<AttributeDefinitionRecord | null>(null);
  const [form, setForm] = useState<Partial<AttributeDefinitionRecord>>({ id: "", name: "", description: "", scaleMin: 1, scaleMax: 5, category: "", active: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => { setForm({ id: "", name: "", description: "", scaleMin: 1, scaleMax: 5, category: "", active: true }); setEditing(undefined); };
  const openCreate = () => { resetForm(); setFormOpen(true); };
  const openEdit = (a: AttributeDefinitionRecord) => { setEditing(a); setForm({ id: a.id, name: a.name, description: a.description, scaleMin: a.scaleMin, scaleMax: a.scaleMax, category: a.category, active: a.active }); setFormOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSaving(true);
    try {
      const payload = { ...form, scaleMin: form.scaleMin ?? 1, scaleMax: form.scaleMax ?? 5 };
      if (editing?.id) { await updateAttributeDefinitionAction(editing.id, payload); }
      else { await createAttributeDefinitionAction({ id: form.id || crypto.randomUUID().slice(0, 8), name: form.name ?? "", description: form.description ?? "", scaleMin: form.scaleMin ?? 1, scaleMax: form.scaleMax ?? 5, category: form.category ?? "", active: form.active !== false }); }
      setFormOpen(false); resetForm(); window.location.reload();
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setError(null);
      await onDelete(deleteConfirm.id);
      window.location.reload();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Suppression impossible.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Les 6 attributs principaux sont utilisés par le moteur de scoring.</p>
        <button onClick={openCreate} className="ui-button ui-button-primary">+ Nouvel attribut</button>
      </div>
      {attrs.length === 0 ? (
        <div className="ui-empty-state"><p className="text-sm text-muted">Aucun attribut défini.</p></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/40 bg-white/30">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-foreground/60">ID</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">Nom</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">Description</th>
              <th className="px-3 py-3 text-center font-medium text-foreground/60">Échelle</th>
              <th className="px-3 py-3 text-left font-medium text-foreground/60">Catégorie</th>
              <th className="px-3 py-3 text-center font-medium text-foreground/60">Statut</th>
              <th className="px-4 py-3 text-right font-medium text-foreground/60">Actions</th>
            </tr></thead>
            <tbody>
              {attrs.map((a) => (
                <tr key={a.id} className="border-b border-border/20 hover:bg-white/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 text-muted max-w-[250px] truncate">{a.description}</td>
                  <td className="px-3 py-3 text-center text-sm">{a.scaleMin} — {a.scaleMax}</td>
                  <td className="px-3 py-3 text-muted">{a.category}</td>
                  <td className="px-3 py-3 text-center">{a.active === false ? <span className="inline-flex h-6 items-center rounded-full bg-red-50 px-2 text-xs text-red-500">Inactif</span> : <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-xs text-emerald-600">Actif</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="ui-button ui-button-secondary ui-button-sm">Éditer</button>
                      <button onClick={() => setDeleteConfirm(a)} className="ui-button ui-button-ghost ui-button-sm text-red-500 hover:bg-red-50">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-md w-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? "Modifier l'attribut" : "Nouvel attribut"}</h2>
              <button onClick={() => { setFormOpen(false); resetForm(); }} className="rounded-lg p-1 text-muted hover:bg-muted/50"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <div><label className="block text-sm font-medium">ID (unique)</label><input type="text" value={form.id ?? ""} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))} required className="ui-input mt-1 font-mono text-sm" placeholder="lifestyle" /></div>
              <div><label className="block text-sm font-medium">Nom</label><input type="text" value={form.name ?? ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="ui-input mt-1" placeholder="Équilibre / Lifestyle" /></div>
              <div><label className="block text-sm font-medium">Description</label><textarea value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={2} className="ui-textarea mt-1" placeholder="Description de l&apos;attribut..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Échelle min</label><input type="number" value={form.scaleMin ?? 1} onChange={(e) => setForm((p) => ({ ...p, scaleMin: parseInt(e.target.value, 10) || 1 }))} className="ui-input mt-1 w-20" /></div>
                <div><label className="block text-sm font-medium">Échelle max</label><input type="number" value={form.scaleMax ?? 5} onChange={(e) => setForm((p) => ({ ...p, scaleMax: parseInt(e.target.value, 10) || 5 }))} className="ui-input mt-1 w-20" /></div>
              </div>
              <div><label className="block text-sm font-medium">Catégorie</label><input type="text" value={form.category ?? ""} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="ui-input mt-1" placeholder="Lifestyle" /></div>
              <div className="flex items-center gap-3"><label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.active !== false} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="h-4 w-4 rounded border-border bg-white" />Actif</label></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="ui-button ui-button-primary">{saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer"}</button>
                <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="ui-button ui-button-secondary">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold">Supprimer cet attribut ?</h2>
            <p className="mt-2 text-sm text-muted">« {deleteConfirm.name} » sera définitivement supprimé.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleDelete} className="ui-button ui-button-primary">Supprimer</button>
              <button onClick={() => setDeleteConfirm(null)} className="ui-button ui-button-secondary">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoringModelsSection({ models, onDelete }: { models: ScoringModelRecord[]; onDelete: (id: string) => Promise<void> }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ScoringModelRecord | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<ScoringModelRecord | null>(null);
  const [form, setForm] = useState<Partial<ScoringModelRecord>>({ id: "", name: "", version: "1.0.0", description: "", weights: { ...DEFAULT_WEIGHTS }, active: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => { setForm({ id: "", name: "", version: "1.0.0", description: "", weights: { ...DEFAULT_WEIGHTS }, active: true }); setEditing(undefined); };
  const openCreate = () => { resetForm(); setFormOpen(true); };
  const openEdit = (m: ScoringModelRecord) => { setEditing(m); setForm({ id: m.id, name: m.name, version: m.version, description: m.description ?? "", weights: { ...m.weights }, active: m.active }); setFormOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSaving(true);
    try {
      const payload = { ...form, weights: form.weights ?? { ...DEFAULT_WEIGHTS } };
      if (editing?.id) { await updateScoringModelAction(editing.id, payload); }
      else { await createScoringModelAction({ id: form.id || crypto.randomUUID().slice(0, 8), name: form.name ?? "", version: form.version ?? "1.0.0", description: form.description ?? undefined, weights: form.weights ?? { ...DEFAULT_WEIGHTS }, active: form.active !== false }); }
      setFormOpen(false); resetForm(); window.location.reload();
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setError(null);
      await onDelete(deleteConfirm.id);
      window.location.reload();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Suppression impossible.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Les modèles de scoring définissent les poids des attributs dans le calcul du score de matching.</p>
        <button onClick={openCreate} className="ui-button ui-button-primary">+ Nouveau modèle</button>
      </div>
      {models.length === 0 ? (
        <div className="ui-empty-state"><p className="text-sm text-muted">Aucun modèle de scoring.</p></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/40 bg-white/30">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-foreground/60">ID</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">Nom</th>
              <th className="px-3 py-3 text-center font-medium text-foreground/60">Version</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/60">Poids</th>
              <th className="px-3 py-3 text-center font-medium text-foreground/60">Statut</th>
              <th className="px-4 py-3 text-right font-medium text-foreground/60">Actions</th>
            </tr></thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.id} className="border-b border-border/20 hover:bg-white/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{m.id}</td>
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-3 py-3 text-center text-sm text-muted">{m.version}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{Object.entries(m.weights ?? {}).map(([k, v]) => <span key={k} className="ui-chip text-xs">{k}: {v}</span>)}</div></td>
                  <td className="px-3 py-3 text-center">{m.active === false ? <span className="inline-flex h-6 items-center rounded-full bg-red-50 px-2 text-xs text-red-500">Inactif</span> : <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-xs text-emerald-600">Actif</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="ui-button ui-button-secondary ui-button-sm">Éditer</button>
                      <button onClick={() => setDeleteConfirm(m)} className="ui-button ui-button-ghost ui-button-sm text-red-500 hover:bg-red-50">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-lg w-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? "Modifier le modèle" : "Nouveau modèle de scoring"}</h2>
              <button onClick={() => { setFormOpen(false); resetForm(); }} className="rounded-lg p-1 text-muted hover:bg-muted/50"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <div><label className="block text-sm font-medium">ID (unique)</label><input type="text" value={form.id ?? ""} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))} required className="ui-input mt-1 font-mono text-sm" placeholder="baseline-v1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Nom</label><input type="text" value={form.name ?? ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="ui-input mt-1" placeholder="Baseline Model" /></div>
                <div><label className="block text-sm font-medium">Version</label><input type="text" value={form.version ?? "1.0.0"} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} className="ui-input mt-1" placeholder="1.0.0" /></div>
              </div>
              <div><label className="block text-sm font-medium">Description</label><textarea value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="ui-textarea mt-1" /></div>
              <div><label className="block text-sm font-medium mb-2">Poids des attributs (total ≈ 1.0)</label><div className="space-y-2">{Object.entries(form.weights ?? {}).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3"><span className="text-sm w-28">{key}</span><input type="number" step={0.05} min={0} max={1} value={val} onChange={(e) => { const w = { ...(form.weights ?? {}) }; w[key] = parseFloat(e.target.value) || 0; setForm((p) => ({ ...p, weights: w })); }} className="ui-input w-20 text-sm" /></div>
              ))}</div></div>
              <div className="flex items-center gap-3"><label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.active !== false} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="h-4 w-4 rounded border-border bg-white" />Actif</label></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="ui-button ui-button-primary">{saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer"}</button>
                <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="ui-button ui-button-secondary">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold">Supprimer ce modèle ?</h2>
            <p className="mt-2 text-sm text-muted">« {deleteConfirm.name} » sera définitivement supprimé.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleDelete} className="ui-button ui-button-primary">Supprimer</button>
              <button onClick={() => setDeleteConfirm(null)} className="ui-button ui-button-secondary">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
