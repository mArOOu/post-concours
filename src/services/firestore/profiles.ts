import { type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  assertDocumentExists,
  getCollection,
  getDocument,
  listCollection,
  nowTimestamp,
} from "./shared";

export interface SpecialtyProfileRecord {
  id: string;
  specialtyId: string;
  algorithmVersion: string;
  scores: Record<string, number>;
  confidence: number;
  numberOfResidents?: number;
  updatedAt: FirebaseFirestore.Timestamp;
}

export type CreateSpecialtyProfileInput = SpecialtyProfileRecord;

export type UpdateSpecialtyProfileInput = Partial<
  Omit<SpecialtyProfileRecord, "specialtyId" | "updatedAt">
>;

const profilesCollection =
  getCollection<SpecialtyProfileRecord>("specialtyProfiles");

export async function listProfiles(): Promise<SpecialtyProfileRecord[]> {
  return listCollection<SpecialtyProfileRecord>(
    profilesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
}

export async function getProfile(
  specialtyId: string,
): Promise<SpecialtyProfileRecord | null> {
  return getDocument<SpecialtyProfileRecord>(
    profilesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    specialtyId,
  );
}

export async function createProfile(
  input: CreateSpecialtyProfileInput,
): Promise<SpecialtyProfileRecord> {
  await assertDocumentDoesNotExist(
    profilesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.specialtyId,
    "Specialty profile",
  );

  const record: SpecialtyProfileRecord = {
    ...input,
    id: input.specialtyId,
    updatedAt: nowTimestamp(),
  };

  await profilesCollection.doc(input.specialtyId).set(record);
  return record;
}

export async function updateProfile(
  specialtyId: string,
  input: UpdateSpecialtyProfileInput,
): Promise<SpecialtyProfileRecord> {
  await assertDocumentExists(
    profilesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    specialtyId,
    "Specialty profile",
  );

  const existing = await getProfile(specialtyId);
  if (!existing) {
    throw new Error(
      `Specialty profile "${specialtyId}" disappeared during update.`,
    );
  }

  const updated: SpecialtyProfileRecord = {
    ...existing,
    ...input,
    id: specialtyId,
    updatedAt: nowTimestamp(),
  };

  await profilesCollection.doc(specialtyId).set(updated);
  return updated;
}

export async function deleteProfile(specialtyId: string): Promise<void> {
  await assertDocumentExists(
    profilesCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    specialtyId,
    "Specialty profile",
  );

  await profilesCollection.doc(specialtyId).delete();
}
