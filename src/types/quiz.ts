
export const QuizType = {
  STYLE_PREFERENCE: 'style_preference',
  PERSONALITY: 'personality',
  LIFESTYLE: 'lifestyle',
  ROOM_SPECIFIC: 'room_specific',
  BUDGET_PLANNING: 'budget_planning',
} as const;

export type QuizType = typeof QuizType[keyof typeof QuizType];

export const QuizStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  ARCHIVED: 'archived',
} as const;

export type QuizStatus = typeof QuizStatus[keyof typeof QuizStatus];


export type QuestionType = 'multiple_choice' | 'rating' | 'text' | 'boolean' | 'image_and_text';

export interface OptionWeight {
  [key: string]: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  weight?: OptionWeight;
}

export interface QuestionDto {
  id: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  required?: boolean;
  category?: string;
}


export interface Quiz {
  id: string;
  title: string;
  description?: string;
  type: QuizType;
  status: QuizStatus;
  questions: QuestionDto[];
  createdBy?: string;
  isTemplate?: boolean;
  templateId?: string;
  createdAt?: string;
  updatedAt?: string;
}
