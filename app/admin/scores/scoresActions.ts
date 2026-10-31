"use server";

import { revalidatePath } from "next/cache";
import { updateSpecialtyAttributeScores } from "@/src/services/firestore/specialties";

export async function updateProfileScoreAction(specialtyId: string, attrId: string, value: number) {
  await updateSpecialtyAttributeScores(specialtyId, { [attrId]: value });
  revalidatePath("/admin/scores");
  revalidatePath("/admin/specialty-profiles");
}
