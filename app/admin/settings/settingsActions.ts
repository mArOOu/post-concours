"use server";

import { revalidatePath } from "next/cache";
import {
  createAttributeDefinition,
  updateAttributeDefinition,
  deleteAttributeDefinition,
  type CreateAttributeDefinitionInput,
  type UpdateAttributeDefinitionInput,
} from "@/src/services/firestore/settings";
import {
  createScoringModel,
  updateScoringModel,
  deleteScoringModel,
  type CreateScoringModelInput,
  type UpdateScoringModelInput,
} from "@/src/services/firestore/settings";

export async function createAttributeDefinitionAction(data: CreateAttributeDefinitionInput) {
  await createAttributeDefinition(data);
  revalidatePath("/admin/settings");
}

export async function updateAttributeDefinitionAction(id: string, data: UpdateAttributeDefinitionInput) {
  await updateAttributeDefinition(id, data);
  revalidatePath("/admin/settings");
}

export async function deleteAttributeDefinitionAction(id: string) {
  await deleteAttributeDefinition(id);
  revalidatePath("/admin/settings");
}

export async function createScoringModelAction(data: CreateScoringModelInput) {
  await createScoringModel(data);
  revalidatePath("/admin/settings");
}

export async function updateScoringModelAction(id: string, data: UpdateScoringModelInput) {
  await updateScoringModel(id, data);
  revalidatePath("/admin/settings");
}

export async function deleteScoringModelAction(id: string) {
  await deleteScoringModel(id);
  revalidatePath("/admin/settings");
}
