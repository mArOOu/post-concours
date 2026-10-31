import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { getFirebaseEnv } from "@/lib/firebase/env";

export async function GET() {
  try {
    const env = getFirebaseEnv();

    await getFirebaseAdminDb().collection("_health").limit(1).get();

    return NextResponse.json(
      {
        success: true,
        project: env.FIREBASE_PROJECT_ID,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to connect to Firebase.";

    return NextResponse.json(
      {
        success: false,
        error: "Firebase connectivity check failed.",
        message,
      },
      { status: 503 },
    );
  }
}
