import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import {
  assertDocumentDoesNotExist,
  assertDocumentExists,
  getCollection,
  getDocument,
  listCollection,
  nowTimestamp,
} from "./shared";

export type InterviewApprovalStatus =
  | "draft"
  | "pending-review"
  | "approved"
  | "rejected";

export interface ResidentInfo {
  specialtyId: string;
  residentName?: string;
  hospital?: string;
  wilaya?: string;
  year?: string;
  gender?: string;
}

export interface ResidentInterviewRecord {
  id: string;
  residentInfo: ResidentInfo;
  objectiveAnswers: Record<string, unknown>;
  subjectiveAnswers: Record<string, unknown>;
  normalizedScores: Record<string, number>;
  approvalStatus: InterviewApprovalStatus;
  approvedBy?: string;
  approvedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateResidentInterviewInput = Omit<
  ResidentInterviewRecord,
  "createdAt" | "updatedAt"
> & { residentInfo?: ResidentInfo; approvalStatus?: InterviewApprovalStatus };

export type UpdateResidentInterviewInput = Partial<
  Omit<ResidentInterviewRecord, "id" | "createdAt" | "updatedAt">
>;

const interviewsCollection =
  getCollection<ResidentInterviewRecord>("residentInterviews");

export async function listInterviews(): Promise<ResidentInterviewRecord[]> {
  return listCollection<ResidentInterviewRecord>(
    interviewsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
  );
}

export async function getInterview(
  id: string,
): Promise<ResidentInterviewRecord | null> {
  return getDocument<ResidentInterviewRecord>(
    interviewsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
  );
}

export async function createInterview(
  input: CreateResidentInterviewInput,
): Promise<ResidentInterviewRecord> {
  await assertDocumentDoesNotExist(
    interviewsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    input.id,
    "Resident interview",
  );

  const timestamp = nowTimestamp();
  const record: ResidentInterviewRecord = {
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await interviewsCollection.doc(input.id).set(record);
  return record;
}

export async function updateInterview(
  id: string,
  input: UpdateResidentInterviewInput,
): Promise<ResidentInterviewRecord> {
  await assertDocumentExists(
    interviewsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Resident interview",
  );

  const existing = await getInterview(id);
  if (!existing) {
    throw new Error(`Resident interview "${id}" disappeared during update.`);
  }

  const updated: ResidentInterviewRecord = {
    ...existing,
    ...input,
    updatedAt: nowTimestamp(),
  };

  await interviewsCollection.doc(id).set(updated);
  return updated;
}

export async function deleteInterview(id: string): Promise<void> {
  await assertDocumentExists(
    interviewsCollection as unknown as import("firebase-admin/firestore").CollectionReference<DocumentData>,
    id,
    "Resident interview",
  );

  await interviewsCollection.doc(id).delete();
}
