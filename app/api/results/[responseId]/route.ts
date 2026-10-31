import { NextResponse } from "next/server";
import { getResponse } from "@/src/services/firestore/responses";
import { computeScoresWithQuestions } from "@/src/services/firestore/scoring";
import { listQuestions } from "@/src/services/firestore/questions";
import { getScoringModel } from "@/src/services/firestore/settings";
import { listSpecialties } from "@/src/services/firestore/specialties";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ responseId: string }> },
) {
  try {
    const { responseId } = await params;

    const response = await getResponse(responseId);
    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    const [questions, scoringModel, specialties] = await Promise.all([
      listQuestions(),
      getScoringModel("baseline-v1"),
      listSpecialties(),
    ]);

    if (!scoringModel) {
      return NextResponse.json({ error: "Scoring model not found" }, { status: 500 });
    }

    const results = computeScoresWithQuestions(
      response.answers,
      scoringModel,
      specialties.map((s) => ({ id: s.id, name: s.name, slug: s.slug })),
      questions,
    );

    return NextResponse.json({
      responseId,
      answers: response.answers,
      results,
      completed: response.completed,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to compute results" },
      { status: 500 },
    );
  }
}
