export interface SpecialtyRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  active: boolean;
  shortSummary?: string;
  overview?: string;
  typicalDay?: string;
  residency?: string;
  pros?: string[];
  cons?: string[];
  commonDiseases?: string[];
  keywords?: string[];
  attributes?: Record<string, unknown>;
  attributeScores?: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SpecialtyCategory = "medical" | "surgical" | "diagnostic" | "other";

export type CreateSpecialtyInput = Omit<SpecialtyRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateSpecialtyInput = Partial<Omit<SpecialtyRecord, "id" | "createdAt" | "updatedAt">>;
