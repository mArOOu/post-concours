"use client";

import { useState } from "react";
import { updateProfileScoreAction } from "./scoresActions";

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

type AttributeDefinitionRecord = {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  trait?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const ATTRIBUTE_LABELS: Record<string, string> = {
  lifestyle: "Équilibre / vie personnelle",
  stress: "Niveau de stress",
  procedures: "Travail manuel / procédures",
  patientContact: "Contact patient",
  intellectual: "Profondeur intellectuelle",
  income: "Potentiel de revenu",
};

interface ScoresClientProps {
  attributes: AttributeDefinitionRecord[];
  specialties: (SpecialtyRecord & { attributeScores?: SpecialtyAttributeScores })[];
}

export default function ScoresClient({ attributes, specialties }: ScoresClientProps) {
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Scores & clés de scoring</h1>
        <p className="text-sm text-muted mt-1">
          Définissez le profil de chaque spécialité sur 6 dimensions (1-5). Le questionnaire
          du candidat est comparé à ces profils pour produire un score de Matching.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-foreground/60 mb-3">Attributs utilisés</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {attributes.map((a) => (
            <div key={a.id} className="ui-card flex items-start gap-3 rounded-xl border border-border/40 bg-white/40 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent text-sm font-bold">
                {ATTRIBUTE_LABELS[a.id]?.[0] ?? a.id[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm">{a.name}</p>
                <p className="text-xs text-muted mt-0.5">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-foreground/60 mb-3">Profils de spécialité (1-5)</h2>
        <div className="overflow-x-auto rounded-xl border border-border/40 bg-white/30">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-foreground/60 w-[200px]">Spécialité</th>
                {attributes.map((a) => (
                  <th key={a.id} className="px-3 py-3 text-center font-medium text-foreground/60">
                    <div className="whitespace-nowrap text-xs">
                      <span className="block leading-tight">{a.name}</span>
                      <span className="text-[10px] text-foreground/40 font-normal">{ATTRIBUTE_LABELS[a.id]}</span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-medium text-foreground/60">Status</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map((sp) => {
                const scores = sp.attributeScores ?? {};
                return (
                  <tr key={sp.id} className="border-b border-border/20 hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {sp.category === "medical" ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold">Med</span>
                        ) : sp.category === "surgical" ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-50 text-orange-600 text-[10px] font-bold">Surg</span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-50 text-violet-600 text-[10px] font-bold">Oth</span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">{sp.name}</p>
                          <p className="text-[11px] text-muted flex items-center gap-1">
                            {sp.slug}
                            {sp.active === false && <span className="ml-1 inline-flex h-4 items-center rounded-full bg-red-50 px-1.5 text-[10px] text-red-500">Inactif</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    {attributes.map((a) => {
                      const val = scores[a.id] ?? 3;
                      const isSaving = savingId === sp.id;
                      return (
                        <td key={a.id} className="px-3 py-3 text-center">
                          <select
                            value={val}
                            onChange={(e) => {
                              const nv = parseInt(e.target.value, 10);
                              if (!isNaN(nv) && nv >= 1 && nv <= 5) handleScoreChange(sp.id, a.id, nv);
                            }}
                            disabled={isSaving}
                            className="ui-select inline-flex h-8 w-16 cursor-pointer items-center justify-center rounded-lg border border-border/60 bg-white text-center text-xs font-medium text-foreground shadow-sm disabled:opacity-50"
                          >
                            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
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
          {specialties.length === 0 && (
            <div className="flex h-40 items-center justify-center text-sm text-muted">Aucune spécialité en base. Définissez-les d&apos;abord sur la page Spécialités.</div>
          )}
        </div>
      </section>

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

      <section className="mt-8 rounded-xl border border-border/40 bg-white/30 p-5">
        <h3 className="text-sm font-medium mb-2">Données associées</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-white/50 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent text-sm font-bold">Q</span>
            <div><p className="text-sm font-medium">{specialties.length > 0 ? attributes.length : 0} questions</p><p className="text-xs text-muted">utilisées dans le questionnaire</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-white/50 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-50 text-violet-600 text-sm font-bold">S</span>
            <div><p className="text-sm font-medium">{specialties.length} spécialités</p><p className="text-xs text-muted">avec profils de scoring</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
