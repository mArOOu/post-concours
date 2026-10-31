import { NextResponse } from "next/server";
import {
  createScoringModel,
  listScoringModels,
  type CreateScoringModelInput,
} from "@/src/services/firestore/settings";
import {
  getErrorMessage,
  getStatusFromError,
  requireAdminRequest,
} from "@/src/services/firestore/api";

export async function GET(request: Request) {
  try {
    await requireAdminRequest(request);
    const scoringModels = await listScoringModels();
    return NextResponse.json({ scoringModels });
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
    const body = (await request.json()) as CreateScoringModelInput;
    const scoringModel = await createScoringModel(body);
    return NextResponse.json({ scoringModel }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
