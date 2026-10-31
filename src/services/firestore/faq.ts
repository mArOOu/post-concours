import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  assertDocumentExists,
  getCollection,
  getDocument,
  listCollection,
  nowTimestamp,
} from "./shared";

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateFaqInput = Omit<FaqEntry, "createdAt" | "updatedAt">;
export type UpdateFaqInput = Partial<Omit<FaqEntry, "id" | "createdAt" | "updatedAt">>;

const faqCollection =
  getCollection<FaqEntry>("faq");

export async function listFaqs(): Promise<FaqEntry[]> {
  return listCollection<FaqEntry>(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
}

export async function getFaq(id: string): Promise<FaqEntry | null> {
  return getDocument<FaqEntry>(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
}

export async function createFaq(input: CreateFaqInput): Promise<FaqEntry> {
  await assertDocumentDoesNotExist(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.id,
    "FAQ entry",
  );

  const timestamp = nowTimestamp();
  const record: FaqEntry = {
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await faqCollection.doc(input.id).set(record);
  return record;
}

export async function updateFaq(id: string, input: UpdateFaqInput): Promise<FaqEntry> {
  await assertDocumentExists(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "FAQ entry",
  );

  const existing = await getFaq(id);
  if (!existing) {
    throw new Error(`FAQ entry "${id}" disappeared during update.`);
  }

  const updated: FaqEntry = {
    ...existing,
    ...input,
    updatedAt: nowTimestamp(),
  };

  await faqCollection.doc(id).set(updated);
  return updated;
}

export async function deleteFaq(id: string): Promise<void> {
  await assertDocumentExists(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "FAQ entry",
  );

  await faqCollection.doc(id).delete();
}
