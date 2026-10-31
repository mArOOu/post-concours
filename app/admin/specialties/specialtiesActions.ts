"use server";

import { revalidatePath } from "next/cache";
import {
  createSpecialty as _createSpecialty,
  updateSpecialty as _updateSpecialty,
  deleteSpecialty as _deleteSpecialty,
  getSpecialty as _getSpecialty,
  type CreateSpecialtyInput,
  type UpdateSpecialtyInput,
} from "@/src/services/firestore/specialties";

export async function getSpecialtyAction(id: string) {
  return _getSpecialty(id);
}

export async function createSpecialtyAction(data: CreateSpecialtyInput) {
  const result = await _createSpecialty(data);
  revalidatePath("/admin/specialties");
  return result;
}

export async function updateSpecialtyAction(id: string, data: UpdateSpecialtyInput) {
  const result = await _updateSpecialty(id, data);
  revalidatePath("/admin/specialties");
  return result;
}

export async function deleteSpecialtyAction(id: string) {
  await _deleteSpecialty(id);
  revalidatePath("/admin/specialties");
}
