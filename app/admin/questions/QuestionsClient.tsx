"use client";

import { useState } from "react";
import QuestionForm from "./QuestionForm";
import { deleteQuestionAction } from "./questionsActions";

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

interface QuestionsClientProps {
  questions: QuestionRecord[];
}

export function QuestionsClient({ questions: initialQuestions }: QuestionsClientProps) {
  const questions = initialQuestions;
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionRecord | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<QuestionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => { setEditingQuestion(undefined); setFormOpen(true); };
  const openEdit = (q: QuestionRecord) => { setEditingQuestion(q); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingQuestion(undefined); };
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setError(null);
      await deleteQuestionAction(deleteConfirm.id);
      setDeleteConfirm(null);
      window.location.reload();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Suppression impossible.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Questions</h1>
          <p className="text-sm text-muted mt-1">
            Gérer le questionnaire du candidat. Créez, modifiez et supprimez les questions.
          </p>
        </div>
        <button onClick={openCreate} className="ui-button ui-button-primary">
          + Nouvelle question
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {questions.length === 0 && (
        <div className="ui-empty-state">
          <p className="text-sm text-muted">Aucune question. Créez la première.</p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border/40 bg-white/30">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-foreground/60">Question</th>
                <th className="px-3 py-3 text-left font-medium text-foreground/60">Catégorie</th>
                <th className="px-3 py-3 text-left font-medium text-foreground/60">Attributs</th>
                <th className="px-3 py-3 text-center font-medium text-foreground/60">Échelle</th>
                <th className="px-3 py-3 text-center font-medium text-foreground/60">Poids</th>
                <th className="px-3 py-3 text-center font-medium text-foreground/60">Inversé</th>
                <th className="px-3 py-3 text-center font-medium text-foreground/60">Statut</th>
                <th className="px-4 py-3 text-right font-medium text-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-b border-border/20 hover:bg-white/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{q.questionText}</p>
                    <p className="text-[11px] text-muted font-mono mt-0.5">{q.id}</p>
                  </td>
                  <td className="px-3 py-3 text-muted">{q.category}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(q.traitIds ?? []).map((t) => (
                        <span key={t} className="ui-chip">{t}</span>
                      ))}
                      {((q.traitIds ?? []).length === 0) && (
                        <span className="text-xs text-muted">aucun</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-sm">{q.scaleMin} — {q.scaleMax}</td>
                  <td className="px-3 py-3 text-center"><span className="ui-badge">{q.weight}</span></td>
                  <td className="px-3 py-3 text-center">
                    {q.reverseScored ? (
                      <span className="text-xs text-amber-600 font-medium">Oui</span>
                    ) : (
                      <span className="text-xs text-muted">Non</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {q.active === false ? (
                      <span className="inline-flex h-6 items-center rounded-full bg-red-50 px-2 text-xs text-red-500">Inactif</span>
                    ) : (
                      <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-xs text-emerald-600">Actif</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(q)} className="ui-button ui-button-secondary ui-button-sm">Éditer</button>
                      <button onClick={() => setDeleteConfirm(q)} className="ui-button ui-button-ghost ui-button-sm text-red-500 hover:bg-red-50">Supprimer</button>
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
          <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingQuestion ? `Modifier : ${(editingQuestion.questionText ?? "").slice(0, 50)}...` : "Nouvelle question"}
              </h2>
              <button onClick={closeForm} className="rounded-lg p-1 text-muted hover:bg-muted/50">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <QuestionForm question={editingQuestion} onSave={() => { closeForm(); window.location.reload(); }} onCancel={closeForm} />
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-2xl border border-border/40 bg-white shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold">Supprimer cette question ?</h2>
            <p className="mt-2 text-sm text-muted">
              « {(deleteConfirm.questionText ?? "").slice(0, 60)}... » sera définitivement supprimée.
            </p>
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
