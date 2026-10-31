import { NextResponse } from "next/server";
import {
  deleteProfile,
  getProfile,
  updateProfile,
  type UpdateSpecialtyProfileInput,
} from "@/src/services/firestore/profiles";
import {
  getErrorMessage,
  getStatusFromError,
  requireAdminRequest,
} from "@/src/services/firestore/api";

type RouteParams = {
  params: Promise<{ specialtyId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { specialtyId } = await params;
    const profile = await getProfile(specialtyId);

    if (!profile) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
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
    const { specialtyId } = await params;
    const body = (await request.json()) as UpdateSpecialtyProfileInput;
    const profile = await updateProfile(specialtyId, body);
    return NextResponse.json({ profile });
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
    const { specialtyId } = await params;
    await deleteProfile(specialtyId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
