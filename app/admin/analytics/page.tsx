import { listResponses } from "@/src/services/firestore/responses";
import { listSpecialties } from "@/src/services/firestore/specialties";
import { listQuestions } from "@/src/services/firestore/questions";
import { getScoringModel } from "@/src/services/firestore/settings";
import { computeScoresWithQuestions } from "@/src/services/firestore/scoring";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function timestampToIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object" && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date instanceof Date ? date.toISOString() : "";
  }
  return typeof value === "string" ? value : "";
}

export default async function AdminAnalyticsPage() {
  const [responses, specialties, questions, scoringModel] = await Promise.all([
    listResponses(),
    listSpecialties(),
    listQuestions(),
    getScoringModel("baseline-v1"),
  ]);

  const recentResponses = responses
    .map((r) => ({
      id: r.id,
      answers: r.answers,
      createdAt: timestampToIso(r.createdAt),
    }))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 20);

  const now = new Date();
  const dayMs = 86400000;
  const counts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * dayMs);
    counts[d.toISOString().slice(0, 10)] = 0;
  }
  for (const r of responses) {
    const ts = timestampToIso(r.createdAt);
    const key = ts.slice(0, 10);
    if (counts[key] !== undefined) counts[key]++;
  }
  const dailyCounts = Object.entries(counts).map(([date, count]) => ({ date, count }));

  const matchCounts: Record<string, number> = {};
  if (scoringModel && specialties.length > 0) {
    for (const r of responses) {
      const results = computeScoresWithQuestions(
        r.answers,
        scoringModel,
        specialties.map((s) => ({ id: s.id, name: s.name, slug: s.slug, attributeScores: s.attributeScores })),
        questions,
      );
      if (results.length > 0) {
        matchCounts[results[0].specialtyName] = (matchCounts[results[0].specialtyName] ?? 0) + 1;
      }
    }
  }
  const topMatches = Object.entries(matchCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalCount = responses.length;
  const recentCount = recentResponses.length;
  const weekCount = dailyCounts.reduce((a, d) => a + d.count, 0);
  const maxDaily = Math.max(...dailyCounts.map((x) => x.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Analytique</h1>
        <p className="text-sm text-muted mt-1">
          Vue d&apos;ensemble des réponses, tendances, et spécialités les plus recommandées.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="ui-card-elevated p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent text-xl font-bold">
            {totalCount}
          </div>
          <div>
            <p className="text-sm font-medium">Total réponses</p>
            <p className="text-xs text-muted">Toutes les soumissions</p>
          </div>
        </div>
        <div className="ui-card-elevated p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 text-xl font-bold">
            {weekCount}
          </div>
          <div>
            <p className="text-sm font-medium">7 derniers jours</p>
            <p className="text-xs text-muted">Réponses récentes</p>
          </div>
        </div>
        <div className="ui-card-elevated p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-xl font-bold">
            {recentCount}
          </div>
          <div>
            <p className="text-sm font-medium">Réponses récentes</p>
            <p className="text-xs text-muted">20 dernières soumissions</p>
          </div>
        </div>
      </div>

      <section className="ui-card p-5">
        <h2 className="text-sm font-medium text-foreground/60 mb-4">Tendance quotidienne (7 jours)</h2>
        <div className="flex items-end gap-2 h-32">
          {dailyCounts.map((d) => {
            const pct = (d.count / maxDaily) * 100;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted">{d.count}</span>
                <div className="rounded-t-lg bg-accent/70 transition-all" style={{ height: `${Math.max(pct, 4)}%` }} />
                <span className="text-[10px] text-muted">
                  {new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short" })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="ui-card p-5">
        <h2 className="text-sm font-medium text-foreground/60 mb-4">Spécialités les plus recommandées</h2>
        {topMatches.length === 0 ? (
          <p className="text-sm text-muted">Pas assez de données pour afficher les matches.</p>
        ) : (
          <div className="space-y-2">
            {topMatches.map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/30 bg-white/40 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted">
                    {i + 1}
                  </span>
                  <span className="font-medium">{m.name}</span>
                </div>
                <span className="ui-badge">{m.count} vote{m.count !== 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="ui-card p-5">
        <h2 className="text-sm font-medium text-foreground/60 mb-4">Réponses récentes</h2>
        {recentResponses.length === 0 ? (
          <p className="text-sm text-muted">Aucune réponse en base.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/30 bg-white/30">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="px-3 py-2 text-left font-medium text-foreground/60">ID</th>
                  <th className="px-3 py-2 text-left font-medium text-foreground/60">Répondu le</th>
                  <th className="px-3 py-2 text-left font-medium text-foreground/60">Questions répondues</th>
                  <th className="px-3 py-2 text-left font-medium text-foreground/60">Score match</th>
                </tr>
              </thead>
              <tbody>
                {recentResponses.map((r) => {
                  const answeredCount = Object.keys(r.answers).length;
                  return (
                    <tr key={r.id} className="border-b border-border/20 hover:bg-white/50">
                      <td className="px-3 py-2 font-mono text-xs text-muted">{r.id.slice(0, 8)}…</td>
                      <td className="px-3 py-2 text-muted">{formatDate(r.createdAt)}</td>
                      <td className="px-3 py-2"><span className="ui-badge">{answeredCount} q</span></td>
                      <td className="px-3 py-2">
                        <span className="text-sm font-medium text-accent">
                          {answeredCount > 0 ? "Calculé" : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
