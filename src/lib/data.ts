import unit1Lessons from "../../data/unit-1-lessons.json";
import unit1Exercises from "../../data/unit-1-exercises.json";
import unit2Lessons from "../../data/unit-2-lessons.json";
import unit2Exercises from "../../data/unit-2-exercises.json";
import unit3Lessons from "../../data/unit-3-lessons.json";
import unit3Exercises from "../../data/unit-3-exercises.json";
import unit4Lessons from "../../data/unit-4-lessons.json";
import unit4Exercises from "../../data/unit-4-exercises.json";
import unit5Lessons from "../../data/unit-5-lessons.json";
import unit5Exercises from "../../data/unit-5-exercises.json";
import unit6Lessons from "../../data/unit-6-lessons.json";
import unit6Exercises from "../../data/unit-6-exercises.json";
import unit7Lessons from "../../data/unit-7-lessons.json";
import unit7Exercises from "../../data/unit-7-exercises.json";
import unit8Lessons from "../../data/unit-8-lessons.json";
import unit8Exercises from "../../data/unit-8-exercises.json";
import unit9Lessons from "../../data/unit-9-lessons.json";
import unit9Exercises from "../../data/unit-9-exercises.json";
import unit10Lessons from "../../data/unit-10-lessons.json";
import unit10Exercises from "../../data/unit-10-exercises.json";
import unit11Lessons from "../../data/unit-11-lessons.json";
import unit11Exercises from "../../data/unit-11-exercises.json";
import unit12Lessons from "../../data/unit-12-lessons.json";
import unit12Exercises from "../../data/unit-12-exercises.json";
import unit13Lessons from "../../data/unit-13-lessons.json";
import unit13Exercises from "../../data/unit-13-exercises.json";
import unit14Lessons from "../../data/unit-14-lessons.json";
import unit14Exercises from "../../data/unit-14-exercises.json";
import unit15Lessons from "../../data/unit-15-lessons.json";
import unit15Exercises from "../../data/unit-15-exercises.json";
import unit16Lessons from "../../data/unit-16-lessons.json";
import unit16Exercises from "../../data/unit-16-exercises.json";
import unit17Lessons from "../../data/unit-17-lessons.json";
import unit17Exercises from "../../data/unit-17-exercises.json";
import unit18Lessons from "../../data/unit-18-lessons.json";
import unit18Exercises from "../../data/unit-18-exercises.json";
import unit19Lessons from "../../data/unit-19-lessons.json";
import unit19Exercises from "../../data/unit-19-exercises.json";
import unit20Lessons from "../../data/unit-20-lessons.json";
import unit20Exercises from "../../data/unit-20-exercises.json";
import unit21Lessons from "../../data/unit-21-lessons.json";
import unit21Exercises from "../../data/unit-21-exercises.json";
import unit22Lessons from "../../data/unit-22-lessons.json";
import unit22Exercises from "../../data/unit-22-exercises.json";
import unit23Lessons from "../../data/unit-23-lessons.json";
import unit23Exercises from "../../data/unit-23-exercises.json";
import unit24Lessons from "../../data/unit-24-lessons.json";
import unit24Exercises from "../../data/unit-24-exercises.json";
import unit25Lessons from "../../data/unit-25-lessons.json";
import unit25Exercises from "../../data/unit-25-exercises.json";
import unit26Lessons from "../../data/unit-26-lessons.json";
import unit26Exercises from "../../data/unit-26-exercises.json";
import unit27Lessons from "../../data/unit-27-lessons.json";
import unit27Exercises from "../../data/unit-27-exercises.json";
import unit28Lessons from "../../data/unit-28-lessons.json";
import unit28Exercises from "../../data/unit-28-exercises.json";
import unit29Lessons from "../../data/unit-29-lessons.json";
import unit29Exercises from "../../data/unit-29-exercises.json";
import unit30Lessons from "../../data/unit-30-lessons.json";
import unit30Exercises from "../../data/unit-30-exercises.json";
import type { LessonsData, ExercisesData, Exercise, ExerciseQuestion } from "./types";

const UNIT_DATA: Record<number, { lessons: LessonsData; exercises: ExercisesData }> = {
  1: { lessons: unit1Lessons as LessonsData, exercises: unit1Exercises as ExercisesData },
  2: { lessons: unit2Lessons as LessonsData, exercises: unit2Exercises as ExercisesData },
  3: { lessons: unit3Lessons as LessonsData, exercises: unit3Exercises as ExercisesData },
  4: { lessons: unit4Lessons as LessonsData, exercises: unit4Exercises as ExercisesData },
  5: { lessons: unit5Lessons as LessonsData, exercises: unit5Exercises as ExercisesData },
  6: { lessons: unit6Lessons as LessonsData, exercises: unit6Exercises as ExercisesData },
  7: { lessons: unit7Lessons as LessonsData, exercises: unit7Exercises as ExercisesData },
  8: { lessons: unit8Lessons as LessonsData, exercises: unit8Exercises as ExercisesData },
  9: { lessons: unit9Lessons as LessonsData, exercises: unit9Exercises as ExercisesData },
  10: { lessons: unit10Lessons as LessonsData, exercises: unit10Exercises as ExercisesData },
  11: { lessons: unit11Lessons as LessonsData, exercises: unit11Exercises as ExercisesData },
  12: { lessons: unit12Lessons as LessonsData, exercises: unit12Exercises as ExercisesData },
  13: { lessons: unit13Lessons as LessonsData, exercises: unit13Exercises as ExercisesData },
  14: { lessons: unit14Lessons as LessonsData, exercises: unit14Exercises as ExercisesData },
  15: { lessons: unit15Lessons as LessonsData, exercises: unit15Exercises as ExercisesData },
  16: { lessons: unit16Lessons as LessonsData, exercises: unit16Exercises as ExercisesData },
  17: { lessons: unit17Lessons as LessonsData, exercises: unit17Exercises as ExercisesData },
  18: { lessons: unit18Lessons as LessonsData, exercises: unit18Exercises as ExercisesData },
  19: { lessons: unit19Lessons as LessonsData, exercises: unit19Exercises as ExercisesData },
  20: { lessons: unit20Lessons as LessonsData, exercises: unit20Exercises as ExercisesData },
  21: { lessons: unit21Lessons as LessonsData, exercises: unit21Exercises as ExercisesData },
  22: { lessons: unit22Lessons as LessonsData, exercises: unit22Exercises as ExercisesData },
  23: { lessons: unit23Lessons as LessonsData, exercises: unit23Exercises as ExercisesData },
  24: { lessons: unit24Lessons as LessonsData, exercises: unit24Exercises as ExercisesData },
  25: { lessons: unit25Lessons as LessonsData, exercises: unit25Exercises as ExercisesData },
  26: { lessons: unit26Lessons as LessonsData, exercises: unit26Exercises as ExercisesData },
  27: { lessons: unit27Lessons as LessonsData, exercises: unit27Exercises as ExercisesData },
  28: { lessons: unit28Lessons as LessonsData, exercises: unit28Exercises as ExercisesData },
  29: { lessons: unit29Lessons as LessonsData, exercises: unit29Exercises as ExercisesData },
  30: { lessons: unit30Lessons as LessonsData, exercises: unit30Exercises as ExercisesData },
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
