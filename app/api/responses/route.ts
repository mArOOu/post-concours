import { NextResponse } from "next/server";
import { createResponse } from "@/src/services/firestore/responses";
import { listQuestions } from "@/src/services/firestore/questions";
import { z } from "zod";

const responseSchema = z.object({
  answers: z.record(z.string(), z.number().int()),
  privacyAccepted: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const parsed = responseSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Answers must be integer values and privacy acknowledgement is required." },
        { status: 400 },
      );
    }

    const questions = await listQuestions();
    const activeQuestions = new Map(
      questions.filter((question) => question.active).map((question) => [question.id, question]),
    );
    for (const [questionId, answer] of Object.entries(parsed.data.answers)) {
      const question = activeQuestions.get(questionId);
      if (!question || answer < question.scaleMin || answer > question.scaleMax) {
        return NextResponse.json({ error: `Invalid answer for question ${questionId}.` }, { status: 400 });
      }
    }
    if (Object.keys(parsed.data.answers).length === 0) {
      return NextResponse.json({ error: "At least one answer is required." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const response = await createResponse({
      id,
      answers: parsed.data.answers,
      completed: true,
    });

    return NextResponse.json({ responseId: response.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 },
    );
  }
}
