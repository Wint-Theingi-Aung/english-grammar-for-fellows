import lessonsData from "../../data/unit-1-lessons.json";
import exercisesData from "../../data/unit-1-exercises.json";
import type { LessonsData, ExercisesData, Exercise, ExerciseQuestion } from "./types";

export function getLessonsData(): LessonsData {
  return lessonsData as LessonsData;
}

export function getExercisesData(): ExercisesData {
  return exercisesData as ExercisesData;
}

export function getAllQuestions(): ExerciseQuestion[] {
  const data = getExercisesData();
  return data.exercises.flatMap((ex: Exercise) => ex.questions);
}

export function getQuestionById(id: number): ExerciseQuestion | undefined {
  return getAllQuestions().find((q: ExerciseQuestion) => q.id === id);
}

export function getExercisesForType(type: Exercise["type"]): Exercise[] {
  return getExercisesData().exercises.filter((ex: Exercise) => ex.type === type);
}

export function getTotalPoints(): number {
  return getAllQuestions().reduce((sum: number, q: ExerciseQuestion) => sum + q.points, 0);
}

export function getTotalQuestionCount(): number {
  return getAllQuestions().length;
}
