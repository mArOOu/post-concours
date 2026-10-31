import { NextResponse } from "next/server";
import { requireAdminRequest, getErrorMessage, getStatusFromError } from "@/src/services/firestore/api";
import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  assertDocumentExists,
  getCollection,
  getDocument,
  listCollection,
  nowTimestamp,
} from "@/src/services/firestore/shared";

export interface FaqEntryRecord {
  id: string;
  question: string;
  answer: string;
  specialtyId?: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const faqCollection = getCollection<FaqEntryRecord>("faq");

export async function listFaq() {
  const items = await listCollection<FaqEntryRecord>(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
  return items;
}

export async function createFaqEntry(body: Omit<FaqEntryRecord, "createdAt" | "updatedAt">) {
  await assertDocumentDoesNotExist(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    body.id,
    "FAQ entry",
  );
  const timestamp = nowTimestamp();
  const record: FaqEntryRecord = { ...body, createdAt: timestamp, updatedAt: timestamp };
  await faqCollection.doc(body.id).set(record);
  return record;
}

export async function getFaqEntry(id: string) {
  return getDocument<FaqEntryRecord>(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
}

export async function updateFaqEntry(id: string, body: Partial<Omit<FaqEntryRecord, "id" | "createdAt" | "updatedAt">>) {
  await assertDocumentExists(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "FAQ entry",
  );
  const existing = await getDocument<FaqEntryRecord>(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
  if (!existing) return null;
  const updated: FaqEntryRecord = { ...existing, ...body, updatedAt: nowTimestamp() };
  await faqCollection.doc(id).set(updated);
  return updated;
}

export async function deleteFaqEntry(id: string) {
  await assertDocumentExists(
    faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "FAQ entry",
  );
  await faqCollection.doc(id).delete();
}

// Route handlers
export async function GET() {
  try {
    const items = await listFaq();
    return NextResponse.json({ faq: items });
  } catch {
    return NextResponse.json({ error: "Failed to list FAQ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminRequest(request);
    const body = (await request.json()) as Omit<FaqEntryRecord, "createdAt" | "updatedAt">;
    const record = await createFaqEntry(body);
    return NextResponse.json({ faq: record }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getStatusFromError(error) });
  }
}
