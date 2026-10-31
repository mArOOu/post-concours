"use client";

import { useState } from "react";
import { updateFaqAction, createFaqAction, deleteFaqAction } from "./faqActions";

type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function FaqClient({ faqs }: { faqs: FaqEntry[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "Général", active: true });

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    setError(null);
    try {
      if (editingFaq) {
        await updateFaqAction(editingFaq.id, { question: form.question, answer: form.answer, category: form.category, active: form.active });
      } else {
        await createFaqAction({ id: crypto.randomUUID(), question: form.question, answer: form.answer, category: form.category, active: form.active });
      }
      setModalOpen(false);
      setEditingFaq(null);
      setForm({ question: "", answer: "", category: "Général", active: true });
      window.location.reload();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette FAQ ?")) return;
    try {
      setError(null);
      await deleteFaqAction(id);
      window.location.reload();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Suppression impossible.");
    }
  };

  const startEdit = (faq: FaqEntry) => {
    setEditingFaq(faq);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, active: faq.active });
    setModalOpen(true);
  };

  const filtered = faqs.filter((f) => {
    if (activeTab === "active" && !f.active) return false;
    if (activeTab === "inactive" && f.active) return false;
    if (search && !f.question.toLowerCase().includes(search.toLowerCase()) && !f.answer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">FAQ</h1>
          <p className="text-sm text-muted mt-1">Gérez les questions fréquemment posées affichées sur le site public.</p>
        </div>
        <button onClick={() => { setEditingFaq(null); setForm({ question: "", answer: "", category: "Général", active: true }); setModalOpen(true); }} className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/90">
          + Nouvelle entrée
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {(["all", "active", "inactive"] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`rounded-lg px-3 py-1 text-sm capitalize ${activeTab === t ? "bg-accent/10 text-accent" : "bg-white/50 text-muted hover:bg-white/80"}`}>
            {t === "all" ? "Toutes" : t === "active" ? "Actives" : "Inactives"}
          </button>
        ))}
        <div className="relative ml-auto">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="ui-input h-8 w-48 pl-8 text-sm" />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="ui-empty-state"><p className="text-sm text-muted">Aucune FAQ. Créez la première.</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => (
            <div key={f.id} className="ui-card rounded-xl border border-border/40 bg-white/40 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{f.question}</span>
                    <select value={f.active ? "active" : "inactive"} onChange={(e) => { const newActive = e.target.value === "active"; updateFaqAction(f.id, { active: newActive }); window.location.reload(); }} className="ui-select h-6 text-[11px] text-muted">
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{f.answer}</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-foreground/40">
                    <span className="rounded-full bg-muted px-2 py-0.5">{f.category}</span>
                    <span>{f.createdAt ? f.createdAt.toLocaleDateString("fr-FR") : "—"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(f)} className="ui-btn ghost text-xs">Modifier</button>
                  <button onClick={() => handleDelete(f.id)} className="ui-btn ghost text-xs text-red-500 hover:text-red-600">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">{editingFaq ? "Modifier" : "Nouvelle"} FAQ</h3>
            <div className="mt-4 space-y-3">
              <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="ui-input" />
              <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Réponse" className="ui-textarea min-h-[100px]" />
              <div className="flex items-center gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="ui-select flex-1">
                  <option>Général</option><option>Recrutement</option><option>Concours</option><option>Formation</option><option>Autre</option>
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4" /> Actif</label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="ui-btn ghost">Annuler</button>
              <button onClick={handleSave} disabled={saving || !form.question.trim() || !form.answer.trim()} className="ui-btn primary">{saving ? "Enregistrement..." : (editingFaq ? "Modifier" : "Créer")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
