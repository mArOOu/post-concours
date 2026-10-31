import { NextResponse } from "next/server";
import { verifyAdminIdToken } from "@/lib/auth/admin";

type CheckRequest = {
  idToken?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CheckRequest;

  if (!body.idToken) {
    return NextResponse.json(
      { allowed: false, reason: "Missing idToken" },
      { status: 400 },
    );
  }

  try {
    const adminPrincipal = await verifyAdminIdToken(body.idToken);

    if (!adminPrincipal) {
      return NextResponse.json(
        { allowed: false, reason: "Admin access denied" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      allowed: true,
      uid: adminPrincipal.uid,
      email: adminPrincipal.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid token";

    return NextResponse.json(
      { allowed: false, reason: message },
      { status: 401 },
    );
  }
}
