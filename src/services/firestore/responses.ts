import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  getCollection,
  listCollection,
  nowTimestamp,
} from "./shared";

export interface ResponseRecord {
  id: string;
  answers: Record<string, number>; // questionId → score (1-10)
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateResponseInput = Omit<ResponseRecord, "createdAt" | "updatedAt">;

const responsesCollection = getCollection<ResponseRecord>("responses");

export async function listResponses(): Promise<ResponseRecord[]> {
  return listCollection<ResponseRecord>(
    responsesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
}

export async function getResponse(id: string): Promise<ResponseRecord | null> {
  const snapshot = await responsesCollection.doc(id).get();
  if (!snapshot.exists) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as ResponseRecord;
}

export async function createResponse(input: CreateResponseInput): Promise<ResponseRecord> {
  await assertDocumentDoesNotExist(
    responsesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.id,
    "Response",
  );

  const timestamp = nowTimestamp();
  const record: ResponseRecord = {
    ...input,
    id: input.id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await responsesCollection.doc(input.id).set(record);
  return record;
}

export async function updateResponse(id: string, updates: Partial<ResponseRecord>): Promise<ResponseRecord> {
  const existing = await getResponse(id);
  if (!existing) {
    throw new Error(`Response "${id}" not found.`);
  }

  const updated: ResponseRecord = {
    ...existing,
    ...updates,
    updatedAt: nowTimestamp(),
  };

  await responsesCollection.doc(id).set(updated);
  return updated;
}
