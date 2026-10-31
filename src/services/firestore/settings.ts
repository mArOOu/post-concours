import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  assertDocumentExists,
  getCollection,
  getDocument,
  listCollection,
  nowTimestamp,
} from "./shared";

export interface AttributeDefinitionRecord {
  id: string;
  name: string;
  description: string;
  scaleMin: number;
  scaleMax: number;
  category: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateAttributeDefinitionInput = Omit<
  AttributeDefinitionRecord,
  "createdAt" | "updatedAt"
> & { active?: boolean | undefined };

export type UpdateAttributeDefinitionInput = Partial<
  Omit<AttributeDefinitionRecord, "id" | "createdAt" | "updatedAt">
>;

const attributeDefinitionsCollection = getCollection<AttributeDefinitionRecord>(
  "attributeDefinitions",
);

export async function listAttributeDefinitions(): Promise<
  AttributeDefinitionRecord[]
> {
  return listCollection<AttributeDefinitionRecord>(
    attributeDefinitionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
}

export async function getAttributeDefinition(
  id: string,
): Promise<AttributeDefinitionRecord | null> {
  return getDocument<AttributeDefinitionRecord>(
    attributeDefinitionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
}

export async function createAttributeDefinition(
  input: CreateAttributeDefinitionInput,
): Promise<AttributeDefinitionRecord> {
  await assertDocumentDoesNotExist(
    attributeDefinitionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.id,
    "Attribute definition",
  );

  const timestamp = nowTimestamp();
  const record: AttributeDefinitionRecord = {
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await attributeDefinitionsCollection.doc(input.id).set(record);
  return record;
}

export async function updateAttributeDefinition(
  id: string,
  input: UpdateAttributeDefinitionInput,
): Promise<AttributeDefinitionRecord> {
  await assertDocumentExists(
    attributeDefinitionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Attribute definition",
  );

  const existing = await getAttributeDefinition(id);
  if (!existing) {
    throw new Error(`Attribute definition "${id}" disappeared during update.`);
  }

  const updated: AttributeDefinitionRecord = {
    ...existing,
    ...input,
    updatedAt: nowTimestamp(),
  };

  await attributeDefinitionsCollection.doc(id).set(updated);
  return updated;
}

export async function deleteAttributeDefinition(id: string): Promise<void> {
  await assertDocumentExists(
    attributeDefinitionsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Attribute definition",
  );

  await attributeDefinitionsCollection.doc(id).delete();
}

export interface ScoringModelRecord {
  id: string;
  name: string;
  version: string;
  description?: string;
  weights: Record<string, number>;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateScoringModelInput = Omit<
  ScoringModelRecord,
  "createdAt" | "updatedAt"
> & { active?: boolean | undefined };

export type UpdateScoringModelInput = Partial<
  Omit<ScoringModelRecord, "id" | "createdAt" | "updatedAt">
>;

const scoringModelsCollection =
  getCollection<ScoringModelRecord>("scoringModels");

export async function listScoringModels(): Promise<ScoringModelRecord[]> {
  return listCollection<ScoringModelRecord>(
    scoringModelsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
}

export async function getScoringModel(
  id: string,
): Promise<ScoringModelRecord | null> {
  return getDocument<ScoringModelRecord>(
    scoringModelsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
}

export async function createScoringModel(
  input: CreateScoringModelInput,
): Promise<ScoringModelRecord> {
  await assertDocumentDoesNotExist(
    scoringModelsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.id,
    "Scoring model",
  );

  const timestamp = nowTimestamp();
  const record: ScoringModelRecord = {
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await scoringModelsCollection.doc(input.id).set(record);
  return record;
}

export async function updateScoringModel(
  id: string,
  input: UpdateScoringModelInput,
): Promise<ScoringModelRecord> {
  await assertDocumentExists(
    scoringModelsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Scoring model",
  );

  const existing = await getScoringModel(id);
  if (!existing) {
    throw new Error(`Scoring model "${id}" disappeared during update.`);
  }

  const updated: ScoringModelRecord = {
    ...existing,
    ...input,
    updatedAt: nowTimestamp(),
  };

  await scoringModelsCollection.doc(id).set(updated);
  return updated;
}

export async function deleteScoringModel(id: string): Promise<void> {
  await assertDocumentExists(
    scoringModelsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Scoring model",
  );

  await scoringModelsCollection.doc(id).delete();
}
