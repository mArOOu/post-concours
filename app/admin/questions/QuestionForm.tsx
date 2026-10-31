"use client";

import { useState, useEffect } from "react";
import { createQuestionAction, updateQuestionAction, getQuestionAction } from "./questionsActions";

const TRAITS = [
  { id: "lifestyle", label: "Équilibre / vie personnelle" },
  { id: "stress", label: "Niveau de stress" },
  { id: "procedures", label: "Travail manuel / procédures" },
  { id: "patientContact", label: "Contact patient" },
  { id: "intellectual", label: "Profondeur intellectuelle" },
  { id: "income", label: "Potentiel de revenu" },
] as const;

type QuestionRecord = {
  id: string;
  text?: string;
  questionText?: string;
  category?: string;
  traitIds?: string[];
  scaleMin?: number;
  scaleMax?: number;
  weight?: number;
  reverseScored?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function QuestionForm({ question, onSave, onCancel }: { question?: QuestionRecord; onSave: () => void; onCancel: () => void }) {
  const isEditing = !!question;
  const [form, setForm] = useState<Partial<QuestionRecord>>(
    question ?? {
      id: "", questionText: "", category: "", traitIds: [], weight: 1,
      reverseScored: false, scaleMin: 1, scaleMax: 5, active: true,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (question?.id) {
      getQuestionAction(question.id)
        .then((data) => setForm(data as unknown as QuestionRecord))
        .catch(() => {});
    }
  }, [question?.id]);

  const update = (key: keyof QuestionRecord, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTrait = (traitId: string) => {
    const current = (form.traitIds ?? []) as string[];
    const next = current.includes(traitId) ? current.filter((t) => t !== traitId) : [...current, traitId];
    update("traitIds", next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = { ...form, traitIds: form.traitIds ?? [] };
    try {
      if (isEditing && form.id) {
        await updateQuestionAction(form.id, payload);
      } else {
        const id = form.id || `q${crypto.randomUUID().slice(0, 8)}`;
        await createQuestionAction({
          id, questionText: form.questionText ?? "", category: form.category ?? "",
          traitIds: form.traitIds instanceof Array ? form.traitIds : [],
          weight: form.weight ?? 1, reverseScored: form.reverseScored === true,
          scaleMin: form.scaleMin ?? 1, scaleMax: form.scaleMax ?? 5,
          active: form.active !== false,
        });
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium">Question</label>
        <textarea value={form.questionText ?? ""} onChange={(e) => update("questionText", e.target.value)} required rows={3} className="ui-textarea mt-1" placeholder="I want a strong work-life balance." />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Catégorie</label>
          <input type="text" value={form.category ?? ""} onChange={(e) => update("category", e.target.value)} className="ui-input mt-1" placeholder="Lifestyle" />
        </div>
        <div>
          <label className="block text-sm font-medium">Poids (weight)</label>
          <input type="number" min={1} max={10} value={form.weight ?? 1} onChange={(e) => update("weight", parseInt(e.target.value, 10) || 1)} className="ui-input mt-1 w-24" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Attributs concernés (traitIds)</label>
        <div className="space-y-2">
          {TRAITS.map((t) => (
            <label key={t.id} className="flex items-center gap-3 cursor-pointer text-sm rounded-lg border border-border/40 bg-white/40 p-2.5 hover:bg-white/80 transition-colors">
              <input type="checkbox" checked={(form.traitIds ?? []).includes(t.id)} onChange={() => toggleTrait(t.id)} className="h-4 w-4 rounded border-border bg-white" />
              <span className="font-medium">{t.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 items-end">
        <div>
          <label className="block text-sm font-medium">Échelle min</label>
          <input type="number" min={1} max={5} value={form.scaleMin ?? 1} onChange={(e) => update("scaleMin", parseInt(e.target.value, 10) || 1)} className="ui-input mt-1 w-20" />
        </div>
        <div>
          <label className="block text-sm font-medium">Échelle max</label>
          <input type="number" min={1} max={5} value={form.scaleMax ?? 5} onChange={(e) => update("scaleMax", parseInt(e.target.value, 10) || 5)} className="ui-input mt-1 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" checked={form.reverseScored === true} onChange={(e) => update("reverseScored", e.target.checked)} className="h-4 w-4 rounded border-border bg-white" />
          Score inversé (reverseScored)
        </label>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" checked={form.active !== false} onChange={(e) => update("active", e.target.checked)} className="h-4 w-4 rounded border-border bg-white" />
          Actif
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="ui-button ui-button-primary">
          {saving ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer la question"}
        </button>
        <button type="button" onClick={onCancel} className="ui-button ui-button-secondary">Annuler</button>
      </div>
    </form>
  );
}
