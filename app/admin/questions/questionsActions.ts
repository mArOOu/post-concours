"use server";

import { revalidatePath } from "next/cache";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestion,
  type CreateQuestionInput,
  type UpdateQuestionInput,
  type QuestionRecord,
} from "@/src/services/firestore/questions";

export async function getQuestionAction(id: string): Promise<QuestionRecord | null> {
  return getQuestion(id);
}

export async function createQuestionAction(data: CreateQuestionInput): Promise<QuestionRecord> {
  const result = await createQuestion(data);
  revalidatePath("/admin/questions");
  return result;
}

export async function updateQuestionAction(id: string, data: UpdateQuestionInput): Promise<QuestionRecord> {
  const result = await updateQuestion(id, data);
  revalidatePath("/admin/questions");
  return result;
}

export async function deleteQuestionAction(id: string): Promise<void> {
  await deleteQuestion(id);
  revalidatePath("/admin/questions");
}
