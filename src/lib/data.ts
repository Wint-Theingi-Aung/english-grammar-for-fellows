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
import unit31Lessons from "../../data/unit-31-lessons.json";
import unit31Exercises from "../../data/unit-31-exercises.json";
import unit32Lessons from "../../data/unit-32-lessons.json";
import unit32Exercises from "../../data/unit-32-exercises.json";
import unit33Lessons from "../../data/unit-33-lessons.json";
import unit33Exercises from "../../data/unit-33-exercises.json";
import unit34Lessons from "../../data/unit-34-lessons.json";
import unit34Exercises from "../../data/unit-34-exercises.json";
import unit35Lessons from "../../data/unit-35-lessons.json";
import unit35Exercises from "../../data/unit-35-exercises.json";
import unit36Lessons from "../../data/unit-36-lessons.json";
import unit36Exercises from "../../data/unit-36-exercises.json";
import unit37Lessons from "../../data/unit-37-lessons.json";
import unit37Exercises from "../../data/unit-37-exercises.json";
import unit38Lessons from "../../data/unit-38-lessons.json";
import unit38Exercises from "../../data/unit-38-exercises.json";
import unit39Lessons from "../../data/unit-39-lessons.json";
import unit39Exercises from "../../data/unit-39-exercises.json";
import unit40Lessons from "../../data/unit-40-lessons.json";
import unit40Exercises from "../../data/unit-40-exercises.json";
import unit41Lessons from "../../data/unit-41-lessons.json";
import unit41Exercises from "../../data/unit-41-exercises.json";
import unit42Lessons from "../../data/unit-42-lessons.json";
import unit42Exercises from "../../data/unit-42-exercises.json";
import unit43Lessons from "../../data/unit-43-lessons.json";
import unit43Exercises from "../../data/unit-43-exercises.json";
import unit44Lessons from "../../data/unit-44-lessons.json";
import unit44Exercises from "../../data/unit-44-exercises.json";
import unit45Lessons from "../../data/unit-45-lessons.json";
import unit45Exercises from "../../data/unit-45-exercises.json";
import unit46Lessons from "../../data/unit-46-lessons.json";
import unit46Exercises from "../../data/unit-46-exercises.json";
import unit47Lessons from "../../data/unit-47-lessons.json";
import unit47Exercises from "../../data/unit-47-exercises.json";
import unit48Lessons from "../../data/unit-48-lessons.json";
import unit48Exercises from "../../data/unit-48-exercises.json";
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
  31: { lessons: unit31Lessons as LessonsData, exercises: unit31Exercises as ExercisesData },
  32: { lessons: unit32Lessons as LessonsData, exercises: unit32Exercises as ExercisesData },
  33: { lessons: unit33Lessons as LessonsData, exercises: unit33Exercises as ExercisesData },
  34: { lessons: unit34Lessons as LessonsData, exercises: unit34Exercises as ExercisesData },
  35: { lessons: unit35Lessons as LessonsData, exercises: unit35Exercises as ExercisesData },
  36: { lessons: unit36Lessons as LessonsData, exercises: unit36Exercises as ExercisesData },
  37: { lessons: unit37Lessons as LessonsData, exercises: unit37Exercises as ExercisesData },
  38: { lessons: unit38Lessons as LessonsData, exercises: unit38Exercises as ExercisesData },
  39: { lessons: unit39Lessons as LessonsData, exercises: unit39Exercises as ExercisesData },
  40: { lessons: unit40Lessons as LessonsData, exercises: unit40Exercises as ExercisesData },
  41: { lessons: unit41Lessons as LessonsData, exercises: unit41Exercises as ExercisesData },
  42: { lessons: unit42Lessons as LessonsData, exercises: unit42Exercises as ExercisesData },
  43: { lessons: unit43Lessons as LessonsData, exercises: unit43Exercises as ExercisesData },
  44: { lessons: unit44Lessons as LessonsData, exercises: unit44Exercises as ExercisesData },
  45: { lessons: unit45Lessons as LessonsData, exercises: unit45Exercises as ExercisesData },
  46: { lessons: unit46Lessons as LessonsData, exercises: unit46Exercises as ExercisesData },
  47: { lessons: unit47Lessons as LessonsData, exercises: unit47Exercises as ExercisesData },
  48: { lessons: unit48Lessons as LessonsData, exercises: unit48Exercises as ExercisesData },
};

export const UNIT_TITLES: Record<number, string> = {
  1: "Simple Present, Past & Future",
  2: "Verb to Be (am, is, are, was, were)",
  3: "Verb to Have (has, have, had)",
  4: "Question Tags",
  5: "Wh Questions",
  6: "Will / Would",
  7: "Should / Ought to",
  8: "Can / Could",
  9: "May / Might",
  10: "Must",
  11: "Have to",
  12: "Need / Need to",
  13: "Seem / Seem to",
  14: "Want / Want to / Want (Obj) to",
  15: "Would like / Would like to / Would like (Obj) to",
  16: "Going to",
  17: "There is / There are",
  18: "There was / There were",
  19: "Although / In spite of",
  20: "Too … to",
  21: "So … that",
  22: "Too … to ↔ So … that",
  23: "Such … that",
  24: "So … that ↔ Such … that",
  25: "Double Comparatives",
  26: "Either … or",
  27: "Neither … nor",
  28: "Both … and",
  29: "Not only … but also",
  30: "As soon as",
  31: "No sooner … than",
  32: "If … not ↔ Unless",
  33: "Nouns: Countable and Uncountable",
  34: "A / an, the, no article",
  35: "Relative Pronouns",
  36: "Adverbs of Frequency",
  37: "Prepositions of Time",
  38: "Prepositions of Place",
  39: "Some, Any, A/An",
  40: "Much, Many, A Lot (of)",
  41: "Present Perfect with ever, never, just, already and yet",
  42: "Three Degrees of Adjectives",
  43: "Active and Passive Voice",
  44: "Reported Speech",
  45: "Phrasal Verbs",
  46: "Idioms",
  47: "Proverbs",
  48: "Translation (From Myanmar to English)",
};

export const UNIT_DESCRIPTIONS: Record<number, string> = {
  1: "Master the three fundamental English tenses with interactive lessons and exercises.",
  2: "Learn the verb 'to be' in all its forms across present and past tenses.",
  3: "Learn the verb 'have' as a main verb and auxiliary in perfect tenses.",
  4: "Master the rules for forming question tags in all tenses.",
  5: "Learn to ask and answer wh-questions with who, what, when, where, why, which, and how.",
  6: "Master the use of will and would for future, conditional, and polite expressions.",
  7: "Learn to use should and ought to for advice, expectations, and obligations.",
  8: "Explore can and could for ability, permission, and polite requests.",
  9: "Learn to use may and might for possibility, permission, and wishes.",
  10: "Master the use of must for strong obligations and mustn't for prohibition.",
  11: "Learn to use have to for responsibilities and don't have to for what's not required.",
  12: "Learn when to use 'need' and 'need to' to express necessity.",
  13: "Use 'seem' and 'seem to' to describe appearances and how things look.",
  14: "Express desires with 'want', 'want to', and 'want (obj) to'.",
  15: "Make polite requests and wishes with 'would like' and its variations.",
  16: "Use 'going to' for future plans and predictions based on evidence.",
  17: "Learn to use 'there is' and 'there are' to talk about things that exist.",
  18: "Learn to use 'there was' and 'there were' to talk about things in the past.",
  19: "Use 'although' and 'in spite of' to show contrast between ideas.",
  20: "Use 'too ... to' to express undesirable excess and negative meaning.",
  21: "Use 'so + adjective/adverb + that + result' to show cause and effect.",
  22: "Transform sentences between 'too … to' and 'so … that' structures.",
  23: "Use 'such + a/an + adjective + noun + that + result' to give reasons.",
  24: "Transform sentences between 'so … that' and 'such … that' structures.",
  25: "Use 'the + comparative, the + comparative' to express cause and effect.",
  26: "Use 'either … or' to connect two alternatives.",
  27: "Use 'neither … nor' to connect negative alternatives.",
  28: "Use 'both … and' to connect two items together.",
  29: "Use 'not only … but also' to connect and emphasize two phrases.",
  30: "Use 'as soon as' to join two sentences showing immediate sequence.",
  31: "Combine two sentences using 'No sooner … than' with correct tense patterns.",
  32: "Convert between 'If … not' and 'Unless' and learn when not to use will/would.",
  33: "Learn the difference between countable and uncountable nouns.",
  34: "Master when to use a/an, the, or no article before nouns.",
  35: "Use who, which, that, whose, where, and when to join sentences and give more information.",
  36: "Learn to use always, usually, often, sometimes, hardly ever, and never to describe frequency.",
  37: "Master when to use in, on, and at with times, days, months, and years.",
  38: "Learn to use on, under, above, near, behind, in front of, next to, and in to describe positions.",
  39: "Learn when to use some, any, a, and an with countable and uncountable nouns.",
  40: "Learn when to use much, many, a lot of, and a lot to talk about quantities.",
  41: "Learn to use ever, never, just, already, and yet with the present perfect tense.",
  42: "Learn the Positive, Comparative, and Superlative degrees of adjectives.",
  43: "Learn to convert Active Voice to Passive Voice across eight different tenses.",
  44: "Learn how to convert direct speech into reported speech with correct tense, pronoun, and time word changes.",
  45: "Learn 25 common English phrasal verbs with their meanings, examples, and Burmese explanations.",
  46: "Learn 21 common English idioms with their meanings, examples, and Burmese explanations.",
  47: "Learn 55 common English proverbs and their meanings with practice exercises.",
  48: "Practice translating Myanmar sentences into English with detailed examples and exercises.",
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
