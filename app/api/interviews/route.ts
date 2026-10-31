import { NextResponse } from "next/server";
import {
  createInterview,
  listInterviews,
  type CreateResidentInterviewInput,
} from "@/src/services/firestore/interviews";
import {
  getErrorMessage,
  getStatusFromError,
  requireAdminRequest,
} from "@/src/services/firestore/api";

export async function GET(request: Request) {
  try {
    await requireAdminRequest(request);
    const interviews = await listInterviews();
    return NextResponse.json({ interviews });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminRequest(request);
    const body = (await request.json()) as CreateResidentInterviewInput;
    const interview = await createInterview(body);
    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
