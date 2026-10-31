export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateFaqInput = Omit<FaqEntry, "id" | "createdAt" | "updatedAt">;
export type UpdateFaqInput = Partial<Omit<FaqEntry, "id" | "createdAt" | "updatedAt">>;
