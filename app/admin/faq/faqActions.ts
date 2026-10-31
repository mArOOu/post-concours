"use server";

import { revalidatePath } from "next/cache";
import {
  createFaq,
  updateFaq,
  deleteFaq,
  type CreateFaqInput,
  type UpdateFaqInput,
} from "@/src/services/firestore/faq";

export async function createFaqAction(input: CreateFaqInput): Promise<ReturnType<typeof createFaq>> {
  const result = await createFaq(input);
  revalidatePath("/admin/faq");
  revalidatePath("/");
  return result;
}

export async function updateFaqAction(id: string, input: UpdateFaqInput) {
  await updateFaq(id, input);
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function deleteFaqAction(id: string) {
  await deleteFaq(id);
  revalidatePath("/admin/faq");
  revalidatePath("/");
}
