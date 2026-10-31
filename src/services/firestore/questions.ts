import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  assertDocumentExists,
  getCollection,
  getDocument,
  listCollection,
  nowTimestamp,
} from "./shared";

export interface QuestionRecord {
  id: string;
  text?: string;
  questionText: string;
  category: string;
  traitIds: string[];
  weight: number;
  reverseScored: boolean;
  scaleMin: number;
  scaleMax: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateQuestionInput = Omit<
  QuestionRecord,
  "createdAt" | "updatedAt"
> & { active?: boolean | undefined };

export type UpdateQuestionInput = Partial<
  Omit<QuestionRecord, "id" | "createdAt" | "updatedAt">
>;

const questionsCollection = getCollection<QuestionRecord>("questions");

export async function listQuestions(): Promise<QuestionRecord[]> {
  const questions = await listCollection<QuestionRecord>(
    questionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
  return questions.map(normalizeQuestion);
}

export async function getQuestion(id: string): Promise<QuestionRecord | null> {
  const question = await getDocument<QuestionRecord>(
    questionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
  return question ? normalizeQuestion(question) : null;
}

function normalizeQuestion(question: QuestionRecord): QuestionRecord {
  return {
    ...question,
    questionText: question.questionText || question.text || "",
    category: question.category || "General",
    traitIds: Array.isArray(question.traitIds) ? question.traitIds : [],
    weight: typeof question.weight === "number" && question.weight > 0 ? question.weight : 1,
    reverseScored: question.reverseScored === true,
    scaleMin: typeof question.scaleMin === "number" ? question.scaleMin : 1,
    scaleMax: typeof question.scaleMax === "number" ? question.scaleMax : 5,
    active: question.active !== false,
  };
}

export async function createQuestion(
  input: CreateQuestionInput,
): Promise<QuestionRecord> {
  await assertDocumentDoesNotExist(
    questionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.id,
    "Question",
  );

  const timestamp = nowTimestamp();
  const record: QuestionRecord = {
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await questionsCollection.doc(input.id).set(record);
  return record;
}

export async function updateQuestion(
  id: string,
  input: UpdateQuestionInput,
): Promise<QuestionRecord> {
  await assertDocumentExists(
    questionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Question",
  );

  const existing = await getQuestion(id);
  if (!existing) {
    throw new Error(`Question "${id}" disappeared during update.`);
  }

  const updated: QuestionRecord = {
    ...existing,
    ...input,
    updatedAt: nowTimestamp(),
  };

  await questionsCollection.doc(id).set(updated);
  return updated;
}

export async function deleteQuestion(id: string): Promise<void> {
  await assertDocumentExists(
    questionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Question",
  );

  await questionsCollection.doc(id).delete();
}
