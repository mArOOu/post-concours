import { NextResponse } from "next/server";
import {
  deleteSpecialty,
  getSpecialty,
  updateSpecialty,
  type UpdateSpecialtyInput,
} from "@/src/services/firestore/specialties";
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
    const { id } = await params;
    const specialty = await getSpecialty(id);

    if (!specialty) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ specialty });
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
    const body = (await request.json()) as UpdateSpecialtyInput;
    const specialty = await updateSpecialty(id, body);
    return NextResponse.json({ specialty });
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
    await deleteSpecialty(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
