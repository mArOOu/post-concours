"use client";

import { useState } from "react";
import { SpecialtyForm } from "./SpecialtyForm";
import { deleteSpecialtyAction } from "./specialtiesActions";

interface SpecialtiesClientProps {
  specialties: readonly {
    id: string;
    name: string;
    slug: string;
    category: string;
    active: boolean;
    shortSummary?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}

export function SpecialtiesClient({ specialties }: SpecialtiesClientProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Spécialités</h1>
          <p className="text-sm text-muted mt-1">Gérer les spécialités de résidence.</p>
        </div>
        <button
          onClick={() => { setEditingId(undefined); setFormOpen(true); }}
          className="ui-button ui-button-primary"
        >
          + Nouvelle spécialité
        </button>
      </div>

      {formOpen && (
        <SpecialtyForm
          specialtyId={editingId}
          onSaved={() => { setFormOpen(false); setEditingId(undefined); window.location.reload(); }}
          onCancel={() => { setFormOpen(false); setEditingId(undefined); }}
        />
      )}

      {specialties.length === 0 ? (
        <div className="ui-empty-state">
          <p className="text-sm text-muted">Aucune spécialité. Créez la première.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/40 bg-white/30">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-foreground/60">Spécialité</th>
                <th className="px-3 py-3 text-left font-medium text-foreground/60">Slug</th>
                <th className="px-3 py-3 text-left font-medium text-foreground/60">Catégorie</th>
                <th className="px-3 py-3 text-left font-medium text-foreground/60">Statut</th>
                <th className="px-3 py-3 text-left font-medium text-foreground/60">Résumé</th>
                <th className="px-4 py-3 text-right font-medium text-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map((sp) => (
                <tr key={sp.id} className="border-b border-border/20 hover:bg-white/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase">
                        {sp.category?.[0] ?? "?"}
                      </span>
                      <span className="font-medium truncate max-w-[180px]">{sp.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted font-mono text-xs">{sp.slug}</td>
                  <td className="px-3 py-3">
                    <span className="ui-badge">
                      {sp.category === "medical" ? "Médical"
                        : sp.category === "surgical" ? "Chirurgical"
                        : sp.category === "diagnostic" ? "Diagnostic"
                        : "Autre"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {sp.active === false ? (
                      <span className="inline-flex h-6 items-center rounded-full bg-red-50 px-2 text-xs text-red-500">Inactif</span>
                    ) : (
                      <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-xs text-emerald-600">Actif</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-muted max-w-[200px] truncate">
                    {sp.shortSummary ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/admin/specialties/edit/${sp.id}`} className="inline-flex h-8 px-3 rounded-lg border border-border/30 bg-white/50 text-sm text-foreground/70 hover:bg-white hover:text-foreground transition-colors">
                        Éditer
                      </a>
                      <button
                        onClick={() => setDeleteId(sp.id)}
                        className="inline-flex h-8 px-3 rounded-lg border border-border/30 bg-white/50 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold">Supprimer cette spécialité ?</h2>
            <p className="mt-2 text-sm text-muted">Cette action est irréversible.</p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={async () => {
                  await deleteSpecialtyAction(deleteId);
                  window.location.reload();
                }}
                className="ui-button ui-button-primary"
              >
                Supprimer
              </button>
              <button onClick={() => setDeleteId(null)} className="ui-button ui-button-secondary">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
