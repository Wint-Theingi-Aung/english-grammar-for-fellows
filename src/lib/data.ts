import unit1Lessons from "../../data/unit-1-lessons.json";
import unit1Exercises from "../../data/unit-1-exercises.json";
import unit2Lessons from "../../data/unit-2-lessons.json";
import unit2Exercises from "../../data/unit-2-exercises.json";
import type { LessonsData, ExercisesData, Exercise, ExerciseQuestion } from "./types";

const UNIT_DATA: Record<number, { lessons: LessonsData; exercises: ExercisesData }> = {
  1: { lessons: unit1Lessons as LessonsData, exercises: unit1Exercises as ExercisesData },
  2: { lessons: unit2Lessons as LessonsData, exercises: unit2Exercises as ExercisesData },
};

export function getLessonsData(unit: number = 1): LessonsData {
  const data = UNIT_DATA[unit];
  if (!data) throw new Error(`Unit ${unit} not found`);
  return data.lessons;
}

export function getExercisesData(unit: number = 1): ExercisesData {
  const data = UNIT_DATA[unit];
  if (!data) throw new Error(`Unit ${unit} not found`);
  return data.exercises;
}

export function getAllQuestions(unit: number = 1): ExerciseQuestion[] {
  const data = getExercisesData(unit);
  return data.exercises.flatMap((ex: Exercise) => ex.questions);
}

export function getQuestionById(unit: number, id: number): ExerciseQuestion | undefined {
  return getAllQuestions(unit).find((q: ExerciseQuestion) => q.id === id);
}

export function getExercisesForType(unit: number, type: Exercise["type"]): Exercise[] {
  return getExercisesData(unit).exercises.filter((ex: Exercise) => ex.type === type);
}

export function getTotalPoints(unit: number = 1): number {
  return getAllQuestions(unit).reduce((sum: number, q: ExerciseQuestion) => sum + q.points, 0);
}

export function getTotalQuestionCount(unit: number = 1): number {
  const data = UNIT_DATA[unit];
  if (!data) return 0;
  return getAllQuestions(unit).length;
}

export function getAvailableUnits(): number[] {
  return Object.keys(UNIT_DATA).map(Number);
}

export function isUnitAvailable(unit: number): boolean {
  return unit in UNIT_DATA;
}
