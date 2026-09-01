export interface LessonDetail {
  tense?: string;
  form?: string;
  example?: string;
  burmese?: string;
  subject?: string;
  concept?: string;
  explanation?: string;
  rule?: string;
  case?: string;
  type?: string;
  description?: string;
  answer_type?: string;
  wh_word?: string;
  usage?: string;
  structure?: string;
  note?: string;
  examples?: string[];
  question?: string;
  positive?: string;
  negative?: string;
  auxiliary_positive?: string;
  auxiliary_negative?: string;
}

export interface ConjugationEntry {
  subject: string;
  present?: string;
  past?: string;
  future?: string;
  form?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  details?: LessonDetail[];
  conjugation?: ConjugationEntry[];
  forms?: Record<string, string>;
  answer_types?: Record<string, string>;
}

export interface LessonsData {
  unit: number;
  title: string;
  lessons: Lesson[];
}

export interface ExerciseQuestion {
  id: number;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  points: number;
}

export interface Exercise {
  id: string;
  type: "fill_in_blank" | "multiple_choice" | "translation" | "sentence_transformation" | "true_false";
  instructions: string;
  questions: ExerciseQuestion[];
}

export interface ExercisesData {
  unit: number;
  exercises: Exercise[];
}

export interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

export interface UnitProgress {
  unit: number;
  startedAt: string;
  answers: UserAnswer[];
  completedAt?: string;
  score?: number;
  totalPoints?: number;
}
