export type QuestionRecord = {
  id: string;
  text: string;
  questionText?: string;
  category?: string;
  traitIds?: string[];
  scaleMin?: number;
  scaleMax?: number;
  weight?: number;
  reverseScored?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateQuestionInput = Omit<QuestionRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateQuestionInput = Partial<Omit<QuestionRecord, "id" | "createdAt" | "updatedAt">>;
