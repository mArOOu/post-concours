import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  assertDocumentExists,
  getCollection,
  getDocument,
  listCollection,
  nowTimestamp,
} from "./shared";

export interface SpecialtyRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  overview: string;
  typicalDay: string;
  residency: string;
  pros: string[];
  cons: string[];
  commonDiseases: string[];
  faqIds?: string[];
  residentInterviewIds?: string[];
  active: boolean;
  shortSummary?: string;
  keywords?: string[];
  imageUrl?: string;
  icon?: string;
  createdBy?: string;
  updatedBy?: string;
  source?: string;
  lastReviewedAt?: Timestamp;
  reviewStatus?: "draft" | "reviewed" | "published";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  attributeScores?: SpecialtyAttributeScores;
}

export type SpecialtyAttributeScores = Record<string, number>;

export type CreateSpecialtyInput = Omit<
  SpecialtyRecord,
  "createdAt" | "updatedAt"
> & { active?: boolean | undefined };

export type UpdateSpecialtyInput = Partial<
  Omit<SpecialtyRecord, "id" | "createdAt" | "updatedAt">
> & { active?: boolean | undefined };

const specialtiesCollection = getCollection<SpecialtyRecord>("specialties");

export async function listSpecialties(): Promise<SpecialtyRecord[]> {
  return listCollection<SpecialtyRecord>(
    specialtiesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
}

export async function getSpecialty(
  id: string,
): Promise<SpecialtyRecord | null> {
  return getDocument<SpecialtyRecord>(
    specialtiesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
}

export async function createSpecialty(
  input: CreateSpecialtyInput,
): Promise<SpecialtyRecord> {
  await assertDocumentDoesNotExist(
    specialtiesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.id,
    "Specialty",
  );

  const timestamp = nowTimestamp();
  const record: SpecialtyRecord = {
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await specialtiesCollection.doc(input.id).set(record);
  return record;
}

export async function updateSpecialty(
  id: string,
  input: UpdateSpecialtyInput,
): Promise<SpecialtyRecord> {
  await assertDocumentExists(
    specialtiesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Specialty",
  );

  const existing = await getSpecialty(id);
  if (!existing) {
    throw new Error(`Specialty "${id}" disappeared during update.`);
  }

  const updated: SpecialtyRecord = {
    ...existing,
    ...input,
    updatedAt: nowTimestamp(),
  };

  await specialtiesCollection.doc(id).set(updated);
  return updated;
}

export async function deleteSpecialty(id: string): Promise<void> {
  await assertDocumentExists(
    specialtiesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Specialty",
  );

  await specialtiesCollection.doc(id).delete();
}

export async function updateSpecialtyAttributeScores(
  id: string,
  scores: SpecialtyAttributeScores,
): Promise<SpecialtyRecord> {
  await assertDocumentExists(
    specialtiesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Specialty",
  );

  const existing = await getSpecialty(id);
  if (!existing) {
    throw new Error(`Specialty "${id}" disappeared during update.`);
  }

  const updated: SpecialtyRecord = {
    ...existing,
    attributeScores: {
      ...(existing.attributeScores ?? {}),
      ...scores,
    },
    updatedAt: nowTimestamp(),
  };

  await specialtiesCollection.doc(id).set(updated);
  return updated;
}
