export type ResidentInterviewRecord = {
  id: string;
  residentInfo: ResidentInfo;
  objectiveAnswers: Record<string, unknown>;
  subjectiveAnswers: Record<string, unknown>;
  normalizedScores: Record<string, number>;
  approvalStatus: InterviewApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ResidentInfo = {
  specialtyId: string;
  residentName?: string;
  hospital?: string;
  wilaya?: string;
  year?: string;
  gender?: string;
};

export type InterviewApprovalStatus = "draft" | "pending-review" | "approved" | "rejected";

export type CreateResidentInterviewInput = Omit<ResidentInterviewRecord, "createdAt" | "updatedAt"> & { residentInfo?: ResidentInfo; approvalStatus?: InterviewApprovalStatus };
export type UpdateResidentInterviewInput = Partial<Omit<ResidentInterviewRecord, "id" | "createdAt" | "updatedAt">>;
