import { NextResponse } from "next/server";
import {
  deleteScoringModel,
  getScoringModel,
  updateScoringModel,
  type UpdateScoringModelInput,
} from "@/src/services/firestore/settings";
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
    const scoringModel = await getScoringModel(id);

    if (!scoringModel) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ scoringModel });
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
    const body = (await request.json()) as UpdateScoringModelInput;
    const scoringModel = await updateScoringModel(id, body);
    return NextResponse.json({ scoringModel });
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
    await deleteScoringModel(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
