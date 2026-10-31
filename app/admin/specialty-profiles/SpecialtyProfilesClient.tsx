"use client";

import { useState } from "react";
import { updateProfileScoreAction } from "../scores/scoresActions";

type SpecialtyRecord = {
  id: string;
  name: string;
  slug: string;
  category: string;
  active: boolean;
  shortSummary?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type SpecialtyAttributeScores = Record<string, number>;

const ATTRIBUTES = ["lifestyle", "stress", "procedures", "patientContact", "intellectual", "income"] as const;
const ATTRIBUTE_LABELS: Record<string, string> = {
  lifestyle: "Équilibre / vie personnelle",
  stress: "Niveau de stress",
  procedures: "Travail manuel / procédures",
  patientContact: "Contact patient",
  intellectual: "Profondeur intellectuelle",
  income: "Potentiel de revenu",
};

export default function SpecialtyProfilesClient({ specialties }: { specialties: (SpecialtyRecord & { attributeScores?: SpecialtyAttributeScores })[] }) {
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleScoreChange = async (specialtyId: string, attrId: string, value: number) => {
    setSavingId(specialtyId);
    try {
      await updateProfileScoreAction(specialtyId, attrId, value);
      window.location.reload();
    } finally {
      setSavingId(null);
    }
  };

  const categories: Record<string, { label: string; cls: string }> = {
    medical: { label: "Med", cls: "bg-emerald-50 text-emerald-600" },
    surgical: { label: "Surg", cls: "bg-orange-50 text-orange-600" },
    diagnostic: { label: "Diag", cls: "bg-blue-50 text-blue-600" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Profils de spécialité</h1>
        <p className="text-sm text-muted mt-1">
          Définissez le profil de chaque spécialité sur 6 dimensions (1-5). Ces valeurs sont utilisées par le moteur de scoring.
          Le questionnaire du candidat est comparé à ces profils pour produire un score de Matching.
        </p>
      </div>

      {specialties.length === 0 ? (
        <div className="ui-empty-state">
          <p className="text-sm text-muted">Aucune spécialité. Créez-en d&apos;abord sur la page Spécialités.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/40 bg-white/30">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-foreground/60 w-[200px]">Spécialité</th>
                {ATTRIBUTES.map((a) => (
                  <th key={a} className="px-3 py-3 text-center font-medium text-foreground/60">
                    <div className="whitespace-nowrap text-xs">
                      <span className="block leading-tight capitalize">{ATTRIBUTE_LABELS[a]}</span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-medium text-foreground/60">Status</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map((sp) => {
                const scores = sp.attributeScores ?? {};
                const cat = categories[sp.category ?? ""] ?? { label: "?", cls: "bg-muted text-muted" };
                return (
                  <tr key={sp.id} className="border-b border-border/20 hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${cat.cls} text-[10px] font-bold`}>{cat.label}</span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">{sp.name}</p>
                          <p className="text-[11px] text-muted flex items-center gap-1">
                            {sp.slug}
                            {sp.active === false && (
                              <span className="ml-1 inline-flex h-4 items-center rounded-full bg-red-50 px-1.5 text-[10px] text-red-500">Inactif</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    {ATTRIBUTES.map((a) => {
                      const val = scores[a] ?? 3;
                      const isSaving = savingId === sp.id;
                      return (
                        <td key={a} className="px-3 py-3 text-center">
                          <select
                            value={val}
                            onChange={(e) => {
                              const nv = parseInt(e.target.value, 10);
                              if (!isNaN(nv) && nv >= 1 && nv <= 5) handleScoreChange(sp.id, a, nv);
                            }}
                            disabled={isSaving}
                            className="ui-select inline-flex h-8 w-16 cursor-pointer items-center justify-center rounded-lg border border-border/60 bg-white text-center text-xs font-medium text-foreground shadow-sm disabled:opacity-50"
                          >
                            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                          {val === 1 && <span className="ml-1 inline-flex h-4 items-center rounded-full bg-emerald-50 px-1 text-[10px] text-emerald-500">↓</span>}
                          {val === 5 && <span className="ml-1 inline-flex h-4 items-center rounded-full bg-amber-50 px-1 text-[10px] text-amber-600">↑</span>}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      {sp.active === false ? (
                        <span className="inline-flex h-6 items-center rounded-full bg-red-50 px-2 text-xs text-red-500">Inactif</span>
                      ) : (
                        <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-xs text-emerald-600">Actif</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="rounded-xl border border-border/40 bg-muted/20 p-5">
        <h3 className="text-sm font-medium mb-3">Comment lire ce tableau</h3>
        <ul className="space-y-2 text-sm text-muted">
          <li>• Chaque valeur est sur une échelle de <strong>1 à 5</strong>.</li>
          <li>• <strong>1</strong> = la spécialité incarne très peu cette dimension.</li>
          <li>• <strong>5</strong> = la spécialité incarne très fortement cette dimension.</li>
          <li>• Le moteur de scoring compare les réponses du candidat (axes 1-5) aux profils de spécialité.</li>
          <li>• Les valeurs par défaut (3) sont neutres — modifiez-les selon votre expertise.</li>
        </ul>
      </section>
    </div>
  );
}
