import { NextResponse } from "next/server";
import {
  createProfile,
  listProfiles,
  type CreateSpecialtyProfileInput,
} from "@/src/services/firestore/profiles";
import {
  getErrorMessage,
  getStatusFromError,
  requireAdminRequest,
} from "@/src/services/firestore/api";

export async function GET(request: Request) {
  try {
    await requireAdminRequest(request);
    const profiles = await listProfiles();
    return NextResponse.json({ profiles });
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
    const body = (await request.json()) as CreateSpecialtyProfileInput;
    const profile = await createProfile(body);
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
