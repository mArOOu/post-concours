import {
  type CollectionReference,
  type DocumentData,
  Timestamp,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export type FirestoreServiceErrorCode =
  | "already-exists"
  | "not-found"
  | "invalid-argument"
  | "internal";

export class FirestoreServiceError extends Error {
  readonly code: FirestoreServiceErrorCode;

  constructor(code: FirestoreServiceErrorCode, message: string) {
    super(message);
    this.name = "FirestoreServiceError";
    this.code = code;
  }
}

export function nowTimestamp() {
  return Timestamp.now();
}

export function getCollection<T extends DocumentData>(
  collectionName: string,
): CollectionReference<T> {
  return getFirebaseAdminDb().collection(
    collectionName,
  ) as CollectionReference<T>;
}

export function mapSnapshot<T extends { id: string }>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return {
    id: snapshot.id,
    ...serializeData(snapshot.data() as Omit<T, "id">),
  } as T;
}

function serializeData(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = serializeValue(value);
  }
  return result;
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Array) {
    return value.map(serializeValue);
  }
  if (value instanceof Object && value !== null) {
    const obj = value as Record<string, unknown>;
    const serialized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      serialized[key] = serializeValue(val);
    }
    return serialized;
  }
  return value;
}

export async function listCollection<T extends { id: string }>(
  collectionRef: CollectionReference<DocumentData>,
): Promise<T[]> {
  const snapshot = await collectionRef.get();
  return snapshot.docs.map((doc) => mapSnapshot<T>(doc));
}

export async function getDocument<T extends { id: string }>(
  collectionRef: CollectionReference<DocumentData>,
  id: string,
): Promise<T | null> {
  const snapshot = await collectionRef.doc(id).get();
  if (!snapshot.exists) {
    return null;
  }

  return mapSnapshot<T>(snapshot as QueryDocumentSnapshot<DocumentData>);
}

export async function assertDocumentDoesNotExist(
  collectionRef: CollectionReference<DocumentData>,
  id: string,
  entityName: string,
): Promise<void> {
  const snapshot = await collectionRef.doc(id).get();

  if (snapshot.exists) {
    throw new FirestoreServiceError(
      "already-exists",
      `${entityName} "${id}" already exists.`,
    );
  }
}

export async function assertDocumentExists(
  collectionRef: CollectionReference<DocumentData>,
  id: string,
  entityName: string,
): Promise<void> {
  const snapshot = await collectionRef.doc(id).get();

  if (!snapshot.exists) {
    throw new FirestoreServiceError(
      "not-found",
      `${entityName} "${id}" was not found.`,
    );
  }
}
