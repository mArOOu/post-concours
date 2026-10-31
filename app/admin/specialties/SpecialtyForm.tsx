"use client";

import { useState, useEffect } from "react";
import { getSpecialtyAction, createSpecialtyAction, updateSpecialtyAction } from "./SpecialtyFormActions";

type SpecialtyRecord = {
  id: string;
  name: string;
  slug: string;
  category: string;
  active: boolean;
  shortSummary?: string;
  overview?: string;
  typicalDay?: string;
  residency?: string;
  pros?: string[];
  cons?: string[];
  commonDiseases?: string[];
  keywords?: string[];
  faqIds?: string[];
  residentInterviewIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

const CATEGORIES = ["medical", "surgical", "diagnostic", "other"] as const;

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function SpecialtyForm({ specialtyId, onSaved, onCancel }: { specialtyId?: string; onSaved: () => void; onCancel: () => void }) {
  const isEditing = !!specialtyId;
  const [form, setForm] = useState<Partial<SpecialtyRecord>>({
    id: "", slug: "", name: "", category: "medical", overview: "", typicalDay: "", residency: "",
    pros: [], cons: [], commonDiseases: [], shortSummary: "", keywords: [], active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (specialtyId) {
      getSpecialtyAction(specialtyId)
        .then((data) => setForm(data as unknown as SpecialtyRecord))
        .catch(() => {});
    }
  }, [specialtyId]);

  const update = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      ...form,
      pros: Array.isArray(form.pros) ? form.pros : (form.pros ?? "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
      cons: Array.isArray(form.cons) ? form.cons : (form.cons ?? "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
      commonDiseases: Array.isArray(form.commonDiseases) ? form.commonDiseases : (form.commonDiseases ?? "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
      keywords: Array.isArray(form.keywords) ? form.keywords : (form.keywords ?? "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
    };
    try {
      if (isEditing && form.id) {
        await updateSpecialtyAction(form.id, payload);
      } else {
        const id = payload.id || slugify(payload.name || "new-specialty");
        await createSpecialtyAction({
          id, slug: payload.slug || slugify(payload.name || "new-specialty"),
          name: payload.name ?? "", category: payload.category ?? "medical",
          overview: payload.overview ?? "", typicalDay: payload.typicalDay ?? "", residency: payload.residency ?? "",
          pros: payload.pros instanceof Array ? payload.pros : [],
          cons: payload.cons instanceof Array ? payload.cons : [],
          commonDiseases: payload.commonDiseases instanceof Array ? payload.commonDiseases : [],
          active: payload.active !== false,
          shortSummary: payload.shortSummary ?? undefined,
          keywords: payload.keywords instanceof Array ? payload.keywords : undefined,
          faqIds: payload.faqIds instanceof Array ? payload.faqIds : undefined,
          residentInterviewIds: payload.residentInterviewIds instanceof Array ? payload.residentInterviewIds : undefined,
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l&apos;enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEditing ? "Modifier la spécialité" : "Nouvelle spécialité"}</h2>
          <button onClick={onCancel} className="rounded-lg p-1 text-muted hover:bg-muted/50">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Nom</label>
              <input type="text" value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} required className="ui-input mt-1" placeholder="Médecine Interne" />
            </div>
            <div>
              <label className="block text-sm font-medium">Slug</label>
              <input type="text" value={form.slug ?? ""} onChange={(e) => update("slug", e.target.value)} required className="ui-input mt-1" placeholder="medecine-interne" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Catégorie</label>
            <select value={form.category ?? "medical"} onChange={(e) => update("category", e.target.value)} className="ui-select mt-1 w-full">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "medical" ? "Médical" : c === "surgical" ? "Chirurgical" : c === "diagnostic" ? "Diagnostic" : "Autre"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Aperçu</label>
            <textarea value={form.overview ?? ""} onChange={(e) => update("overview", e.target.value)} rows={3} className="ui-textarea mt-1" placeholder="Description de la spécialité..." />
          </div>
          <div>
            <label className="block text-sm font-medium">Journée type</label>
            <textarea value={form.typicalDay ?? ""} onChange={(e) => update("typicalDay", e.target.value)} rows={3} className="ui-textarea mt-1" placeholder="Description d&apos;une journée type..." />
          </div>
          <div>
            <label className="block text-sm font-medium">Formation / Résidanat</label>
            <textarea value={form.residency ?? ""} onChange={(e) => update("residency", e.target.value)} rows={2} className="ui-textarea mt-1" placeholder="Description du programme..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Points forts (comma-separated)</label>
              <input type="text" value={(Array.isArray(form.pros) ? form.pros.join(", ") : form.pros) ?? ""} onChange={(e) => update("pros", e.target.value)} className="ui-input mt-1" placeholder="Diagnostic, Flexibilité, Continuité" />
            </div>
            <div>
              <label className="block text-sm font-medium">Points faibles (comma-separated)</label>
              <input type="text" value={(Array.isArray(form.cons) ? form.cons.join(", ") : form.cons) ?? ""} onChange={(e) => update("cons", e.target.value)} className="ui-input mt-1" placeholder="Charge cognitive, Horaires longs" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Maladies fréquentes (comma-separated)</label>
              <input type="text" value={(Array.isArray(form.commonDiseases) ? form.commonDiseases.join(", ") : form.commonDiseases) ?? ""} onChange={(e) => update("commonDiseases", e.target.value)} className="ui-input mt-1" placeholder="Diabète, Hypertension, Insuffisance rénale" />
            </div>
            <div>
              <label className="block text-sm font-medium">Mots-clés (comma-separated)</label>
              <input type="text" value={(Array.isArray(form.keywords) ? form.keywords.join(", ") : form.keywords) ?? ""} onChange={(e) => update("keywords", e.target.value)} className="ui-input mt-1" placeholder="diagnostic, suivi, médical" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Résumé court</label>
            <textarea value={form.shortSummary ?? ""} onChange={(e) => update("shortSummary", e.target.value)} rows={2} className="ui-textarea mt-1" placeholder="Résumé d&apos;une ligne..." />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.active !== false} onChange={(e) => update("active", e.target.checked)} className="h-4 w-4 rounded border-border bg-white" />
              Actif
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="ui-button ui-button-primary">
              {saving ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer la spécialité"}
            </button>
            <button type="button" onClick={onCancel} className="ui-button ui-button-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
