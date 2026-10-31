import { NextResponse } from "next/server";
import {
  deleteInterview,
  getInterview,
  updateInterview,
  type UpdateResidentInterviewInput,
} from "@/src/services/firestore/interviews";
import {
  getErrorMessage,
  getStatusFromError,
  requireAdminRequest,
} from "@/src/services/firestore/api";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    await requireAdminRequest(_request);
    const { id } = await params;
    const interview = await getInterview(id);

    if (!interview) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requireAdminRequest(request);
    const { id } = await params;
    const body = (await request.json()) as UpdateResidentInterviewInput;
    const interview = await updateInterview(id, body);
    return NextResponse.json({ interview });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    await requireAdminRequest(_request);
    const { id } = await params;
    await deleteInterview(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
