import { NextResponse } from "next/server";
import { listQuestions } from "@/src/services/firestore/questions";

export async function GET() {
  try {
    const questions = (await listQuestions()).filter((question) => question.active);
    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 },
    );
  }
}
