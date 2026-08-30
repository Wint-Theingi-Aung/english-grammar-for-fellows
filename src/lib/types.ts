export interface LessonDetail {
  tense: string;
  form: string;
  example: string;
  burmese: string;
}

export interface ConjugationEntry {
  subject: string;
  present: string;
  past: string;
  future: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  details?: LessonDetail[];
  conjugation?: ConjugationEntry[];
  forms?: {
    affirmative: string;
    negative: string;
    interrogative: string;
    negative_interrogative: string;
  };
  answer_types?: {
    short_answer: string;
    long_answer: string;
  };
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
