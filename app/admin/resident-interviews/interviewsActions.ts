"use server";

import { revalidatePath } from "next/cache";
import {
  createInterview,
  updateInterview,
  deleteInterview,
  type CreateResidentInterviewInput,
  type UpdateResidentInterviewInput,
} from "@/src/services/firestore/interviews";

export async function createInterviewAction(input: CreateResidentInterviewInput) {
  await createInterview(input);
  revalidatePath("/admin/resident-interviews");
}

export async function updateInterviewAction(id: string, input: UpdateResidentInterviewInput) {
  await updateInterview(id, input);
  revalidatePath("/admin/resident-interviews");
}

export async function deleteInterviewAction(id: string) {
  await deleteInterview(id);
  revalidatePath("/admin/resident-interviews");
}
