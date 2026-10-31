import { NextResponse } from "next/server";
import {
  createAttributeDefinition,
  listAttributeDefinitions,
  type CreateAttributeDefinitionInput,
} from "@/src/services/firestore/settings";
import {
  getErrorMessage,
  getStatusFromError,
  requireAdminRequest,
} from "@/src/services/firestore/api";

export async function GET(request: Request) {
  try {
    await requireAdminRequest(request);
    const attributeDefinitions = await listAttributeDefinitions();
    return NextResponse.json({ attributeDefinitions });
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
    const body = (await request.json()) as CreateAttributeDefinitionInput;
    const attributeDefinition = await createAttributeDefinition(body);
    return NextResponse.json({ attributeDefinition }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getStatusFromError(error) },
    );
  }
}
