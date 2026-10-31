export type AttributeDefinitionRecord = {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  trait?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ScoringModelRecord = {
  id: string;
  name: string;
  weights: Record<string, number>;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateAttributeDefinitionInput = Omit<AttributeDefinitionRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateAttributeDefinitionInput = Partial<Omit<AttributeDefinitionRecord, "id" | "createdAt" | "updatedAt">>;
export type CreateScoringModelInput = Omit<ScoringModelRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateScoringModelInput = Partial<Omit<ScoringModelRecord, "id" | "createdAt" | "updatedAt">>;
