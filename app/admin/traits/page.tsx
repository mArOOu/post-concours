import { listAttributeDefinitions } from "@/src/services/firestore/settings";
import { listQuestions } from "@/src/services/firestore/questions";
import Link from "next/link";

const CORE_ATTRIBUTES = [
  { id: "lifestyle", labelFr: "Équilibre / vie personnelle", labelEn: "Lifestyle Balance" },
  { id: "stress", labelFr: "Niveau de stress", labelEn: "Stress Level" },
  { id: "procedures", labelFr: "Travail manuel / procédures", labelEn: "Procedural Work" },
  { id: "patientContact", labelFr: "Contact patient", labelEn: "Patient Contact" },
  { id: "intellectual", labelFr: "Profondeur intellectuelle", labelEn: "Intellectual Depth" },
  { id: "income", labelFr: "Potentiel de revenu", labelEn: "Income Potential" },
] as const;

export default async function AdminTraitsPage() {
  const [defs, questions] = await Promise.all([
    listAttributeDefinitions(),
    listQuestions(),
  ]);

  const attrMap: Record<string, { name: string; description: string; active: boolean }> = {};
  for (const d of defs) attrMap[d.id] = { name: d.name, description: d.description, active: d.active };

  const counts: Record<string, number> = {};
  for (const q of questions) {
    for (const t of q.traitIds ?? []) {
      counts[t] = (counts[t] ?? 0) + 1;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Traits / Attributs</h1>
        <p className="text-sm text-muted mt-1">
          Les 6 dimensions utilisées par le moteur de scoring pour comparer les candidats aux spécialités.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_ATTRIBUTES.map((attr) => {
          const def = attrMap[attr.id];
          const count = counts[attr.id] ?? 0;
          return (
            <div key={attr.id} className="ui-card-elevated p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent text-lg font-bold">
                    {attr.labelFr[0]}
                  </div>
                  <div>
                    <h2 className="font-semibold">{attr.labelFr}</h2>
                    {def?.name !== attr.labelFr && (
                      <p className="text-[11px] text-muted">{def?.name}</p>
                    )}
                  </div>
                </div>
                <span className="ui-badge text-xs">{count} question{count !== 1 ? "s" : ""}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {def?.description ?? "Aucune description configurée."}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-mono">{attr.id}</span>
                <span className="text-foreground/20">·</span>
                <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 text-emerald-600">
                  {def?.active !== false ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-xl border border-border/40 bg-muted/20 p-5">
        <h3 className="text-sm font-medium mb-3">Note</h3>
        <p className="text-sm text-muted">
          Pour modifier les noms, descriptions ou statuts de ces attributs, utilisez la page
          <Link href="/admin/settings" className="text-accent hover:underline">
            {" "}Réglages → Définitions d&apos;attributs
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
