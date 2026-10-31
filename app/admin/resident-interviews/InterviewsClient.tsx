"use client";

import { useState } from "react";
import { deleteInterviewAction } from "./interviewsActions";

type ResidentInterviewRecord = {
  id: string;
  residentInfo: {
    specialtyId: string;
    residentName?: string;
    hospital?: string;
    wilaya?: string;
    year?: string;
    gender?: string;
  };
  objectiveAnswers: Record<string, unknown>;
  subjectiveAnswers: Record<string, unknown>;
  normalizedScores: Record<string, number>;
  approvalStatus: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function InterviewsClient({ interviews }: { interviews: ResidentInterviewRecord[] }) {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending-review" | "approved" | "rejected" | "draft">("all");
  const [search, setSearch] = useState("");
  const [approving, setApproving] = useState<Set<string>>(new Set());

  const filtered = interviews.filter((iv) => {
    if (statusFilter !== "all" && iv.approvalStatus !== statusFilter) return false;
    if (search) {
      const r = iv.residentInfo;
      const haystack = [r.residentName, r.hospital, r.wilaya, r.specialtyId, iv.id].join(" ").toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const handleApprove = async (id: string) => {
    setApproving((prev) => new Set(prev).add(id));
    try {
      await fetch(`/api/interviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: "approved", approvedBy: "admin" }),
      });
      window.location.reload();
    } finally {
      setApproving((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Rejeter cet entretien ?")) return;
    await fetch(`/api/interviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus: "rejected" }),
    });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Entretiens avec des résidents</h1>
          <p className="text-sm text-muted mt-1">Gérez les entretiens collectés auprès des résidents en exercice. Validez ou rejetez chaque entrée.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(["all", "draft", "pending-review", "approved", "rejected"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-lg px-3 py-1 text-sm capitalize ${statusFilter === s ? "bg-accent/10 text-accent" : "bg-white/50 text-muted hover:bg-white/80"}`}>
            {s === "all" ? "Tous" : s === "pending-review" ? "En attente" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="ui-input h-8 w-48 pl-8 text-sm" />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="ui-empty-state"><p className="text-sm text-muted">Aucun entretien.</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((iv) => {
            const r = iv.residentInfo;
            const statusColor = iv.approvalStatus === "approved" ? "text-emerald-600" : iv.approvalStatus === "rejected" ? "text-red-500" : iv.approvalStatus === "pending-review" ? "text-amber-600" : "text-muted";
            const statusBg = iv.approvalStatus === "approved" ? "bg-emerald-50" : iv.approvalStatus === "rejected" ? "bg-red-50" : iv.approvalStatus === "pending-review" ? "bg-amber-50" : "bg-muted";
            return (
              <div key={iv.id} className="ui-card rounded-xl border border-border/40 bg-white/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium text-foreground`}>{r.residentName || "Résident sans nom"}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${statusBg} ${statusColor}`}>{iv.approvalStatus}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      {r.specialtyId && <div className="text-muted"><span className="text-foreground/50">Spécialité:</span> {r.specialtyId.slice(0,8)}...</div>}
                      {r.hospital && <div><span className="text-foreground/50">Hôpital:</span> {r.hospital}</div>}
                      {r.wilaya && <div><span className="text-foreground/50">Wilaya:</span> {r.wilaya}</div>}
                      {r.year && <div><span className="text-foreground/50">Année:</span> {r.year}</div>}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-foreground/40">
                      <span>Créé le {iv.createdAt ? iv.createdAt.toLocaleDateString("fr-FR") : "—"}</span>
                      <span className="ml-auto">ID: {iv.id.slice(0,8)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {iv.approvalStatus === "pending-review" && (
                      <>
                        <button onClick={() => handleApprove(iv.id)} disabled={approving.has(iv.id)} className="ui-btn primary text-xs">{approving.has(iv.id) ? "..." : "Valider"}</button>
                        <button onClick={() => handleReject(iv.id)} className="ui-btn ghost text-xs text-red-500">Rejeter</button>
                      </>
                    )}
                    {iv.approvalStatus !== "approved" && (
                      <button onClick={() => deleteInterviewAction(iv.id)} className="ui-btn ghost text-xs text-red-500">Supprimer</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
