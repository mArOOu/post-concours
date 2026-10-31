import { NextResponse } from "next/server";
import {
  createSpecialty,
  listSpecialties,
  type CreateSpecialtyInput,
} from "@/src/services/firestore/specialties";
import {
  getErrorMessage,
  getStatusFromError,
  requireAdminRequest,
} from "@/src/services/firestore/api";

export async function GET(request: Request) {
  try {
    await requireAdminRequest(request);
    const specialties = await listSpecialties();
    return NextResponse.json({ specialties });
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
    const body = (await request.json()) as CreateSpecialtyInput;
    const specialty = await createSpecialty(body);
    return NextResponse.json({ specialty }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
