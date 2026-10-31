"use server";

import {
  createSpecialty as _createSpecialty,
  updateSpecialty as _updateSpecialty,
  getSpecialty as _getSpecialty,
  type CreateSpecialtyInput,
  type UpdateSpecialtyInput,
} from "@/src/services/firestore/specialties";

export async function getSpecialtyAction(id: string) {
  return _getSpecialty(id);
}

export async function createSpecialtyAction(data: CreateSpecialtyInput) {
  return _createSpecialty(data);
}

export async function updateSpecialtyAction(id: string, data: UpdateSpecialtyInput) {
  return _updateSpecialty(id, data);
}
