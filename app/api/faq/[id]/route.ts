import { NextResponse } from "next/server";
import {
  assertDocumentExists,
  getCollection,
  getDocument,
  nowTimestamp,
} from "@/src/services/firestore/shared";
import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import { requireAdminRequest, getErrorMessage, getStatusFromError } from "@/src/services/firestore/api";

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const doc = await getDocument<FaqEntryRecord>(
      faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
      id,
    );
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ faq: doc });
  } catch {
    return NextResponse.json({ error: "Failed to get FAQ" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminRequest(request);
    const { id } = await params;
    const body = (await request.json()) as Partial<Omit<FaqEntryRecord, "id" | "createdAt" | "updatedAt">>;
    await assertDocumentExists(
      faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
      id,
      "FAQ entry",
    );
    const existing = await getDocument<FaqEntryRecord>(
      faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
      id,
    );
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated: FaqEntryRecord = {
      ...existing,
      ...body,
      updatedAt: nowTimestamp(),
    };
    await faqCollection.doc(id).set(updated);
    return NextResponse.json({ faq: updated });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getStatusFromError(error) });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminRequest(_request);
    const { id } = await params;
    await assertDocumentExists(
      faqCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
      id,
      "FAQ entry",
    );
    await faqCollection.doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getStatusFromError(error) });
  }
}
