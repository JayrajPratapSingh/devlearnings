/**
 * Seeds reference content: topic categories, topics, interview questions and
 * DSA problems with their test cases.
 *
 * Idempotent — every write is an upsert keyed on a slug, so running it twice is
 * safe and re-running after editing seed data updates the existing rows. It
 * never touches user data (progress, notes, submissions).
 */
import { PrismaClient, type Prisma } from '@prisma/client';
import { dsaProblems } from './seed-data/dsa';
import { JS_MODULE_1, type CourseLesson } from './seed-data/course-js-module1';
import { JS_MODULE_1_PART2 } from './seed-data/course-js-module1-part2';
import { JS_MODULE_1_PART3 } from './seed-data/course-js-module1-part3';
import { JS_MODULE_2_PART1 } from './seed-data/course-js-module2-part1';
import { JS_MODULE_2_PART2 } from './seed-data/course-js-module2-part2';
import { JS_MODULE_3_PART1 } from './seed-data/course-js-module3-part1';
import { JS_MODULE_3_PART2 } from './seed-data/course-js-module3-part2';
import { JS_MODULE_4_PART1 } from './seed-data/course-js-module4-part1';
import { JS_MODULE_4_PART2 } from './seed-data/course-js-module4-part2';
import { JS_MODULE_5_PART1 } from './seed-data/course-js-module5-part1';
import { JS_MODULE_5_PART2 } from './seed-data/course-js-module5-part2';
import { JS_MODULE_1_PART4 } from './seed-data/course-js-module1-part4';
import { JS_CLASSES, JS_WEB_APIS } from './seed-data/course-js-gaps';
import { CSS_MODULE_1 } from './seed-data/course-css-module1';
import { CSS_MODULE_1B } from './seed-data/course-css-module1b';
import { CSS_MODULE_1C } from './seed-data/course-css-module1c';
import { CSS_MODULE_2 } from './seed-data/course-css-module2';
import { CSS_MODULE_2B } from './seed-data/course-css-module2b';
import { CSS_MODULE_2C } from './seed-data/course-css-module2c';
import { CSS_MODULE_3 } from './seed-data/course-css-module3';
import { CSS_MODULE_3B } from './seed-data/course-css-module3b';
import { CSS_MODULE_4 } from './seed-data/course-css-module4';
import { CSS_MODULE_4B } from './seed-data/course-css-module4b';
import { CSS_MODULE_5 } from './seed-data/course-css-module5';
import { CSS_MODULE_5B } from './seed-data/course-css-module5b';
import { CSS_MODULE_6 } from './seed-data/course-css-module6';
import { CSS_MODULE_6B } from './seed-data/course-css-module6b';
import { CSS_MODULE_6C } from './seed-data/course-css-module6c';
import { TS_MODULE_1 } from './seed-data/course-ts-module1';
import { TS_MODULE_1_PART2 } from './seed-data/course-ts-module1-part2';
import { TS_MODULE_1_PART3 } from './seed-data/course-ts-module1-part3';
import { TS_MODULE_1_PART4 } from './seed-data/course-ts-module1-part4';
import { TS_MODULE_2 } from './seed-data/course-ts-module2';
import { TS_MODULE_2_PART2 } from './seed-data/course-ts-module2-part2';
import { TS_MODULE_2_PART3 } from './seed-data/course-ts-module2-part3';
import { TS_MODULE_3 } from './seed-data/course-ts-module3';
import { TS_MODULE_3_PART2 } from './seed-data/course-ts-module3-part2';
import { TS_MODULE_3_PART3 } from './seed-data/course-ts-module3-part3';
import { TS_MODULE_3_PART4 } from './seed-data/course-ts-module3-part4';
import { TS_MODULE_4 } from './seed-data/course-ts-module4';
import { TS_MODULE_4_PART2 } from './seed-data/course-ts-module4-part2';
import { TS_MODULE_5 } from './seed-data/course-ts-module5';
import { TS_MODULE_5_PART2 } from './seed-data/course-ts-module5-part2';
import { TS_MODULE_5_PART3 } from './seed-data/course-ts-module5-part3';
import { TS_MODULE_6 } from './seed-data/course-ts-module6';
import { TS_MODULE_6_PART2 } from './seed-data/course-ts-module6-part2';
import { REACT_MODULE_1 } from './seed-data/course-react-module1';
import { REACT_MODULE_1_PART2 } from './seed-data/course-react-module1-part2';
import { REACT_MODULE_1_PART3 } from './seed-data/course-react-module1-part3';
import { REACT_MODULE_2 } from './seed-data/course-react-module2';
import { REACT_MODULE_2_PART2 } from './seed-data/course-react-module2-part2';
import { REACT_MODULE_2_PART3 } from './seed-data/course-react-module2-part3';
import { REACT_MODULE_3 } from './seed-data/course-react-module3';
import { REACT_MODULE_3_PART2 } from './seed-data/course-react-module3-part2';
import { REACT_MODULE_3_PART3 } from './seed-data/course-react-module3-part3';
import { REACT_MODULE_4 } from './seed-data/course-react-module4';
import { REACT_MODULE_4_PART2 } from './seed-data/course-react-module4-part2';
import { REACT_MODULE_4_PART3 } from './seed-data/course-react-module4-part3';
import { REACT_MODULE_4_PART4 } from './seed-data/course-react-module4-part4';
import { REACT_MODULE_4_PART5 } from './seed-data/course-react-module4-part5';
import { REACT_MODULE_4_PART6 } from './seed-data/course-react-module4-part6';
import { REACT_MODULE_5 } from './seed-data/course-react-module5';
import { REACT_MODULE_5_PART2 } from './seed-data/course-react-module5-part2';
import { REACT_MODULE_5_PART3 } from './seed-data/course-react-module5-part3';
import { REACT_MODULE_5_PART4 } from './seed-data/course-react-module5-part4';
import { REACT_MODULE_5_PART5 } from './seed-data/course-react-module5-part5';
import { REACT_MODULE_5_PART6 } from './seed-data/course-react-module5-part6';
import { REACT_MODULE_5_PART7 } from './seed-data/course-react-module5-part7';
import { REACT_MODULE_5_PART8 } from './seed-data/course-react-module5-part8';
import { REACT_MODULE_6 } from './seed-data/course-react-module6';
import { REACT_MODULE_6_PART2 } from './seed-data/course-react-module6-part2';
import { REACT_MODULE_6_PART3 } from './seed-data/course-react-module6-part3';
import { REACT_MODULE_6_PART4 } from './seed-data/course-react-module6-part4';
import { REACT_MODULE_6_PART5 } from './seed-data/course-react-module6-part5';
import { REACT_MODULE_6_PART6 } from './seed-data/course-react-module6-part6';
import { REACT_MODULE_6_PART7 } from './seed-data/course-react-module6-part7';
import { REACT_MODULE_6_PART8 } from './seed-data/course-react-module6-part8';
import { REACT_MODULE_6_PART9 } from './seed-data/course-react-module6-part9';
import { REACT_MODULE_6_PART10 } from './seed-data/course-react-module6-part10';
import { REACT_MODULE_6_PART11 } from './seed-data/course-react-module6-part11';
import { REACT_MODULE_6_PART12 } from './seed-data/course-react-module6-part12';
import { REACT_MODULE_6_PART13 } from './seed-data/course-react-module6-part13';
import { REACT_MODULE_6_PART14 } from './seed-data/course-react-module6-part14';
import { DSA_MODULE_1 } from './seed-data/course-dsa-module1';
import { DSA_MODULE_1_PART2 } from './seed-data/course-dsa-module1-part2';
import { DSA_MODULE_1_PART3 } from './seed-data/course-dsa-module1-part3';
import { DSA_MODULE_1_PART4 } from './seed-data/course-dsa-module1-part4';
import { DSA_MODULE_1_PART5 } from './seed-data/course-dsa-module1-part5';
import { DSA_MODULE_1_PART6 } from './seed-data/course-dsa-module1-part6';
import { DSA_MODULE_2 } from './seed-data/course-dsa-module2';
import { DSA_MODULE_2_PART2 } from './seed-data/course-dsa-module2-part2';
import { DSA_MODULE_2_PART3 } from './seed-data/course-dsa-module2-part3';
import { DSA_MODULE_2_PART4 } from './seed-data/course-dsa-module2-part4';
import { DSA_MODULE_3 } from './seed-data/course-dsa-module3';
import { DSA_MODULE_3_PART2 } from './seed-data/course-dsa-module3-part2';
import { DSA_MODULE_3_PART3 } from './seed-data/course-dsa-module3-part3';
import { DSA_MODULE_3_PART4 } from './seed-data/course-dsa-module3-part4';
import { DSA_MODULE_4 } from './seed-data/course-dsa-module4';
import { DSA_MODULE_4_PART2 } from './seed-data/course-dsa-module4-part2';
import { DSA_MODULE_4_PART3 } from './seed-data/course-dsa-module4-part3';
import { DSA_MODULE_4_PART4 } from './seed-data/course-dsa-module4-part4';
import { DSA_MODULE_4_PART5 } from './seed-data/course-dsa-module4-part5';
import { DSA_MODULE_5 } from './seed-data/course-dsa-module5';
import { DSA_MODULE_5_PART2 } from './seed-data/course-dsa-module5-part2';
import { DSA_MODULE_5_PART3 } from './seed-data/course-dsa-module5-part3';
import { DSA_MODULE_5_PART4 } from './seed-data/course-dsa-module5-part4';
import { DSA_MODULE_6 } from './seed-data/course-dsa-module6';
import { DSA_MODULE_6_PART2 } from './seed-data/course-dsa-module6-part2';
import { DSA_MODULE_6_PART3 } from './seed-data/course-dsa-module6-part3';
import { DSA_MODULE_6_PART4 } from './seed-data/course-dsa-module6-part4';
import { DSA_MODULE_7 } from './seed-data/course-dsa-module7';
import { DSA_MODULE_7_PART2 } from './seed-data/course-dsa-module7-part2';
import { DSA_MODULE_7_PART3 } from './seed-data/course-dsa-module7-part3';
import { DSA_MODULE_7_PART4 } from './seed-data/course-dsa-module7-part4';
import { DSA_MODULE_7_PART5 } from './seed-data/course-dsa-module7-part5';
import { DSA_MODULE_8 } from './seed-data/course-dsa-module8';
import { DSA_MODULE_8_PART2 } from './seed-data/course-dsa-module8-part2';
import { DSA_MODULE_8_PART3 } from './seed-data/course-dsa-module8-part3';
import { DSA_MODULE_8_PART4 } from './seed-data/course-dsa-module8-part4';
import { DSA_MODULE_9 } from './seed-data/course-dsa-module9';
import { DSA_MODULE_9_PART2 } from './seed-data/course-dsa-module9-part2';
import { DSA_MODULE_9_PART3 } from './seed-data/course-dsa-module9-part3';
import { DSA_MODULE_9_PART4 } from './seed-data/course-dsa-module9-part4';
import { DSA_MODULE_9_PART5 } from './seed-data/course-dsa-module9-part5';
import { DSA_MODULE_9_PART6 } from './seed-data/course-dsa-module9-part6';
import { NODE_MODULE_1 } from './seed-data/course-node-module1';
import { NODE_MODULE_1_PART2 } from './seed-data/course-node-module1-part2';
import { NODE_MODULE_1_PART3 } from './seed-data/course-node-module1-part3';
import { NODE_MODULE_1_PART4 } from './seed-data/course-node-module1-part4';
import { NODE_MODULE_1_PART5 } from './seed-data/course-node-module1-part5';
import { NODE_MODULE_1_PART6 } from './seed-data/course-node-module1-part6';
import { NODE_MODULE_2 } from './seed-data/course-node-module2';
import { NODE_MODULE_2_PART2 } from './seed-data/course-node-module2-part2';
import { NODE_MODULE_2_PART3 } from './seed-data/course-node-module2-part3';
import { NODE_MODULE_2_PART4 } from './seed-data/course-node-module2-part4';
import { NODE_MODULE_2_PART5 } from './seed-data/course-node-module2-part5';
import { NODE_MODULE_2_PART6 } from './seed-data/course-node-module2-part6';
import { NODE_MODULE_2_PART7 } from './seed-data/course-node-module2-part7';
import { NODE_MODULE_2_PART8 } from './seed-data/course-node-module2-part8';
import { NODE_MODULE_3 } from './seed-data/course-node-module3';
import { NODE_MODULE_3_PART2 } from './seed-data/course-node-module3-part2';
import { NODE_MODULE_3_PART3 } from './seed-data/course-node-module3-part3';
import { NODE_MODULE_3_PART4 } from './seed-data/course-node-module3-part4';
import { NODE_MODULE_4 } from './seed-data/course-node-module4';
import { NODE_MODULE_4_PART2 } from './seed-data/course-node-module4-part2';
import { NODE_MODULE_4_PART3 } from './seed-data/course-node-module4-part3';
import { NODE_MODULE_4_PART4 } from './seed-data/course-node-module4-part4';
import { NODE_MODULE_4_PART5 } from './seed-data/course-node-module4-part5';
import { NODE_MODULE_4_PART6 } from './seed-data/course-node-module4-part6';
import { NODE_MODULE_4_PART7 } from './seed-data/course-node-module4-part7';
import { NODE_MODULE_4_PART8 } from './seed-data/course-node-module4-part8';
import { NODE_MODULE_4_PART9 } from './seed-data/course-node-module4-part9';
import { NODE_MODULE_5 } from './seed-data/course-node-module5';
import { NODE_MODULE_5_PART2 } from './seed-data/course-node-module5-part2';
import { NODE_MODULE_5_PART3 } from './seed-data/course-node-module5-part3';
import { NODE_MODULE_5_PART4 } from './seed-data/course-node-module5-part4';
import { NODE_MODULE_5_PART5 } from './seed-data/course-node-module5-part5';
import { NODE_MODULE_6 } from './seed-data/course-node-module6';
import { NODE_MODULE_6_PART2 } from './seed-data/course-node-module6-part2';
import { NODE_MODULE_6_PART3 } from './seed-data/course-node-module6-part3';
import { NODE_MODULE_6_PART4 } from './seed-data/course-node-module6-part4';
import { NODE_MODULE_6_PART5 } from './seed-data/course-node-module6-part5';
import { NODE_MODULE_6_PART6 } from './seed-data/course-node-module6-part6';
import { NODE_MODULE_6_PART7 } from './seed-data/course-node-module6-part7';
import { NODE_MODULE_6_PART8 } from './seed-data/course-node-module6-part8';
import { NODE_MODULE_7 } from './seed-data/course-node-module7';
import { NODE_MODULE_7_PART2 } from './seed-data/course-node-module7-part2';
import { NODE_MODULE_7_PART3 } from './seed-data/course-node-module7-part3';
import { NODE_MODULE_7_PART4 } from './seed-data/course-node-module7-part4';
import { NODE_MODULE_7_PART5 } from './seed-data/course-node-module7-part5';
import { NODE_MODULE_7_PART6 } from './seed-data/course-node-module7-part6';
import { NODE_MODULE_7_PART7 } from './seed-data/course-node-module7-part7';
import { NODE_MODULE_7_PART8 } from './seed-data/course-node-module7-part8';
import { NODE_MODULE_7_PART9 } from './seed-data/course-node-module7-part9';
import { NODE_MODULE_7_PART10 } from './seed-data/course-node-module7-part10';
import { NODE_MODULE_7_PART11 } from './seed-data/course-node-module7-part11';
import { NODE_MODULE_7_PART12 } from './seed-data/course-node-module7-part12';
import { NODE_MODULE_7_PART13 } from './seed-data/course-node-module7-part13';
import { NODE_MODULE_7_PART14 } from './seed-data/course-node-module7-part14';
import { NODE_MODULE_7_PART15 } from './seed-data/course-node-module7-part15';
import { NODE_MODULE_7_PART16 } from './seed-data/course-node-module7-part16';
import { NODE_MODULE_7_PART17 } from './seed-data/course-node-module7-part17';
import { NODE_MODULE_7_PART18 } from './seed-data/course-node-module7-part18';
import { NODE_MODULE_7_PART19 } from './seed-data/course-node-module7-part19';
import { NODE_MODULE_7_PART20 } from './seed-data/course-node-module7-part20';
import { NODE_MODULE_7_PART21 } from './seed-data/course-node-module7-part21';
import { interviewQuestions } from './seed-data/questions';
import { basicQuestions } from './seed-data/questions-basics';
import { extraQuestions } from './seed-data/questions-extra';
import { typescriptQuestions } from './seed-data/questions-typescript';
import { genaiQuestions } from './seed-data/questions-genai';
import { threejsQuestions } from './seed-data/questions-threejs';
import { javascriptCategory } from './seed-data/topics-javascript';
import { typescriptCategory } from './seed-data/topics-typescript';
import { mongodbCategory } from './seed-data/topics-mongodb';
import { realtimeCategory } from './seed-data/topics-realtime';
import { postgresCategory } from './seed-data/topics-postgres';
import { reactCategory } from './seed-data/topics-react';
import { djangoCategory, fastapiCategory, nodeCategory, pythonCategory } from './seed-data/topics-backend';
import {
  apiCategory,
  authCategory,
  sqlCategory,
  systemDesignCategory,
  toolingCategory,
} from './seed-data/topics-data';
import { SIMPLE } from './seed-data/topics-simple';
import { SIMPLE_BACKEND } from './seed-data/topics-simple-backend';
import { SIMPLE_REALTIME } from './seed-data/topics-simple-realtime';
import { SIMPLE_POSTGRES } from './seed-data/topics-simple-postgres';
import { SIMPLE_TYPESCRIPT } from './seed-data/topics-simple-typescript';
import { TRICKS } from './seed-data/topics-tricks';
import { TRICKS_TS_REACT } from './seed-data/topics-tricks-ts-react';
import { TRICKS_BACKEND } from './seed-data/topics-tricks-backend';
import { TRICKS_DATA } from './seed-data/topics-tricks-data';
import { SIMPLE_FOUNDATIONS, TRICKS_FOUNDATIONS } from './seed-data/topics-simple-foundations';
import { SIMPLE_OPS, TRICKS_OPS } from './seed-data/topics-simple-ops';
import { SIMPLE_GENAI, TRICKS_GENAI } from './seed-data/topics-simple-genai';
import { SIMPLE_THREEJS, TRICKS_THREEJS } from './seed-data/topics-simple-threejs';
import { SIMPLE_FIREBASE, TRICKS_FIREBASE } from './seed-data/topics-simple-firebase';
import { genaiCategory } from './seed-data/topics-genai';
import { threejsCategory } from './seed-data/topics-threejs';
import { firebaseCategory } from './seed-data/topics-firebase';
import { deploymentCategory } from './seed-data/topics-deployment';
import { securityCategory } from './seed-data/topics-security';
import { schemaCategory } from './seed-data/topics-schema';
import { reactNativeCategory } from './seed-data/topics-react-native';
import { htmlCategory } from './seed-data/topics-html';
import { cssCategory } from './seed-data/topics-css';
import { animationsCategory } from './seed-data/topics-animations';
import type { SeedCategory } from './seed-data/topics-shared';

/** Beginner explanations live apart from the topics so the voice stays consistent. */
const SIMPLE_ALL = {
  ...SIMPLE,
  ...SIMPLE_BACKEND,
  ...SIMPLE_REALTIME,
  ...SIMPLE_POSTGRES,
  ...SIMPLE_TYPESCRIPT,
  ...SIMPLE_FOUNDATIONS,
  ...SIMPLE_OPS,
  ...SIMPLE_GENAI,
  ...SIMPLE_THREEJS,
  ...SIMPLE_FIREBASE,
};

/**
 * Memory hooks, kept apart from the topics for the same reason as the beginner
 * layer: a consistent voice. Explaining and remembering are different jobs, and
 * writing the hook next to the explanation drifts straight back into explaining.
 */
const TRICKS_ALL = {
  ...TRICKS,
  ...TRICKS_TS_REACT,
  ...TRICKS_BACKEND,
  ...TRICKS_DATA,
  ...TRICKS_FOUNDATIONS,
  ...TRICKS_OPS,
  ...TRICKS_GENAI,
  ...TRICKS_THREEJS,
  ...TRICKS_FIREBASE,
};

const prisma = new PrismaClient();

const categories: SeedCategory[] = [
  javascriptCategory,
  typescriptCategory,
  reactCategory,
  threejsCategory,
  genaiCategory,
  nodeCategory,
  pythonCategory,
  fastapiCategory,
  djangoCategory,
  sqlCategory,
  postgresCategory,
  mongodbCategory,
  firebaseCategory,
  apiCategory,
  realtimeCategory,
  authCategory,
  schemaCategory,
  securityCategory,
  systemDesignCategory,
  deploymentCategory,
  toolingCategory,
  reactNativeCategory,
  htmlCategory,
  cssCategory,
  animationsCategory,
];

async function seedTopics(): Promise<number> {
  let topicCount = 0;

  for (const [index, category] of categories.entries()) {
    const saved = await prisma.topicCategory.upsert({
      where: { slug: category.slug },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
        group: category.group,
        order: index,
      },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        group: category.group,
        order: index,
      },
    });

    for (const [order, topic] of category.topics.entries()) {
      const data = {
        title: topic.title,
        categoryId: saved.id,
        order,
        difficulty: topic.difficulty,
        summary: topic.summary,
        summaryHi: topic.summaryHi,
        content: topic.content,
        contentHi: topic.contentHi,
        codeExample: topic.codeExample ?? null,
        expectedOutput: topic.expectedOutput ?? null,
        commonMistakes: topic.commonMistakes,
        interviewQuestions: topic.interviewQuestions,
        practiceQuestions: topic.practiceQuestions,
        relatedProblemSlugs: topic.relatedProblemSlugs ?? [],
        tags: topic.tags,
        simple: SIMPLE_ALL[topic.slug]?.simple ?? null,
        simpleHi: SIMPLE_ALL[topic.slug]?.simpleHi ?? null,
        tricks: TRICKS_ALL[topic.slug]?.tricks ?? null,
        tricksHi: TRICKS_ALL[topic.slug]?.tricksHi ?? null,
      };

      await prisma.topic.upsert({
        where: { slug: topic.slug },
        create: { slug: topic.slug, ...data },
        update: data,
      });
      topicCount += 1;
    }
  }

  return topicCount;
}

async function seedQuestions(): Promise<number> {
  // Basics first so the default (unsorted) listing opens with the on-ramp.
  const allQuestions = [
    ...basicQuestions,
    ...interviewQuestions,
    ...extraQuestions,
    ...typescriptQuestions,
    ...genaiQuestions,
    ...threejsQuestions,
  ];

  for (const q of allQuestions) {
    const data = {
      category: q.category,
      question: q.question,
      shortAnswer: q.shortAnswer,
      shortAnswerHi: q.shortAnswerHi,
      detailedAnswer: q.detailedAnswer,
      detailedAnswerHi: q.detailedAnswerHi,
      codeExample: q.codeExample ?? null,
      followUps: q.followUps,
      difficulty: q.difficulty,
      tags: q.tags,
    };

    await prisma.interviewQuestion.upsert({
      where: { slug: q.slug },
      create: { slug: q.slug, ...data },
      update: data,
    });
  }
  return allQuestions.length;
}

async function seedDsa(): Promise<number> {
  for (const [order, problem] of dsaProblems.entries()) {
    const data = {
      title: problem.title,
      category: problem.category,
      difficulty: problem.difficulty,
      description: problem.description,
      descriptionHi: problem.descriptionHi,
      examples: problem.examples as unknown as Prisma.InputJsonValue,
      constraints: problem.constraints,
      hints: problem.hints,
      approach: problem.approach,
      approachHi: problem.approachHi,
      timeComplexity: problem.timeComplexity,
      spaceComplexity: problem.spaceComplexity,
      solutionExplanation: problem.solutionExplanation,
      solutionExplanationHi: problem.solutionExplanationHi,
      starterCode: {
        JAVASCRIPT: problem.starter.js,
        NODEJS: problem.starter.js,
        PYTHON: problem.starter.py,
      } as Prisma.InputJsonValue,
      solutions: {
        JAVASCRIPT: problem.solution.js,
        NODEJS: problem.solution.js,
        PYTHON: problem.solution.py,
      } as Prisma.InputJsonValue,
      order,
    };

    const saved = await prisma.dSAProblem.upsert({
      where: { slug: problem.slug },
      create: { slug: problem.slug, ...data },
      update: data,
    });

    // Test cases have no natural key, so replace the set wholesale.
    await prisma.testCase.deleteMany({ where: { problemId: saved.id } });
    await prisma.testCase.createMany({
      data: problem.testCases.map((tc, index) => ({
        problemId: saved.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isSample: tc.isSample ?? false,
        isHidden: tc.isHidden ?? false,
        order: index,
      })),
    });
  }
  return dsaProblems.length;
}

// ============================================================================
// JAVASCRIPT COURSE SEEDING
// ============================================================================

async function seedJavaScriptCourse(): Promise<{ courses: number; modules: number; topics: number; problems: number }> {
  // Course data
  const courseData = {
    slug: 'javascript-complete',
    name: 'JavaScript Complete Course',
    nameHi: 'JavaScript Complete Course - Aapka Seekhne Ka Safar',
    description: 'Comprehensive JavaScript learning from fundamentals to advanced patterns. Master variables, functions, async programming, design patterns, and more.',
    descriptionHi: 'JavaScript ko basics se advanced patterns tak seekho. Variables, Functions, Async, Design Patterns - sab kuch.',
    icon: '🚀',
    color: '#F59E0B',
    level: 'beginner' as const,
    totalXpReward: 5000,
    estimatedHours: 150,
    maxDifficulty: 'HARD' as const,
    isPublished: true,
  };

  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    create: courseData,
    update: courseData,
  });

  /*
   * Five modules, ordered the way the knowledge is actually needed: language
   * basics, then the mechanics behind them, then the data shapes real apps
   * carry, then the browser, then the practices that separate a working script
   * from shippable software.
   */
  const modules = [
    {
      slug: 'module-1-fundamentals',
      name: 'Module 1: Fundamentals',
      nameHi: 'Module 1: Basics Se Shuruaat',
      description:
        'Variables, types, control flow, functions, arrays, objects and async — everything the rest of the course builds on.',
      descriptionHi:
        'Variables, types, control flow, functions, arrays, objects aur async — poore course ki neev yahi hai.',
      order: 1,
    },
    {
      slug: 'module-2-advanced',
      name: 'Module 2: How JavaScript Really Works',
      nameHi: 'Module 2: JavaScript Andar Se',
      description:
        'Closures, this, prototypes, classes, the event loop and error handling — the machinery under the syntax.',
      descriptionHi:
        'Closures, this, prototypes, classes, event loop aur error handling — syntax ke neeche ki machinery.',
      order: 2,
    },
    {
      slug: 'module-3-data',
      name: 'Module 3: Working With Real Data',
      nameHi: 'Module 3: Asli Data Ke Saath Kaam',
      description:
        'JSON, dates, regular expressions, Map and Set, and iterators — the shapes data actually arrives in.',
      descriptionHi:
        'JSON, dates, regular expressions, Map aur Set, aur iterators — data asal mein inhi shapes mein aata hai.',
      order: 3,
    },
    {
      slug: 'module-4-browser',
      name: 'Module 4: The Browser and the Network',
      nameHi: 'Module 4: Browser Aur Network',
      description:
        'DOM, events, fetch, storage, forms and security — everything that makes a page do something.',
      descriptionHi:
        'DOM, events, fetch, storage, forms aur security — jo page ko kuch karne layak banata hai.',
      order: 4,
    },
    {
      slug: 'module-5-professional',
      name: 'Module 5: Writing Professional Code',
      nameHi: 'Module 5: Professional Code Likhna',
      description:
        'Modules, design patterns, performance, debugging, testing and tooling — how working code becomes shippable code.',
      descriptionHi:
        'Modules, design patterns, performance, debugging, testing aur tooling — chalta hua code shippable kaise banta hai.',
      order: 5,
    },
  ];

  const createdModules = [];
  for (const moduleData of modules) {
    const mod = await prisma.courseModule.upsert({
      where: { courseId_slug: { courseId: course.id, slug: moduleData.slug } },
      create: { courseId: course.id, ...moduleData },
      update: moduleData,
    });
    createdModules.push(mod);
  }

  // Topic data — every topic ships English + Hinglish content side by side.
  const topics = [
    // Module 1 lessons live in their own file: full beginner explanations,
    // worked examples, common mistakes and interview Q&A, in English and
    // Hinglish. Modules 2 and 3 stay outline-level until their lessons exist.
    ...[...JS_MODULE_1, ...JS_MODULE_1_PART2, ...JS_MODULE_1_PART3, ...JS_MODULE_1_PART4].map((lesson) => ({
      ...lesson,
      moduleIndex: 0,
    })),
    ...[...JS_MODULE_2_PART1, ...JS_MODULE_2_PART2, ...JS_CLASSES].map((lesson) => ({
      ...lesson,
      moduleIndex: 1,
    })),
    ...[...JS_MODULE_3_PART1, ...JS_MODULE_3_PART2].map((lesson) => ({
      ...lesson,
      moduleIndex: 2,
    })),
    ...[...JS_MODULE_4_PART1, ...JS_MODULE_4_PART2, ...JS_WEB_APIS].map((lesson) => ({
      ...lesson,
      moduleIndex: 3,
    })),
    ...[...JS_MODULE_5_PART1, ...JS_MODULE_5_PART2].map((lesson) => ({
      ...lesson,
      moduleIndex: 4,
    })),
  ];

  const createdTopics = [];
  for (const topicData of topics) {
    // Modules 2 and 3 are still outline-level, so the rich lesson fields are
    // optional here — they default to empty and the UI hides those sections.
    const lesson = topicData as Partial<CourseLesson> & typeof topicData;

    // The rich lesson sections are Json columns; Prisma wants InputJsonValue,
    // and a typed array does not structurally satisfy that.
    const json = (v: unknown) => v as Prisma.InputJsonValue;

    const fields = {
      title: lesson.title,
      titleHi: lesson.titleHi,
      description: lesson.description,
      descriptionHi: lesson.descriptionHi,
      simple: lesson.simple,
      simpleHi: lesson.simpleHi,
      content: lesson.content,
      contentHi: lesson.contentHi,
      codeExample: lesson.codeExample ?? null,
      expectedOutput: lesson.expectedOutput ?? null,
      analogy: json(lesson.analogy ?? {}),
      examples: json(lesson.examples ?? []),
      mistakes: json(lesson.mistakes ?? []),
      realWorld: json(lesson.realWorld ?? []),
      interviewQA: json(lesson.interviewQA ?? []),
      exercises: json(lesson.exercises ?? []),
      keyTakeaways: lesson.keyTakeaways ?? [],
      keyTakeawaysHi: lesson.keyTakeawaysHi ?? [],
      difficulty: lesson.difficulty,
      duration: lesson.duration ?? 20,
      order: lesson.order,
    };

    const parentModule = createdModules[topicData.moduleIndex];
    if (!parentModule) throw new Error(`No module at index ${topicData.moduleIndex}`);

    const mod = await prisma.courseTopic.upsert({
      where: { courseId_slug: { courseId: course.id, slug: topicData.slug } },
      create: {
        courseId: course.id,
        moduleId: parentModule.id,
        slug: topicData.slug,
        ...fields,
      },
      update: fields,
    });
    createdTopics.push(mod);
  }

  // Problems data — full English + Hinglish description, hints, and approach.
  const problems = [
    {
      slug: 'js-var-basics',
      title: 'Variable Declaration Basics',
      topicSlug: 'variables-scope-hoisting',
      moduleIndex: 0,
      difficulty: 'EASY' as const,
      xpReward: 50,
      description:
        'Write a function `declareAndSum` that declares a `const` variable `a` with value 5 and a `let` variable `b` with value 10, then returns their sum. This checks that you understand basic variable declaration and that `const`/`let` work inside a function body.',
      descriptionHi:
        '`declareAndSum` naam ka function likho jo ek `const` variable `a` (value 5) aur ek `let` variable `b` (value 10) declare kare, phir dono ka sum return kare. Yeh check karta hai ki tumhe basic variable declaration aur function ke andar `const`/`let` ka use aata hai.',
      hints: [
        'Remember: const cannot be reassigned after declaration, but you are not reassigning here, just declaring.',
        'let is used for values that may change later — here b does not change, but the exercise wants you to practice both keywords.',
        'The return statement should simply add a + b.',
      ],
      approach:
        'Declare `const a = 5;` and `let b = 10;` inside the function, then `return a + b;`. This is a direct application of block-scoped declarations — no loops or edge cases involved.',
      approachHi:
        'Function ke andar `const a = 5;` aur `let b = 10;` declare karo, phir `return a + b;` likho. Yeh block-scoped declarations ka seedha application hai — koi loop ya edge case nahi hai.',
      solutionExplanation:
        'const and let are both block-scoped. Since a and b are only used within the function and never reassigned outside their intended purpose, this demonstrates the simplest correct usage of modern variable declarations.',
      solutionExplanationHi:
        'const aur let dono block-scoped hote hain. Chunki a aur b sirf function ke andar use ho rahe hain aur bahar reassign nahi ho rahe, yeh modern variable declarations ka sabse simple aur sahi use dikhata hai.',
      starterCode: { javascript: 'function declareAndSum() {\n  // your code here\n}\n' },
      testInput: 'declareAndSum()',
      testOutput: '15',
    },
    {
      slug: 'js-function-basics',
      title: 'Function Declaration',
      topicSlug: 'functions-arrow-functions',
      moduleIndex: 0,
      difficulty: 'EASY' as const,
      xpReward: 75,
      description:
        'Write an arrow function `greet` that takes a `name` parameter and returns the string `"Hello, {name}!"`. If no name is provided, default it to `"World"`.',
      descriptionHi:
        '`greet` naam ka arrow function likho jo `name` parameter le aur `"Hello, {name}!"` string return kare. Agar naam na diya jaaye to default `"World"` use karo.',
      hints: [
        'Arrow function syntax: const greet = (name) => { ... }',
        'Default parameters look like: (name = "World") => ...',
        'Use a template literal for clean string interpolation: `Hello, ${name}!`',
      ],
      approach:
        'Define the arrow function with a default parameter `name = "World"`, then return a template literal that interpolates `name`. This tests both arrow function syntax and default parameter handling.',
      approachHi:
        'Arrow function ko default parameter `name = "World"` ke saath define karo, phir template literal return karo jisme `name` interpolate ho. Yeh arrow function syntax aur default parameter dono test karta hai.',
      solutionExplanation:
        'Default parameters only kick in when the argument is undefined (not called at all, or explicitly passed as undefined), which is why greet() and greet(undefined) both produce "Hello, World!".',
      solutionExplanationHi:
        'Default parameters sirf tab activate hote hain jab argument undefined ho (call hi na kiya ho, ya explicitly undefined pass kiya ho), isliye greet() aur greet(undefined) dono "Hello, World!" hi dete hain.',
      starterCode: { javascript: 'const greet = (name) => {\n  // your code here\n};\n' },
      testInput: 'greet("Jay")',
      testOutput: 'Hello, Jay!',
    },
    {
      slug: 'js-async-basics',
      title: 'Async Function Basics',
      topicSlug: 'async-await-promises',
      moduleIndex: 0,
      difficulty: 'MEDIUM' as const,
      xpReward: 100,
      description:
        'Write an async function `delayedDouble(n)` that waits 100ms (using a Promise + setTimeout) and then returns `n * 2`. This checks your understanding of Promises and the `async/await` syntax.',
      descriptionHi:
        '`delayedDouble(n)` naam ka async function likho jo 100ms wait kare (Promise + setTimeout se) aur phir `n * 2` return kare. Yeh Promises aur `async/await` syntax ki samajh check karta hai.',
      hints: [
        'Wrap setTimeout in a `new Promise((resolve) => ...)` to convert it into an awaitable value.',
        'Inside the Promise executor, call resolve(n * 2) after the timeout fires.',
        'Mark the outer function as async and await the Promise.',
      ],
      approach:
        'Create a Promise that resolves with `n * 2` after 100ms via setTimeout, then `await` that Promise inside an `async` function and return its resolved value.',
      approachHi:
        'Ek Promise banao jo 100ms baad setTimeout ke through `n * 2` resolve kare, phir `async` function ke andar us Promise ko `await` karke uski resolved value return karo.',
      solutionExplanation:
        'async functions implicitly wrap their return value in a Promise. Awaiting the inner setTimeout-based Promise pauses execution until resolve() fires, so the caller receives the doubled value once the delay completes.',
      solutionExplanationHi:
        'async functions apni return value ko implicitly Promise mein wrap kar dete hain. Andar wale setTimeout-based Promise ko await karne se execution tab tak ruk jaata hai jab tak resolve() call nahi hota, isliye caller ko delay poora hone ke baad doubled value milti hai.',
      starterCode: { javascript: 'async function delayedDouble(n) {\n  // your code here\n}\n' },
      testInput: 'await delayedDouble(21)',
      testOutput: '42',
    },
    {
      slug: 'js-closure-counter',
      title: 'Create a Counter with Closures',
      topicSlug: 'closures-scope-chain',
      moduleIndex: 1,
      difficulty: 'MEDIUM' as const,
      xpReward: 100,
      description:
        'Write a function `makeCounter()` that returns another function. Each time the returned function is called, it should return an incrementing count starting at 1, using a closure to keep the count private.',
      descriptionHi:
        '`makeCounter()` naam ka function likho jo ek doosra function return kare. Jab bhi returned function call ho, woh 1 se shuru hokar increment hota count return kare — closure use karke count ko private rakho.',
      hints: [
        'Declare a `count` variable inside makeCounter, initialized to 0.',
        'Return an inner function that increments and returns count.',
        'Because the inner function closes over count, each call to makeCounter() gets its own independent counter.',
      ],
      approach:
        'Inside makeCounter, declare `let count = 0`. Return `() => ++count`. The returned function forms a closure over `count`, so repeated calls remember and increment the same private variable.',
      approachHi:
        'makeCounter ke andar `let count = 0` declare karo. `() => ++count` return karo. Returned function `count` ke upar closure banata hai, isliye baar-baar call karne par woh wahi private variable yaad rakhta hai aur increment karta hai.',
      solutionExplanation:
        'Because count lives in makeCounter\'s scope and the returned arrow function references it, JavaScript keeps that scope alive even after makeCounter has returned — this is the closure. Each call to makeCounter() creates a brand-new, isolated count.',
      solutionExplanationHi:
        'Chunki count makeCounter ke scope mein rehta hai aur returned arrow function usko reference karta hai, JavaScript us scope ko zinda rakhta hai chahe makeCounter return ho chuka ho — isi ko closure kehte hain. makeCounter() ki har call apna bilkul naya, alag count banati hai.',
      starterCode: { javascript: 'function makeCounter() {\n  // your code here\n}\n' },
      testInput: 'const c = makeCounter(); c(); c(); c()',
      testOutput: '3',
    },
    {
      slug: 'js-class-inheritance',
      title: 'Class Inheritance',
      topicSlug: 'prototypes-inheritance',
      moduleIndex: 1,
      difficulty: 'MEDIUM' as const,
      xpReward: 125,
      description:
        'Create a class `Animal` with a constructor that takes `name` and a method `speak()` returning `"{name} makes a sound."`. Then create a class `Dog extends Animal` that overrides `speak()` to return `"{name} barks."`.',
      descriptionHi:
        'Ek class `Animal` banao jiske constructor mein `name` ho aur ek method `speak()` ho jo `"{name} makes a sound."` return kare. Phir ek class `Dog extends Animal` banao jo `speak()` ko override karke `"{name} barks."` return kare.',
      hints: [
        'Use `class Animal { constructor(name) { this.name = name; } }`.',
        'extends and super() connect Dog to Animal\'s constructor.',
        'Overriding a method means redefining it with the same name in the subclass.',
      ],
      approach:
        'Define Animal with a constructor storing `this.name` and a `speak()` prototype method. Define `Dog extends Animal` and simply redefine `speak()` — no need to call super() unless you need Animal\'s constructor logic beyond storing name.',
      approachHi:
        'Animal define karo jiska constructor `this.name` store kare aur ek `speak()` prototype method ho. `Dog extends Animal` define karo aur bas `speak()` ko dubara define kar do — super() call karne ki zarurat nahi jab tak Animal ke constructor mein extra logic na ho.',
      solutionExplanation:
        'Dog inherits from Animal via the prototype chain. Because Dog defines its own speak(), JavaScript finds that method first (own > inherited), so Dog instances bark instead of making a generic sound — this is method overriding.',
      solutionExplanationHi:
        'Dog, Animal se prototype chain ke through inherit karta hai. Chunki Dog apna khud ka speak() define karta hai, JavaScript pehle wahi method dhoondhta hai (own > inherited), isliye Dog instances generic sound ki jagah bark karte hain — isi ko method overriding kehte hain.',
      starterCode: {
        javascript:
          "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound.`;\n  }\n}\n\nclass Dog extends Animal {\n  // your code here\n}\n",
      },
      testInput: "new Dog('Rex').speak()",
      testOutput: 'Rex barks.',
    },
    {
      slug: 'js-type-check',
      title: 'Safe Type Checking',
      topicSlug: 'data-types-coercion',
      moduleIndex: 0,
      difficulty: 'EASY' as const,
      xpReward: 60,
      description:
        'Write `describe(value)` that returns the string "null" for null, "array" for an array, and otherwise the result of `typeof`. This forces you past the two classic traps: `typeof null` reports "object", and so does `typeof []`.',
      descriptionHi:
        '`describe(value)` likho jo null ke liye "null", array ke liye "array", aur baaki sab ke liye `typeof` ka result de. Isse do classic jaal paar karne padenge: `typeof null` "object" batata hai, aur `typeof []` bhi.',
      hints: [
        'Check for null FIRST, with value === null, because typeof will not help you there.',
        'Array.isArray(value) is the only reliable way to detect an array.',
        'Everything that survives both checks can fall through to typeof.',
      ],
      approach:
        'Order matters. Test `value === null` first, then `Array.isArray(value)`, then fall back to `typeof value`. Reversing the order lets null and arrays escape as "object".',
      approachHi:
        'Order matter karta hai. Pehle `value === null` test karo, phir `Array.isArray(value)`, phir `typeof value` par gir jao. Order ulta kiya to null aur arrays "object" bankar nikal jayenge.',
      solutionExplanation:
        'typeof cannot distinguish null, arrays and plain objects — all three report "object". Explicit checks for the two special cases, in the right order, give you a type function you can actually trust.',
      solutionExplanationHi:
        'typeof null, arrays aur plain objects mein fark nahi kar pata — teeno "object" batate hain. Do khaas cases ke liye sahi order mein explicit checks lagao, to aisa type function milta hai jispar bharosa kiya ja sake.',
      starterCode: { javascript: 'function describe(value) {\n  // your code here\n}\n' },
      testInput: "describe(null) + ',' + describe([1]) + ',' + describe('hi')",
      testOutput: 'null,array,string',
    },
    {
      slug: 'js-fizzbuzz',
      title: 'FizzBuzz',
      topicSlug: 'control-flow-loops',
      moduleIndex: 0,
      difficulty: 'EASY' as const,
      xpReward: 80,
      description:
        'Write `fizzBuzz(n)` that returns an array from 1 to n, where multiples of 3 become "Fizz", multiples of 5 become "Buzz", multiples of both become "FizzBuzz", and everything else stays a number. The classic first interview screen.',
      descriptionHi:
        '`fizzBuzz(n)` likho jo 1 se n tak ki array de, jisme 3 ke multiples "Fizz", 5 ke "Buzz", dono ke "FizzBuzz", aur baaki sab number hi rahein. Classic pehla interview screen.',
      hints: [
        'Check the both-case first. If you test n % 3 before n % 15, then 15 becomes "Fizz" and never reaches "FizzBuzz".',
        'A number is a multiple of both 3 and 5 exactly when it is a multiple of 15.',
        'Build the result with a loop and push, or map over Array.from({ length: n }).',
      ],
      approach:
        'Loop from 1 to n. Test `n % 15 === 0` first, then `% 3`, then `% 5`, else keep the number. The ordering is the entire difficulty of this problem.',
      approachHi:
        '1 se n tak loop chalao. Pehle `n % 15 === 0` test karo, phir `% 3`, phir `% 5`, warna number hi rakho. Is problem ki poori mushkil isi order mein hai.',
      solutionExplanation:
        'Because if/else if stops at the first true branch, the most specific condition must come first. Checking % 3 before % 15 is the single mistake this problem is designed to catch.',
      solutionExplanationHi:
        'Chunki if/else if pehli true branch par ruk jata hai, sabse khaas condition pehle aani chahiye. % 15 se pehle % 3 check karna hi wo galti hai jise ye problem pakadne ke liye banayi gayi hai.',
      starterCode: { javascript: 'function fizzBuzz(n) {\n  // your code here\n}\n' },
      testInput: 'fizzBuzz(15).slice(-3).join(",")',
      testOutput: '13,14,FizzBuzz',
    },
    {
      slug: 'js-array-chain',
      title: 'Chain filter, map and reduce',
      topicSlug: 'arrays-and-methods',
      moduleIndex: 0,
      difficulty: 'MEDIUM' as const,
      xpReward: 120,
      description:
        'Given an array of `{ item, amount, paid }` orders, write `revenue(orders)` that returns the total amount of the paid orders only — in a single chain, without writing a loop.',
      descriptionHi:
        '`{ item, amount, paid }` orders ki array di hai — `revenue(orders)` likho jo sirf paid orders ka total amount de, ek hi chain mein, bina koi loop likhe.',
      hints: [
        'Three steps, three methods: keep the paid ones, take their amounts, add them up.',
        'filter returns an array, so you can call .map() straight on the result.',
        'Give reduce a starting value of 0 so an empty array returns 0 instead of throwing.',
      ],
      approach:
        'Chain `.filter(o => o.paid)` then `.map(o => o.amount)` then `.reduce((sum, a) => sum + a, 0)`. Read aloud it is literally "paid orders, their amounts, added up".',
      approachHi:
        '`.filter(o => o.paid)` phir `.map(o => o.amount)` phir `.reduce((sum, a) => sum + a, 0)` chain karo. Zor se padho to seedha "paid orders, unke amounts, jod diye" hi hai.',
      solutionExplanation:
        'Each method returns a new array (or value), so they compose. The chain has no counter and no mutable accumulator of your own, which removes the two places a manual for-loop usually goes wrong.',
      solutionExplanationHi:
        'Har method nayi array (ya value) deta hai, isliye wo aapas mein jud jate hain. Chain mein na counter hai na aapka apna mutable accumulator, isliye wo do jagah hi hat jaati hain jahan manual for-loop aksar galat hota hai.',
      starterCode: { javascript: 'function revenue(orders) {\n  // your code here\n}\n' },
      testInput:
        'revenue([{amount:500,paid:true},{amount:2000,paid:false},{amount:300,paid:true}])',
      testOutput: '800',
    },
    {
      slug: 'js-object-update',
      title: 'Immutable Nested Update',
      topicSlug: 'objects-destructuring',
      moduleIndex: 0,
      difficulty: 'MEDIUM' as const,
      xpReward: 130,
      description:
        'Write `moveUser(user, newCity)` that returns a NEW user object with `address.city` changed, leaving the original completely untouched — including its nested `address` object. This is the exact pattern React state updates require.',
      descriptionHi:
        '`moveUser(user, newCity)` likho jo NAYA user object de jisme `address.city` badla ho, aur original bilkul waisa hi rahe — uska nested `address` object bhi. React state updates ko bilkul yahi pattern chahiye.',
      hints: [
        'A single spread only copies the top level, so user.address would still be shared.',
        'You must spread every level on the path down to the field you are changing.',
        'The shape is { ...user, address: { ...user.address, city: newCity } }.',
      ],
      approach:
        'Spread the outer object, then override `address` with a spread of the inner object plus the new city. One spread per level on the path to the change.',
      approachHi:
        'Bahar wale object ko spread karo, phir `address` ko andar wale object ke spread aur nayi city se override karo. Jis rah se badlav tak jaana hai, us par har level ke liye ek spread.',
      solutionExplanation:
        'Spread is one level deep, so a lone { ...user } leaves both objects pointing at the same address. Spreading each level down the path gives every mutated branch a fresh reference, which is what makes React see the change.',
      solutionExplanationHi:
        'Spread ek level gehra hai, isliye akela { ...user } dono objects ko usi ek address par point karta chhod deta hai. Rah ke har level ko spread karne se har badli hui branch ko naya reference milta hai, aur isi se React ko change dikhta hai.',
      starterCode: {
        javascript: 'function moveUser(user, newCity) {\n  // your code here\n}\n',
      },
      testInput:
        'const u={name:"Jay",address:{city:"Pune"}}; const m=moveUser(u,"Mumbai"); m.address.city+","+u.address.city',
      testOutput: 'Mumbai,Pune',
    },
    {
      slug: 'js-this-bind',
      title: 'Rescue a Detached Method',
      topicSlug: 'this-call-apply-bind',
      moduleIndex: 1,
      difficulty: 'MEDIUM' as const,
      xpReward: 130,
      description:
        'Given `const counter = { total: 0, add(n) { this.total += n; return this.total; } }`, write `makeAdder(counter)` that returns a standalone function which can be passed anywhere — to `map`, to `setTimeout` — and still updates the right counter.',
      descriptionHi:
        '`const counter = { total: 0, add(n) { this.total += n; return this.total; } }` diya hai — `makeAdder(counter)` likho jo aisa akela function de jise kahin bhi bheja ja sake — `map` ko, `setTimeout` ko — aur wo phir bhi sahi counter update kare.',
      hints: [
        'Passing counter.add directly loses this, because there is nothing left of the dot at the call site.',
        'bind returns a NEW function permanently tied to the object you give it.',
        'An arrow wrapper works too: (n) => counter.add(n) keeps the counter. part of the call.',
      ],
      approach:
        'Return `counter.add.bind(counter)`. Binding fixes the receiver for good, so the function survives being assigned to a variable or handed to a callback.',
      approachHi:
        '`counter.add.bind(counter)` return karo. Binding receiver ko hamesha ke liye fix kar deti hai, isliye function variable mein daalne ya callback ki tarah bhejne par bhi bacha rehta hai.',
      solutionExplanation:
        'Implicit binding comes from the call expression, not the function, so a detached method has no receiver. bind creates a wrapper that supplies the receiver explicitly on every call, which is exactly what a passed-around callback needs.',
      solutionExplanationHi:
        'Implicit binding call expression se aati hai, function se nahi, isliye alag kiye gaye method ka koi receiver hota hi nahi. bind aisa wrapper banata hai jo har call par receiver khud deta hai, aur idhar-udhar bheje jaane wale callback ko theek yahi chahiye.',
      starterCode: {
        javascript: 'function makeAdder(counter) {\n  // your code here\n}\n',
      },
      testInput:
        'const c={total:0,add(n){this.total+=n;return this.total;}}; const f=makeAdder(c); [1,2,3].forEach(f); c.total',
      testOutput: '6',
    },
    {
      slug: 'js-event-loop-order',
      title: 'Predict the Event Loop',
      topicSlug: 'event-loop-timers',
      moduleIndex: 1,
      difficulty: 'HARD' as const,
      xpReward: 180,
      description:
        'Write `ordering()` that returns an array of the strings "sync", "micro" and "macro" in the exact order they would execute if each were logged from synchronous code, a resolved promise callback, and a `setTimeout(…, 0)` respectively. Then explain the order in a comment.',
      descriptionHi:
        '`ordering()` likho jo "sync", "micro" aur "macro" strings ki array bilkul us kram mein de jisme wo chalte — agar unhe kramshah synchronous code, resolve hue promise callback, aur `setTimeout(…, 0)` se log kiya jata. Phir comment mein kram samjhao.',
      hints: [
        'The call stack always finishes first, so sync comes before anything queued.',
        'The microtask queue drains completely before a single macrotask is taken.',
        'setTimeout with 0 delay is still a macrotask, so it always comes last here.',
      ],
      approach:
        'The event loop runs all synchronous code, then drains the whole microtask queue, then takes one macrotask. So the order is always sync, micro, macro — regardless of the delay you pass to setTimeout.',
      approachHi:
        'Event loop pehle saara synchronous code chalata hai, phir poori microtask queue khaali karta hai, phir ek macrotask leta hai. Isliye kram hamesha sync, micro, macro hi rehta hai — setTimeout ko chahe koi bhi delay do.',
      solutionExplanation:
        'This ordering is guaranteed by the specification, not a race. Promises are microtasks and always run before timers, which is why setTimeout(fn, 0) never runs "immediately" and why a promise chain can starve a timer entirely.',
      solutionExplanationHi:
        'Ye kram specification se guaranteed hai, koi race nahi. Promises microtasks hain aur hamesha timers se pehle chalte hain, isiliye setTimeout(fn, 0) kabhi "turant" nahi chalta aur isiliye promise chain kisi timer ko poori tarah bhookha maar sakti hai.',
      starterCode: { javascript: 'function ordering() {\n  // your code here\n}\n' },
      testInput: 'ordering().join(",")',
      testOutput: 'sync,micro,macro',
    },
    {
      slug: 'js-safe-parse',
      title: 'Fail Loudly, Not Silently',
      topicSlug: 'error-handling',
      moduleIndex: 1,
      difficulty: 'MEDIUM' as const,
      xpReward: 140,
      description:
        'Write `safeJsonParse(text)` that returns `{ ok: true, data }` when the text parses and `{ ok: false, error }` when it does not. It must never throw, and must never return an empty object that hides the failure from the caller.',
      descriptionHi:
        '`safeJsonParse(text)` likho jo text parse hone par `{ ok: true, data }` de aur na hone par `{ ok: false, error }`. Wo kabhi throw na kare, aur kabhi aisa khaali object na de jo failure ko caller se chhupa le.',
      hints: [
        'Wrap JSON.parse in try/catch and return a different shape from each branch.',
        'Put the error message on the failure shape so the caller can show or log it.',
        'Returning {} on failure is the anti-pattern here — the caller cannot tell success from failure.',
      ],
      approach:
        'Try to parse; on success return `{ ok: true, data }`, on failure return `{ ok: false, error: err.message }`. Making failure part of the return type forces every caller to acknowledge it.',
      approachHi:
        'Parse karne ki koshish karo; safal hone par `{ ok: true, data }` do, fail hone par `{ ok: false, error: err.message }`. Failure ko return type ka hissa banane se har caller ko usse maanna hi padta hai.',
      solutionExplanation:
        'A catch block that returns a plausible-looking empty value converts a loud, findable crash into silent data corruption that surfaces far from its cause. Returning a tagged result keeps the failure visible without throwing.',
      solutionExplanationHi:
        'Aisa catch block jo dekhne mein theek lagti khaali value return kare, wo zor se dikhne wale crash ko chup-chaap hone wale data corruption mein badal deta hai, jo apne kaaran se bahut door jaakar dikhta hai. Tagged result dena failure ko bina throw kiye saamne rakhta hai.',
      starterCode: {
        javascript: 'function safeJsonParse(text) {\n  // your code here\n}\n',
      },
      testInput: 'safeJsonParse("{\\"a\\":1}").ok + "," + safeJsonParse("nope").ok',
      testOutput: 'true,false',
    },
    {
      slug: 'js-json-revive',
      title: 'Bring the Dates Back',
      topicSlug: 'json-serialization',
      moduleIndex: 2,
      difficulty: 'MEDIUM' as const,
      xpReward: 120,
      description:
        'Write `parseWithDates(text)` that parses JSON and turns every value whose key ends in "At" (createdAt, updatedAt, …) back into a real Date object instead of leaving it a string.',
      descriptionHi:
        '`parseWithDates(text)` likho jo JSON parse kare aur har us value ko jiski key "At" par khatam hoti hai (createdAt, updatedAt, …) string ke bajaye asli Date object bana de.',
      hints: [
        'JSON.parse takes a second argument called a reviver: (key, value) => newValue.',
        'Check whether the key ends with "At" using String.prototype.endsWith.',
        'Return new Date(value) for those keys and the untouched value for everything else.',
      ],
      approach:
        'Pass a reviver to JSON.parse. It runs for every key/value pair, so returning `new Date(value)` for date-shaped keys rebuilds them during parsing, before any other code sees a string.',
      approachHi:
        'JSON.parse ko reviver do. Wo har key/value jodi par chalta hai, isliye date wali keys ke liye `new Date(value)` return karne se wo parse ke dauran hi ban jati hain, kisi aur code ke string dekhne se pehle.',
      solutionExplanation:
        'JSON has no date type, so every Date becomes an ISO string on the way out and stays a string on the way back. Rebuilding inside the reviver fixes it once, centrally, instead of scattering new Date(...) calls through the codebase.',
      solutionExplanationHi:
        'JSON mein date type hota hi nahi, isliye har Date bahar jaate waqt ISO string ban jati hai aur wapas aate waqt string hi rehti hai. Reviver ke andar banane se ye ek hi jagah, ek baar theek ho jata hai, poore codebase mein new Date(...) bikherne ke bajaye.',
      starterCode: {
        javascript: 'function parseWithDates(text) {\n  // your code here\n}\n',
      },
      testInput:
        'parseWithDates(\'{"createdAt":"2024-06-15T00:00:00.000Z"}\').createdAt instanceof Date',
      testOutput: 'true',
    },
    {
      slug: 'js-add-days',
      title: 'Add Days Without Mutating',
      topicSlug: 'dates-and-time',
      moduleIndex: 2,
      difficulty: 'MEDIUM' as const,
      xpReward: 120,
      description:
        'Write `addDays(date, n)` that returns a NEW Date n days later, leaving the original completely unchanged. It must handle month and year boundaries — 31 January plus 1 day is 1 February.',
      descriptionHi:
        '`addDays(date, n)` likho jo n din baad ki NAYI Date de aur original ko bilkul na badle. Use mahine aur saal ki seema bhi sambhalni chahiye — 31 January plus 1 din = 1 February.',
      hints: [
        'Every Date setter mutates in place, so you must copy before adjusting.',
        'new Date(existingDate) makes an independent copy.',
        'setDate handles rollover for you — setDate(32) in January gives 1 February.',
      ],
      approach:
        'Copy with `new Date(date)`, then call `copy.setDate(copy.getDate() + n)` and return the copy. The setter rolls over month and year boundaries automatically.',
      approachHi:
        '`new Date(date)` se copy karo, phir `copy.setDate(copy.getDate() + n)` bulao aur copy return karo. Setter mahine aur saal ki seema apne aap roll kar deta hai.',
      solutionExplanation:
        'Date setters mutate the object they are called on, so operating on the argument directly would silently change the caller\'s value. Copying first is what makes the function safe to use anywhere.',
      solutionExplanationHi:
        'Date setters us object ko hi mutate karte hain jispar bulaye jate hain, isliye seedhe argument par kaam karne se caller ki value chup-chaap badal jati. Pehle copy karna hi function ko har jagah surakshit banata hai.',
      starterCode: {
        javascript: 'function addDays(date, n) {\n  // your code here\n}\n',
      },
      testInput:
        'const d=new Date("2024-01-31T12:00:00Z"); const r=addDays(d,1); r.getUTCMonth()+","+d.getUTCDate()',
      testOutput: '1,31',
    },
    {
      slug: 'js-regex-mask',
      title: 'Mask a Card Number',
      topicSlug: 'regular-expressions',
      moduleIndex: 2,
      difficulty: 'MEDIUM' as const,
      xpReward: 140,
      description:
        'Write `maskCard(number)` that turns a 16-digit card number into `"**** **** **** 1111"` — keeping only the last four digits — using a single regex replace.',
      descriptionHi:
        '`maskCard(number)` likho jo 16-ank ke card number ko ek hi regex replace se `"**** **** **** 1111"` bana de — sirf aakhri chaar ank rakhte hue.',
      hints: [
        'Match the first twelve digits and capture the last four: \\d{12}(\\d{4}).',
        'Inside the replacement string, $1 refers to the first capture group.',
        'Anchor with ^ and $ so a longer string cannot partially match.',
      ],
      approach:
        'Use `number.replace(/^\\d{12}(\\d{4})$/, "**** **** **** $1")`. The capture group holds the last four digits and `$1` drops them into the replacement.',
      approachHi:
        '`number.replace(/^\\d{12}(\\d{4})$/, "**** **** **** $1")` use karo. Capture group aakhri chaar ank rakhta hai aur `$1` unhe replacement mein daal deta hai.',
      solutionExplanation:
        'Capture groups plus $1 references are how you keep part of a match while replacing the rest. Anchoring with ^ and $ ensures the pattern describes the whole value, not just something found inside it.',
      solutionExplanationHi:
        'Capture groups aur $1 references se hi match ka ek hissa bacha kar baaki badla jata hai. ^ aur $ se anchor karna ye pakka karta hai ki pattern poori value bata raha hai, na ki uske andar mili koi cheez.',
      starterCode: {
        javascript: 'function maskCard(number) {\n  // your code here\n}\n',
      },
      testInput: 'maskCard("4111111111111111")',
      testOutput: '**** **** **** 1111',
    },
    {
      slug: 'js-dedupe-by',
      title: 'Deduplicate Objects by Key',
      topicSlug: 'map-set-weakmap',
      moduleIndex: 2,
      difficulty: 'MEDIUM' as const,
      xpReward: 130,
      description:
        'Write `dedupeBy(items, key)` that removes duplicate objects by the given key, keeping the FIRST occurrence of each. A plain Set will not work here — identical-looking objects are still different objects.',
      descriptionHi:
        '`dedupeBy(items, key)` likho jo di gayi key se duplicate objects hataye aur har ek ka PEHLA occurrence rakhe. Simple Set yahan kaam nahi karega — ek jaise dikhne wale objects bhi alag objects hote hain.',
      hints: [
        'Set compares objects by reference, so new Set(items) keeps every duplicate.',
        'Keep a Set of the key values you have already seen, and filter on it.',
        'A Map keyed on the field also works, but it keeps the LAST occurrence, not the first.',
      ],
      approach:
        'Build a `Set` of seen key values and `filter` the array: if the item\'s key is already in the set, drop it; otherwise add it and keep the item. `Set.has` is O(1), so this stays linear.',
      approachHi:
        'Dekhi hui key values ka ek `Set` banao aur array ko `filter` karo: agar item ki key pehle se set mein hai to chhod do; warna usse add karo aur item rakho. `Set.has` O(1) hai, isliye ye linear hi rehta hai.',
      solutionExplanation:
        'Deduplicating objects needs a primitive to compare on, because Set and Map both use reference identity for objects. Tracking seen primitive keys in a Set gives O(1) lookups and preserves first-seen order, which a Map would not.',
      solutionExplanationHi:
        'Objects dedupe karne ke liye compare karne layak koi primitive chahiye, kyunki Set aur Map dono objects ke liye reference identity dekhte hain. Dekhi hui primitive keys ko Set mein rakhne se O(1) lookup milta hai aur pehle-dekhe-gaye ka order bhi bacha rehta hai, jo Map nahi rakhta.',
      starterCode: {
        javascript: 'function dedupeBy(items, key) {\n  // your code here\n}\n',
      },
      testInput:
        'dedupeBy([{id:1,n:"a"},{id:2,n:"b"},{id:1,n:"c"}],"id").map(o=>o.n).join(",")',
      testOutput: 'a,b',
    },
    {
      slug: 'js-generator-range',
      title: 'A Lazy Range Generator',
      topicSlug: 'iterators-generators',
      moduleIndex: 2,
      difficulty: 'HARD' as const,
      xpReward: 170,
      description:
        'Write `function* range(start, end, step = 1)` that yields numbers from start up to but NOT including end. It must be lazy — nothing should be computed until the caller asks for a value.',
      descriptionHi:
        '`function* range(start, end, step = 1)` likho jo start se end tak numbers de, end shaamil NAHI. Ye lazy hona chahiye — caller ke maange bina kuch calculate na ho.',
      hints: [
        'Declare it with function* so it returns a generator instead of running immediately.',
        'A plain for loop with yield i inside the body is all you need.',
        'The end value is exclusive, so the condition is i < end, not i <= end.',
      ],
      approach:
        'Loop from `start` while `i < end`, incrementing by `step`, and `yield i` each round. Because it is a generator, the loop only advances when the consumer calls `next()`.',
      approachHi:
        '`start` se loop chalao jab tak `i < end` ho, `step` se badhao, aur har round `yield i` karo. Generator hone ki wajah se loop tabhi aage badhta hai jab consumer `next()` bulaye.',
      solutionExplanation:
        'A generator pauses at every yield and keeps its local state, so an arbitrarily large or even infinite range costs constant memory. The array equivalent would have to allocate every value up front, whether the caller needed them or not.',
      solutionExplanationHi:
        'Generator har yield par rukta hai aur apna local state rakhta hai, isliye kitni bhi badi ya anant range constant memory leti hai. Array wala version har value pehle hi allocate karta, chahe caller ko unki zarurat ho ya na ho.',
      starterCode: {
        javascript: 'function* range(start, end, step = 1) {\n  // your code here\n}\n',
      },
      testInput: '[...range(0, 10, 2)].join(",")',
      testOutput: '0,2,4,6,8',
    },
    {
      slug: 'js-dom-render-list',
      title: 'Render a List Safely',
      topicSlug: 'dom-manipulation',
      moduleIndex: 3,
      difficulty: 'MEDIUM' as const,
      xpReward: 130,
      description:
        'Write `renderNames(names)` that builds an array of `<li>` elements from an array of strings. Each name must be inserted as TEXT, so a name like `<b>Jay</b>` shows those angle brackets rather than rendering bold.',
      descriptionHi:
        '`renderNames(names)` likho jo strings ki array se `<li>` elements ki array banaye. Har naam TEXT ki tarah daala jaye, taaki `<b>Jay</b>` jaisa naam bold hone ke bajaye wo angle brackets dikhaye.',
      hints: [
        'document.createElement("li") builds the element; textContent fills it safely.',
        'innerHTML would parse the name as markup — that is exactly what you must avoid.',
        'Return the array of elements; the caller appends them.',
      ],
      approach:
        'Map over the names, creating an `li` for each and assigning `textContent`. Because `textContent` escapes everything, no markup in the data can ever become an element.',
      approachHi:
        'Names par map karo, har ek ke liye `li` banao aur `textContent` set karo. `textContent` sab escape kar deta hai, isliye data ka koi bhi markup kabhi element nahi ban sakta.',
      solutionExplanation:
        'textContent treats its input as literal characters, while innerHTML parses it as HTML and will execute event handlers such as onerror. Building structure in code and inserting content as text is the standard defence against stored XSS.',
      solutionExplanationHi:
        'textContent apne input ko literal characters maanta hai, jabki innerHTML usse HTML ki tarah parse karta hai aur onerror jaise event handlers chala deta hai. Structure code mein banana aur content text ki tarah daalna stored XSS ke khilaf standard bachaav hai.',
      starterCode: {
        javascript: 'function renderNames(names) {\n  // your code here\n}\n',
      },
      testInput: 'renderNames(["<b>Jay</b>"])[0].children.length',
      testOutput: '0',
    },
    {
      slug: 'js-event-delegation',
      title: 'One Listener, Many Buttons',
      topicSlug: 'events-and-delegation',
      moduleIndex: 3,
      difficulty: 'MEDIUM' as const,
      xpReward: 140,
      description:
        'Write `attachDelete(list, onDelete)` that adds ONE click listener to `list` and calls `onDelete(id)` whenever a `.delete` button inside it is clicked — including buttons added to the list after the listener was attached.',
      descriptionHi:
        '`attachDelete(list, onDelete)` likho jo `list` par EK click listener lagaye aur jab bhi uske andar ka `.delete` button click ho tab `onDelete(id)` bulaye — un buttons par bhi jo listener lagne ke baad jode gaye.',
      hints: [
        'Attach the listener to the parent list, not to each button.',
        'e.target may be an icon inside the button, so use e.target.closest(".delete").',
        'Return early when closest returns null — the click was somewhere else.',
      ],
      approach:
        'Add one listener on `list`. Inside it, call `e.target.closest(".delete")`; if that is null the click was elsewhere, so return. Otherwise read the id from the enclosing item and call `onDelete`.',
      approachHi:
        '`list` par ek listener lagao. Uske andar `e.target.closest(".delete")` bulao; null aaye to click kahin aur tha, return kar do. Warna aas-paas wale item se id padho aur `onDelete` bulao.',
      solutionExplanation:
        'Events bubble from the target up through every ancestor, so a listener on the parent sees clicks that originated on any descendant — including elements created later. closest walks up from the deepest clicked node to the element you actually care about, which keeps the handler working when a button contains an icon.',
      solutionExplanationHi:
        'Events target se har ancestor tak upar bubble karte hain, isliye parent par laga listener kisi bhi descendant par hue click dekh leta hai — un elements par bhi jo baad mein bane. closest sabse gehre clicked node se upar chalkar us element tak jata hai jo aapko chahiye, jisse button ke andar icon hone par bhi handler chalta rehta hai.',
      starterCode: {
        javascript: 'function attachDelete(list, onDelete) {\n  // your code here\n}\n',
      },
      testInput: 'delegation fires for a button appended after attachDelete ran',
      testOutput: 'onDelete called with the new item id',
    },
    {
      slug: 'js-api-wrapper',
      title: 'A fetch Wrapper That Actually Checks',
      topicSlug: 'fetch-and-http',
      moduleIndex: 3,
      difficulty: 'MEDIUM' as const,
      xpReward: 150,
      description:
        'Write `api(url, options)` that sets the JSON content type, throws an error containing the status when `res.ok` is false, returns `null` for a 204, and otherwise returns the parsed JSON.',
      descriptionHi:
        '`api(url, options)` likho jo JSON content type set kare, `res.ok` false hone par status wala error throw kare, 204 par `null` de, aur baaki mein parsed JSON de.',
      hints: [
        'fetch resolves for 404 and 500 — you must check res.ok yourself.',
        'A 204 No Content has an empty body, so calling .json() on it throws.',
        'Spread the caller options after your defaults so they can override the method.',
      ],
      approach:
        'Await the fetch with merged headers, check `res.ok` and throw with `res.status` if not, special-case 204 by returning null, and otherwise return `res.json()`.',
      approachHi:
        'Mile hue headers ke saath fetch await karo, `res.ok` check karo aur na hone par `res.status` ke saath throw karo, 204 par null return karo, aur baaki mein `res.json()` do.',
      solutionExplanation:
        'fetch only rejects on network-level failures, so an unchecked 404 flows into res.json() and produces a confusing SyntaxError from parsing an HTML error page. Checking res.ok converts that into a clear, actionable error, and the 204 guard prevents a parse failure on a legitimately empty body.',
      solutionExplanationHi:
        'fetch sirf network-level failures par reject karta hai, isliye bina check kiya 404 res.json() tak pahunch jata hai aur HTML error page parse karke uljhan wala SyntaxError deta hai. res.ok check karne se wo saaf, kaam ka error ban jata hai, aur 204 wala guard sach mein khaali body par parse fail hone se bachata hai.',
      starterCode: {
        javascript: 'async function api(url, options = {}) {\n  // your code here\n}\n',
      },
      testInput: 'api on a 404 endpoint',
      testOutput: 'throws Error with status 404',
    },
    {
      slug: 'js-safe-storage',
      title: 'Storage That Never Throws',
      topicSlug: 'browser-storage',
      moduleIndex: 3,
      difficulty: 'EASY' as const,
      xpReward: 110,
      description:
        'Write `storageGet(key, fallback)` that reads JSON from localStorage and returns `fallback` for a missing key, for corrupt JSON, or when storage itself is unavailable. It must never throw.',
      descriptionHi:
        '`storageGet(key, fallback)` likho jo localStorage se JSON padhe aur missing key, kharab JSON, ya storage hi band hone par `fallback` de. Wo kabhi throw na kare.',
      hints: [
        'getItem returns null for a missing key — handle that before parsing.',
        'JSON.parse throws on any leftover string that is not valid JSON.',
        'localStorage access itself can throw in private mode or with blocked cookies, so wrap the whole thing.',
      ],
      approach:
        'Wrap everything in try/catch. Read the raw string, return `fallback` if it is null, otherwise `JSON.parse` it. Any throw from either the storage access or the parse falls through to the same `fallback`.',
      approachHi:
        'Poora code try/catch mein rakho. Raw string padho, null ho to `fallback` do, warna `JSON.parse` karo. Storage access ya parse — kisi se bhi throw aaye to wahi `fallback` mil jata hai.',
      solutionExplanation:
        'Two independent failures are possible and both are common in production: an older app version may have written a different shape, and browser privacy settings can block storage entirely. Returning a fallback instead of throwing keeps a corrupt cached value from breaking the app on startup.',
      solutionExplanationHi:
        'Do alag failures ho sakti hain aur production mein dono aam hain: app ka purana version alag shape likh gaya ho sakta hai, aur browser ki privacy settings storage poori tarah rok sakti hain. Throw karne ke bajaye fallback dena kharab cached value ko startup par app todne se rokta hai.',
      starterCode: {
        javascript: 'function storageGet(key, fallback = null) {\n  // your code here\n}\n',
      },
      testInput: 'storageGet on a key holding "not json", fallback {a:0}',
      testOutput: '{a:0}',
    },
    {
      slug: 'js-form-submit',
      title: 'A Submit Handler That Does Its Job',
      topicSlug: 'forms-and-validation',
      moduleIndex: 3,
      difficulty: 'MEDIUM' as const,
      xpReward: 140,
      description:
        'Write `handleSubmit(form, send)` that prevents the default reload, skips sending when the form is invalid, disables the submit button while the request is in flight, and re-enables it even when `send` rejects.',
      descriptionHi:
        '`handleSubmit(form, send)` likho jo default reload roke, form invalid hone par bheje hi na, request chalte waqt submit button disable kare, aur `send` fail hone par bhi usse wapas enable kare.',
      hints: [
        'e.preventDefault() first, or the page reloads and your code never finishes.',
        'form.checkValidity() plus form.reportValidity() reuses the browser UI for free.',
        'Re-enable the button in a finally block so a rejected request does not leave it stuck.',
      ],
      approach:
        'Prevent the default, bail out via `checkValidity`/`reportValidity`, disable the button, read the fields with `FormData`, await `send`, and re-enable inside `finally`.',
      approachHi:
        'Default roko, `checkValidity`/`reportValidity` se bahar niklo, button disable karo, `FormData` se fields padho, `send` await karo, aur `finally` ke andar wapas enable karo.',
      solutionExplanation:
        'The finally block is the part people forget. Without it a failed network request leaves the button permanently disabled, so the user cannot retry and the form looks broken even though nothing is actually wrong.',
      solutionExplanationHi:
        'finally wala hissa hi log bhoolte hain. Uske bina fail hui network request button ko hamesha ke liye disabled chhod deti hai, isliye user dobara koshish nahi kar pata aur form toota lagta hai jabki asal mein kuch kharab nahi hai.',
      starterCode: {
        javascript: 'function handleSubmit(form, send) {\n  // your code here\n}\n',
      },
      testInput: 'submit with send() rejecting',
      testOutput: 'button re-enabled after the failure',
    },
    {
      slug: 'js-safe-link',
      title: 'Block javascript: URLs',
      topicSlug: 'web-security-basics',
      moduleIndex: 3,
      difficulty: 'HARD' as const,
      xpReward: 170,
      description:
        'Write `safeHref(url)` that returns the URL when its protocol is http, https or mailto, and `"#"` for anything else — including `javascript:`, `data:` and strings that are not valid URLs at all.',
      descriptionHi:
        '`safeHref(url)` likho jo protocol http, https ya mailto hone par URL de, aur baaki sab par `"#"` — `javascript:`, `data:` aur wo strings bhi jo valid URL hi nahi hain.',
      hints: [
        'new URL(url, location.origin) parses it and exposes .protocol.',
        'Allow-list the safe protocols rather than trying to block the dangerous ones.',
        'Invalid URLs throw, so wrap the parse in try/catch and fall back to "#".',
      ],
      approach:
        'Parse with `new URL`, then check `u.protocol` against an allow-list of `http:`, `https:` and `mailto:`. Return `"#"` for anything else, and catch parse failures to return `"#"` as well.',
      approachHi:
        '`new URL` se parse karo, phir `u.protocol` ko `http:`, `https:` aur `mailto:` ki allow-list se check karo. Baaki sab par `"#"` do, aur parse fail hone par bhi `"#"` return karo.',
      solutionExplanation:
        'A javascript: URL in an href executes on click, so an unvalidated user-supplied link is an XSS vector even without innerHTML. Allow-listing is essential here: a deny-list will always miss an encoding trick or a protocol nobody thought of.',
      solutionExplanationHi:
        'href mein javascript: URL click par chal jata hai, isliye bina validate ki gayi user link innerHTML ke bina bhi XSS ka rasta hai. Yahan allow-list zaroori hai: deny-list hamesha koi encoding trick ya aisa protocol chhod degi jiske baare mein kisi ne socha hi nahi.',
      starterCode: {
        javascript: 'function safeHref(url) {\n  // your code here\n}\n',
      },
      testInput: 'safeHref("javascript:alert(1)") + "," + safeHref("https://a.com/")',
      testOutput: '#,https://a.com/',
    },
    {
      slug: 'js-module-singleton',
      title: 'A Module Is Already a Singleton',
      topicSlug: 'es-modules',
      moduleIndex: 4,
      difficulty: 'MEDIUM' as const,
      xpReward: 130,
      description:
        'Write `createStore()` returning an object with `get(key)` and `set(key, value)` backed by a private Map. Two separate calls must produce two INDEPENDENT stores — proving a factory differs from the module-level singleton a bare export would give you.',
      descriptionHi:
        '`createStore()` likho jo `get(key)` aur `set(key, value)` wala object de, jiske peeche private Map ho. Do alag calls se do ALAG stores bane — jisse sabit ho ki factory us module-level singleton se alag hai jo seedha export dene par milta.',
      hints: [
        'Declare the Map inside the function so each call creates a fresh one.',
        'Return only the methods; the Map itself must stay unreachable.',
        'If you declared the Map at module level instead, every caller would share it — that is the singleton case.',
      ],
      approach:
        'Declare `const data = new Map()` inside `createStore` and return `{ get, set }` closing over it. Each invocation creates a new Map, so the two stores never share state.',
      approachHi:
        '`createStore` ke andar `const data = new Map()` declare karo aur uske upar closure banate hue `{ get, set }` return karo. Har call naya Map banati hai, isliye dono stores kabhi state share nahi karte.',
      solutionExplanation:
        'A module-level export is evaluated once and cached, so every importer shares one instance. Moving the state inside a factory function gives each caller its own closure instead. Knowing which you want is the difference between shared config and isolated state.',
      solutionExplanationHi:
        'Module-level export ek baar evaluate hokar cache ho jata hai, isliye har importer ek hi instance share karta hai. State ko factory function ke andar le jane se har caller ko apna closure milta hai. Aapko kaunsa chahiye, yahi jaanna shared config aur alag state ka fark hai.',
      starterCode: {
        javascript: 'function createStore() {\n  // your code here\n}\n',
      },
      testInput: 'const a=createStore(),b=createStore(); a.set("k",1); String(b.get("k"))',
      testOutput: 'undefined',
    },
    {
      slug: 'js-observer-store',
      title: 'Build an Observable Store',
      topicSlug: 'design-patterns',
      moduleIndex: 4,
      difficulty: 'HARD' as const,
      xpReward: 180,
      description:
        'Implement `createStore(initial)` with `getState()`, `setState(patch)` and `subscribe(fn)`. Every subscriber must be called with the new state on each change, and `subscribe` must return a function that removes that subscriber.',
      descriptionHi:
        '`createStore(initial)` banao jisme `getState()`, `setState(patch)` aur `subscribe(fn)` hon. Har badlav par har subscriber ko nayi state ke saath bulaya jaye, aur `subscribe` aisa function de jo us subscriber ko hata de.',
      hints: [
        'Keep subscribers in a Set — it handles duplicates and removal cleanly.',
        'setState should merge the patch: { ...state, ...patch }, then notify everyone.',
        'Return () => subs.delete(fn) from subscribe so callers can clean up.',
      ],
      approach:
        'Hold state and a `Set` of subscribers in a closure. `setState` merges the patch into a new state object and then iterates the set, calling each subscriber. `subscribe` adds the function and returns a closure that deletes it.',
      approachHi:
        'State aur subscribers ka ek `Set` closure mein rakho. `setState` patch ko nayi state object mein mila deta hai aur phir set par chalkar har subscriber ko bulata hai. `subscribe` function add karke aisa closure deta hai jo usse delete kar de.',
      solutionExplanation:
        'This is the Observer pattern and it is essentially Redux in a few lines. Returning the unsubscribe function is the detail people miss: without it the store keeps a reference to every callback forever, holding each one closure alive and leaking memory in a long-running app.',
      solutionExplanationHi:
        'Ye Observer pattern hai aur kuch lines mein lagbhag Redux hi hai. Unsubscribe function return karna wo baat hai jo log chhod dete hain: uske bina store har callback ka reference hamesha rakhta hai, har closure zinda rehta hai aur lambe chalne wale app mein memory leak hoti hai.',
      starterCode: {
        javascript: 'function createStore(initial) {\n  // your code here\n}\n',
      },
      testInput: 'subscribe, setState twice, unsubscribe, setState again',
      testOutput: 'subscriber called exactly twice',
    },
    {
      slug: 'js-debounce',
      title: 'Implement debounce',
      topicSlug: 'performance-optimisation',
      moduleIndex: 4,
      difficulty: 'MEDIUM' as const,
      xpReward: 150,
      description:
        'Write `debounce(fn, delay)` that delays calling `fn` until `delay` ms have passed with no further calls. Rapid repeated calls must result in exactly ONE execution, using the arguments from the LAST call.',
      descriptionHi:
        '`debounce(fn, delay)` likho jo `fn` ko tab tak taale jab tak `delay` ms bina nayi call ke na guzar jayein. Teji se ki gayi kai calls se bilkul EK execution ho, aur AAKHRI call ke arguments use hon.',
      hints: [
        'Store the timer id in a closure so it survives between calls.',
        'clearTimeout the previous timer at the start of every call.',
        'Pass the latest args into setTimeout so the final call wins.',
      ],
      approach:
        'Keep `let timer` in the closure. On each invocation call `clearTimeout(timer)` to cancel the pending run, then `timer = setTimeout(() => fn(...args), delay)`. Only the last scheduled call survives the quiet period.',
      approachHi:
        'Closure mein `let timer` rakho. Har call par pehle `clearTimeout(timer)` karke pending run rad karo, phir `timer = setTimeout(() => fn(...args), delay)`. Khamoshi ke daur mein sirf aakhri schedule ki gayi call bachti hai.',
      solutionExplanation:
        'The closure is what makes this work: the timer id must persist between calls, and a plain local variable inside the returned function would be recreated each time. This is also why the debounced function must be created once, outside the event handler.',
      solutionExplanationHi:
        'Closure hi ise chalata hai: timer id calls ke beech bacha rehna chahiye, aur return kiye function ke andar simple local variable har baar naya ban jata. Isiliye debounced function ek baar, event handler ke bahar banana zaroori hai.',
      starterCode: {
        javascript: 'function debounce(fn, delay) {\n  // your code here\n}\n',
      },
      testInput: 'call debounced 3 times rapidly with 1, 2, 3',
      testOutput: 'fn called once with 3',
    },
    {
      slug: 'js-read-stack-trace',
      title: 'Read the Error, Not the Code',
      topicSlug: 'debugging',
      moduleIndex: 4,
      difficulty: 'EASY' as const,
      xpReward: 110,
      description:
        'Write `describeError(fn)` that runs `fn`, catches whatever it throws, and returns `{ name, message, line }` where `line` is the first stack frame. It must return `null` when `fn` does not throw.',
      descriptionHi:
        '`describeError(fn)` likho jo `fn` chalaye, jo bhi throw ho use catch kare, aur `{ name, message, line }` de jisme `line` pehla stack frame ho. `fn` throw na kare to `null` de.',
      hints: [
        'err.name gives the type, err.message gives the description.',
        'err.stack is a multi-line string; split on newlines and take index 1 for the throwing frame.',
        'Return null from the try block after fn() succeeds.',
      ],
      approach:
        'Wrap `fn()` in try/catch. In the catch, read `err.name` and `err.message`, then take `err.stack.split("\\n")[1].trim()` as the frame. Return `null` at the end of the try block for the non-throwing case.',
      approachHi:
        '`fn()` ko try/catch mein rakho. Catch mein `err.name` aur `err.message` padho, phir frame ke liye `err.stack.split("\\n")[1].trim()` lo. Throw na hone wale case ke liye try block ke ant mein `null` return karo.',
      solutionExplanation:
        'A stack trace carries three separable facts: what type of failure, a human description, and the exact location plus the call path that reached it. Pulling them apart deliberately is the habit that turns an intimidating red block in the console into three useful pieces of information.',
      solutionExplanationHi:
        'Stack trace mein teen alag tathya hote hain: failure ka type, insaani vivaran, aur exact jagah ke saath wahan pahunchne ka call path. Inhe jaan-boojhkar alag karna wo aadat hai jo console ke daraane wale laal block ko teen kaam ki jaankari mein badal deti hai.',
      starterCode: {
        javascript: 'function describeError(fn) {\n  // your code here\n}\n',
      },
      testInput: 'describeError(() => null.x).name',
      testOutput: 'TypeError',
    },
    {
      slug: 'js-write-tests',
      title: 'Test the Edges',
      topicSlug: 'testing-with-jest',
      moduleIndex: 4,
      difficulty: 'MEDIUM' as const,
      xpReward: 150,
      description:
        'Given `calculateTotal(items, discount = 0)`, write `runTests()` returning an array of `{ name, passed }` results covering: an empty cart, one item, several items, a zero discount and a 100% discount.',
      descriptionHi:
        '`calculateTotal(items, discount = 0)` diya hai — `runTests()` likho jo `{ name, passed }` results ki array de aur cover kare: khaali cart, ek item, kai items, zero discount aur 100% discount.',
      hints: [
        'Each case is Arrange, Act, Assert: build the input, call the function, compare the result.',
        'The empty cart and the 100% discount are the edges most likely to be wrong.',
        'Compare numbers with === ; if you were comparing objects you would need a deep equality check.',
      ],
      approach:
        'Build an array of cases, each with a name, an input and an expected value. Map over them calling `calculateTotal` and comparing to the expectation, returning `{ name, passed }` for each.',
      approachHi:
        'Cases ki array banao, har ek mein naam, input aur expected value ho. Unpar map karke `calculateTotal` bulao aur expectation se compare karo, har ek ke liye `{ name, passed }` do.',
      solutionExplanation:
        'The happy path usually already works, because it is what you wrote the function for. Bugs live at the edges: empty collections, zero, the maximum value, and null. Naming each case is what makes a failure report tell you which behaviour broke without reading any code.',
      solutionExplanationHi:
        'Happy path aksar pehle se chalta hai, kyunki function usi ke liye likha gaya tha. Bugs kinaaron par rehte hain: khaali collections, zero, sabse badi value, aur null. Har case ko naam dena hi failure report ko itna kaam ka banata hai ki bina code padhe pata chal jaye kaunsa behaviour toota.',
      starterCode: {
        javascript: 'function runTests() {\n  // your code here\n}\n',
      },
      testInput: 'runTests().every(t => t.passed)',
      testOutput: 'true',
    },
    {
      slug: 'js-semver-range',
      title: 'Which Versions Does This Range Allow?',
      topicSlug: 'tooling-and-npm',
      moduleIndex: 4,
      difficulty: 'MEDIUM' as const,
      xpReward: 140,
      description:
        'Write `satisfies(range, version)` supporting three forms: `"^1.2.3"` (any 1.x.x at or above 1.2.3), `"~1.2.3"` (any 1.2.x at or above 1.2.3) and `"1.2.3"` (exactly that version).',
      descriptionHi:
        '`satisfies(range, version)` likho jo teen roop sambhale: `"^1.2.3"` (1.2.3 se upar ka koi bhi 1.x.x), `"~1.2.3"` (1.2.3 se upar ka koi bhi 1.2.x) aur `"1.2.3"` (bilkul wahi version).',
      hints: [
        'Split both the range and the version on "." into major, minor and patch numbers.',
        'For ^ the major must match; for ~ both major and minor must match.',
        'In both cases the version must also be greater than or equal to the base — compare numerically, not as strings.',
      ],
      approach:
        'Strip the leading `^` or `~` and split both strings into numeric triples. For `^` require an equal major; for `~` require equal major and minor. Then compare the triples numerically to confirm the version is not below the base.',
      approachHi:
        'Shuruaati `^` ya `~` hatao aur dono strings ko numeric teen-hisson mein baanto. `^` ke liye major barabar chahiye; `~` ke liye major aur minor dono. Phir teen-hisson ko numerically compare karke pakka karo ki version base se neeche nahi hai.',
      solutionExplanation:
        'Comparing versions as strings is the trap here: "1.10.0" sorts before "1.9.0" lexicographically but is actually newer. Splitting into numbers and comparing part by part is what npm itself does, and it is why a caret never crosses a major boundary — that boundary is the promise that nothing broke.',
      solutionExplanationHi:
        'Yahan jaal hai versions ko string ki tarah compare karna: "1.10.0" lexicographically "1.9.0" se pehle aata hai par asal mein naya hai. Numbers mein baantkar hissa-dar-hissa compare karna wahi hai jo npm khud karta hai, aur isiliye caret major seema kabhi paar nahi karta — wo seema hi ye waada hai ki kuch toota nahi.',
      starterCode: {
        javascript: 'function satisfies(range, version) {\n  // your code here\n}\n',
      },
      testInput: 'satisfies("^1.2.3","1.9.0") + "," + satisfies("^1.2.3","2.0.0")',
      testOutput: 'true,false',
    },
    {
      slug: 'js-slugify',
      title: 'Turn a Title Into a URL Slug',
      topicSlug: 'strings-and-text',
      moduleIndex: 0,
      difficulty: 'MEDIUM' as const,
      xpReward: 120,
      description:
        'Write \`slugify(title)\` turning "My First Blog Post!" into "my-first-blog-post" — lowercase, punctuation removed, spaces collapsed into single dashes, and no dash at either end.',
      descriptionHi:
        '\`slugify(title)\` likho jo "My First Blog Post!" ko "my-first-blog-post" banaye — chhote akshar, punctuation hata do, spaces ek dash mein badlo, aur dono kinaaron par dash na ho.',
      hints: [
        'Chain the steps: lowercase, trim, strip punctuation, then collapse whitespace into dashes.',
        'Every string method returns a NEW string, so you must chain or reassign at each step.',
        'A regex such as /[^a-z0-9 -]/g removes anything that is not a letter, digit, space or dash.',
      ],
      approach:
        'Chain \`.toLowerCase().trim()\`, remove disallowed characters with a regex, then replace runs of whitespace with a single dash. Because strings are immutable, each step returns a new string and the chain is what carries the result forward.',
      approachHi:
        '\`.toLowerCase().trim()\` chain karo, regex se mana characters hatao, phir whitespace ke silsile ko ek dash se badlo. Strings immutable hain isliye har step nayi string deta hai, aur chain hi result aage le jaati hai.',
      solutionExplanation:
        'The order matters. Lowercasing first means the stripping regex only needs a lowercase range, and collapsing whitespace last means punctuation removal cannot leave behind double spaces that would become double dashes.',
      solutionExplanationHi:
        'Kram matter karta hai. Pehle lowercase karne se hataane wale regex ko sirf lowercase range chahiye, aur whitespace sabse aakhir mein collapse karne se punctuation hataane ke baad bache double spaces double dash nahi ban paate.',
      starterCode: { javascript: 'function slugify(title) {\\n  // your code here\\n}\\n' },
      testInput: 'slugify("My First Blog Post!")',
      testOutput: 'my-first-blog-post',
    },
    {
      slug: 'js-money-add',
      title: 'Add Money Without Losing a Paisa',
      topicSlug: 'numbers-and-math',
      moduleIndex: 0,
      difficulty: 'MEDIUM' as const,
      xpReward: 140,
      description:
        'Write \`addMoney(a, b)\` taking rupee amounts such as 19.99 and 0.01 and returning an exact total. \`addMoney(19.99, 0.01)\` must equal exactly 20, which plain floating-point addition does not.',
      descriptionHi:
        '\`addMoney(a, b)\` likho jo 19.99 aur 0.01 jaisi rupaye ki rakam le aur bilkul theek total de. \`addMoney(19.99, 0.01)\` bilkul 20 hona chahiye, jo simple floating-point addition nahi deta.',
      hints: [
        'Convert both amounts to paise with Math.round(x * 100) so you are adding whole numbers.',
        'Add the integers, then divide by 100 only at the very end.',
        'The Math.round on the way in matters: 19.99 * 100 is 1998.9999999999998, not 1999.',
      ],
      approach:
        'Convert each amount to integer paise with \`Math.round(x * 100)\`, add those integers, then divide the total by 100. All arithmetic happens in whole numbers, so no floating-point drift can accumulate.',
      approachHi:
        'Har rakam ko \`Math.round(x * 100)\` se integer paise banao, un integers ko jodo, phir total ko 100 se divide karo. Poora ganit poore numbers mein hota hai, isliye koi floating-point drift jama hi nahi hoti.',
      solutionExplanation:
        'Binary floating point cannot represent 0.01 exactly, so decimal addition drifts. Working in the smallest indivisible unit as integers removes the problem entirely — which is exactly why every payment API accepts amounts in paise or cents rather than rupees or dollars.',
      solutionExplanationHi:
        'Binary floating point 0.01 ko theek se nahi rakh sakta, isliye decimal addition mein farak aa jata hai. Sabse chhoti na-batne-yogya ikai mein integers ki tarah kaam karne se samasya poori tarah khatam ho jati hai — aur isiliye har payment API rakam rupaye ya dollar ke bajaye paise ya cents mein leta hai.',
      starterCode: { javascript: 'function addMoney(a, b) {\\n  // your code here\\n}\\n' },
      testInput: 'addMoney(19.99, 0.01) === 20',
      testOutput: 'true',
    },
    {
      slug: 'js-bank-account',
      title: 'A Class Whose Rules Cannot Be Broken',
      topicSlug: 'classes-and-oop',
      moduleIndex: 1,
      difficulty: 'MEDIUM' as const,
      xpReward: 150,
      description:
        'Build a \`BankAccount\` class with a private \`#balance\`, a \`deposit(n)\` that rejects non-positive amounts, a \`withdraw(n)\` that rejects overdrafts, and a \`balance\` getter with NO setter — so the balance can never be assigned directly.',
      descriptionHi:
        '\`BankAccount\` class banao jisme private \`#balance\` ho, \`deposit(n)\` jo non-positive rakam mana kare, \`withdraw(n)\` jo overdraft mana kare, aur bina setter wala \`balance\` getter — taaki balance kabhi seedhe assign na ho sake.',
      hints: [
        'A # field is enforced by the language: reading it from outside the class is a SyntaxError.',
        'A getter with no matching setter makes assignment a silent no-op.',
        'Throw from deposit and withdraw rather than returning false, so the caller cannot ignore the failure.',
      ],
      approach:
        'Declare \`#balance = 0\` as a private field. Validate inside \`deposit\` and \`withdraw\` and throw on invalid input. Expose only a \`get balance()\`, so reading works while assignment does nothing.',
      approachHi:
        '\`#balance = 0\` ko private field ki tarah declare karo. \`deposit\` aur \`withdraw\` ke andar jaanch karo aur galat input par throw karo. Sirf \`get balance()\` do, taaki padhna chale par assign karne se kuch na ho.',
      solutionExplanation:
        'Because there is no path to the private field from outside the class, the checks inside deposit and withdraw are the only way the value can ever change. That is the difference between a rule and a suggestion — an underscore-prefixed field can simply be overwritten by any caller.',
      solutionExplanationHi:
        'Chunki class ke bahar se us private field tak koi rasta hai hi nahi, deposit aur withdraw ki jaanch hi ekmatra tarika hai jisse value badal sakti hai. Rule aur sujhav ka yahi fark hai — underscore wali field to koi bhi caller overwrite kar sakta hai.',
      starterCode: { javascript: 'class BankAccount {\\n  // your code here\\n}\\n' },
      testInput: 'const a = new BankAccount(); a.deposit(100); a.balance = 9999; a.balance',
      testOutput: '100',
    },
    {
      slug: 'js-lazy-images',
      title: 'Lazy-Load Images on Scroll',
      topicSlug: 'modern-web-apis',
      moduleIndex: 3,
      difficulty: 'HARD' as const,
      xpReward: 170,
      description:
        'Write \`lazyLoad(selector)\` using IntersectionObserver: each matching image should copy its \`data-src\` into \`src\` only when it is about to enter the viewport, and must stop being observed once loaded.',
      descriptionHi:
        'IntersectionObserver se \`lazyLoad(selector)\` likho: har matching image apna \`data-src\` tabhi \`src\` mein daale jab wo viewport mein aane wali ho, aur load hote hi observe hona band ho jaye.',
      hints: [
        'rootMargin: "200px" starts the download just before the image scrolls into view.',
        'Check entry.isIntersecting — the callback also fires when an element leaves the viewport.',
        'Call observer.unobserve(entry.target) after loading so the same image is never processed twice.',
      ],
      approach:
        'Create one IntersectionObserver with \`rootMargin: "200px"\`. In the callback skip entries whose \`isIntersecting\` is false, otherwise copy \`dataset.src\` into \`src\` and call \`unobserve\` on that element. Observe every element matching the selector.',
      approachHi:
        'Ek IntersectionObserver banao \`rootMargin: "200px"\` ke saath. Callback mein jinka \`isIntersecting\` false hai unhe chhodo, warna \`dataset.src\` ko \`src\` mein daalo aur us element par \`unobserve\` bulao. Selector se match hone wale har element ko observe karo.',
      solutionExplanation:
        'A scroll handler would run hundreds of times a second on the main thread and force a layout read each time to decide visibility. IntersectionObserver is computed by the browser off the main thread and calls back only when the intersection state actually changes, which makes it both simpler to write and dramatically cheaper to run.',
      solutionExplanationHi:
        'Scroll handler main thread par second mein saikdon baar chalta aur har baar visibility tay karne ke liye layout padhta. IntersectionObserver browser main thread ke bahar calculate karta hai aur tabhi callback deta hai jab intersection sach mein badalti hai, isliye wo likhne mein saral bhi hai aur chalane mein bahut sasta bhi.',
      starterCode: { javascript: 'function lazyLoad(selector) {\\n  // your code here\\n}\\n' },
      testInput: 'an image scrolling into view',
      testOutput: 'src set from data-src, then unobserved',
    },
  ];

  let problemCount = 0;
  for (const problemData of problems) {
    const parentModule = createdModules[problemData.moduleIndex];
    if (!parentModule) throw new Error(`No module at index ${problemData.moduleIndex}`);

    // Topics are matched by slug, not position, so inserting a lesson anywhere
    // in a module does not silently re-point every problem after it.
    const parentTopic = createdTopics.find((t) => t.slug === problemData.topicSlug);
    if (!parentTopic) throw new Error(`No topic with slug ${problemData.topicSlug}`);

    const problem = await prisma.courseProblem.upsert({
      where: { courseId_slug: { courseId: course.id, slug: problemData.slug } },
      create: {
        courseId: course.id,
        moduleId: parentModule.id,
        topicId: parentTopic.id,
        slug: problemData.slug,
        title: problemData.title,
        category: 'JavaScript',
        difficulty: problemData.difficulty,
        description: problemData.description,
        descriptionHi: problemData.descriptionHi,
        hints: problemData.hints,
        approach: problemData.approach,
        approachHi: problemData.approachHi,
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        solutionExplanation: problemData.solutionExplanation,
        solutionExplanationHi: problemData.solutionExplanationHi,
        starterCode: problemData.starterCode,
        xpReward: problemData.xpReward,
        order: problemCount,
      },
      update: {
        title: problemData.title,
        difficulty: problemData.difficulty,
        description: problemData.description,
        descriptionHi: problemData.descriptionHi,
        hints: problemData.hints,
        approach: problemData.approach,
        approachHi: problemData.approachHi,
        solutionExplanation: problemData.solutionExplanation,
        solutionExplanationHi: problemData.solutionExplanationHi,
        starterCode: problemData.starterCode,
        xpReward: problemData.xpReward,
      },
    });

    // Add a sample test case for each problem, driven by the problem's own input/output.
    await prisma.courseProblemTestCase.upsert({
      where: { id: `${problem.id}-tc1` },
      create: {
        id: `${problem.id}-tc1`,
        problemId: problem.id,
        input: problemData.testInput,
        expectedOutput: problemData.testOutput,
        isSample: true,
        order: 1,
      },
      update: {
        input: problemData.testInput,
        expectedOutput: problemData.testOutput,
      },
    });

    problemCount++;
  }

  /*
   * Prune anything the seed no longer defines.
   *
   * Upserts alone only ever add, so a renamed module or a retired lesson would
   * linger in the database forever and still show up in the sidebar. Deleting
   * by "not in the current seed set" keeps the course exactly what this file
   * says it is. Cascades take the orphaned topics and problems with the module.
   */
  await prisma.courseProblem.deleteMany({
    where: { courseId: course.id, slug: { notIn: problems.map((p) => p.slug) } },
  });
  await prisma.courseTopic.deleteMany({
    where: { courseId: course.id, slug: { notIn: topics.map((t) => t.slug) } },
  });
  await prisma.courseModule.deleteMany({
    where: { courseId: course.id, slug: { notIn: modules.map((m) => m.slug) } },
  });

  // Create badges
  const badges = [
    {
      slug: 'first-step',
      name: 'First Step',
      description: 'Solve your first JavaScript problem',
      icon: '👣',
      category: 'achievement',
      requirementValue: 1,
      xpReward: 50,
    },
    {
      slug: 'closure-master',
      name: 'Closure Master',
      description: 'Master closures by solving closure problems',
      icon: '🔒',
      category: 'mastery',
      requirementValue: 5,
      xpReward: 200,
    },
    {
      slug: 'async-expert',
      name: 'Async Expert',
      description: 'Complete all async/await problems',
      icon: '⚡',
      category: 'mastery',
      requirementValue: 10,
      xpReward: 300,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      create: badge,
      update: badge,
    });
  }

  return {
    courses: 1,
    modules: createdModules.length,
    topics: createdTopics.length,
    problems: problemCount,
  };
}

/**
 * CSS & HTML course.
 *
 * Structured the same way as the JavaScript course so both render through the
 * same lesson page, but its examples carry `preview` HTML instead of text
 * output — a visual subject has to be seen to be understood.
 */
async function seedCssCourse(): Promise<{ modules: number; topics: number }> {
  const courseData = {
    slug: 'css-html-complete',
    name: 'CSS & HTML Complete Course',
    nameHi: 'CSS & HTML Complete Course - Dikhne Wala Sab Kuch',
    description:
      'Build pages that look right and feel alive. Every lesson starts with something broken and fixes it — structure, layout, responsiveness, and motion.',
    descriptionHi:
      'Aise pages banao jo sahi dikhein aur zinda lagein. Har lesson kisi tooti hui cheez se shuru hokar use theek karta hai — structure, layout, responsiveness aur motion.',
    icon: '🎨',
    color: '#8B5CF6',
    level: 'beginner' as const,
    totalXpReward: 4000,
    estimatedHours: 90,
    maxDifficulty: 'HARD' as const,
    order: 1,
    isPublished: true,
  };

  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    create: courseData,
    update: courseData,
  });

  const modules = [
    {
      slug: 'css-module-1-html',
      name: 'Module 1: HTML — The Skeleton',
      nameHi: 'Module 1: HTML — Dhaancha',
      description: 'Labelled boxes inside boxes: structure, nesting, forms and meaning.',
      descriptionHi: 'Dabbon ke andar label wale dabbe: structure, nesting, forms aur matlab.',
      order: 1,
    },
    {
      slug: 'css-module-2-basics',
      name: 'Module 2: CSS Basics',
      nameHi: 'Module 2: CSS Ki Buniyaad',
      description:
        'Selectors, the cascade, the box model and units — the four things behind almost every "why is my CSS not working?" moment.',
      descriptionHi:
        'Selectors, cascade, box model aur units — lagbhag har "meri CSS kyun nahi chal rahi?" ke peeche yahi chaar cheezein hain.',
      order: 2,
    },
    {
      slug: 'css-module-3-layout',
      name: 'Module 3: Layout',
      nameHi: 'Module 3: Layout',
      description:
        'Normal flow, flexbox and grid — arranging real interfaces instead of single boxes.',
      descriptionHi:
        'Normal flow, flexbox aur grid — akeli boxes ke bajaye asli interfaces lagana.',
      order: 3,
    },
    {
      slug: 'css-module-4-responsive',
      name: 'Module 4: Responsive',
      nameHi: 'Module 4: Responsive',
      description:
        'Mobile-first media queries, fluid sizing with clamp(), and responsive images — one layout that genuinely works everywhere.',
      descriptionHi:
        'Mobile-first media queries, clamp() se fluid sizing, aur responsive images — ek layout jo sach mein har jagah chalta hai.',
      order: 4,
    },
    {
      slug: 'css-module-5-motion',
      name: 'Module 5: Motion',
      nameHi: 'Module 5: Motion',
      description:
        'Transitions, transforms and performance — the difference between a smooth animation and a stuttering one on a real device.',
      descriptionHi:
        'Transitions, transforms aur performance — asli device par smooth animation aur atakti hui animation ke beech ka fark.',
      order: 5,
    },
    {
      slug: 'css-module-6-pro',
      name: 'Module 6: Pro',
      nameHi: 'Module 6: Pro',
      description:
        'Custom properties, theming, and modern CSS — architecture that holds up at the scale of a real product.',
      descriptionHi:
        'Custom properties, theming, aur modern CSS — architecture jo asli product ke scale par tikta hai.',
      order: 6,
    },
  ];

  const createdModules = [];
  for (const moduleData of modules) {
    createdModules.push(
      await prisma.courseModule.upsert({
        where: { courseId_slug: { courseId: course.id, slug: moduleData.slug } },
        create: { courseId: course.id, ...moduleData },
        update: moduleData,
      }),
    );
  }

  const topics = [
    ...[...CSS_MODULE_1, ...CSS_MODULE_1B, ...CSS_MODULE_1C].map((lesson) => ({ ...lesson, moduleIndex: 0 })),
    ...[...CSS_MODULE_2, ...CSS_MODULE_2B, ...CSS_MODULE_2C].map((lesson) => ({
      ...lesson,
      moduleIndex: 1,
    })),
    ...[...CSS_MODULE_3, ...CSS_MODULE_3B].map((lesson) => ({ ...lesson, moduleIndex: 2 })),
    ...[...CSS_MODULE_4, ...CSS_MODULE_4B].map((lesson) => ({ ...lesson, moduleIndex: 3 })),
    ...[...CSS_MODULE_5, ...CSS_MODULE_5B].map((lesson) => ({ ...lesson, moduleIndex: 4 })),
    ...[...CSS_MODULE_6, ...CSS_MODULE_6B, ...CSS_MODULE_6C].map((lesson) => ({ ...lesson, moduleIndex: 5 })),
  ];

  const json = (v: unknown) => v as Prisma.InputJsonValue;
  const createdTopics = [];

  for (const lesson of topics) {
    const fields = {
      title: lesson.title,
      titleHi: lesson.titleHi,
      description: lesson.description,
      descriptionHi: lesson.descriptionHi,
      simple: lesson.simple,
      simpleHi: lesson.simpleHi,
      content: lesson.content,
      contentHi: lesson.contentHi,
      analogy: json(lesson.analogy ?? {}),
      examples: json(lesson.examples ?? []),
      mistakes: json(lesson.mistakes ?? []),
      realWorld: json(lesson.realWorld ?? []),
      interviewQA: json(lesson.interviewQA ?? []),
      exercises: json(lesson.exercises ?? []),
      keyTakeaways: lesson.keyTakeaways ?? [],
      keyTakeawaysHi: lesson.keyTakeawaysHi ?? [],
      difficulty: lesson.difficulty,
      duration: lesson.duration ?? 25,
      order: lesson.order,
    };

    const parentModule = createdModules[lesson.moduleIndex];
    if (!parentModule) throw new Error(`No module at index ${lesson.moduleIndex}`);

    createdTopics.push(
      await prisma.courseTopic.upsert({
        where: { courseId_slug: { courseId: course.id, slug: lesson.slug } },
        create: { courseId: course.id, moduleId: parentModule.id, slug: lesson.slug, ...fields },
        update: fields,
      }),
    );
  }

  // Same declarative prune as the JavaScript course.
  await prisma.courseTopic.deleteMany({
    where: { courseId: course.id, slug: { notIn: topics.map((t) => t.slug) } },
  });
  await prisma.courseModule.deleteMany({
    where: { courseId: course.id, slug: { notIn: modules.map((m) => m.slug) } },
  });

  return { modules: createdModules.length, topics: createdTopics.length };
}

async function seedTypeScriptCourse(): Promise<{ modules: number; topics: number }> {
  const courseData = {
    slug: 'typescript-complete',
    name: 'TypeScript Complete Course',
    nameHi: 'TypeScript Complete Course - Types Ke Saath Pro Bano',
    description:
      'JavaScript with a safety net. Every lesson opens with a bug that ships silently in plain JavaScript and shows exactly how TypeScript catches it before it ever runs.',
    descriptionHi:
      'JavaScript, ek safety net ke saath. Har lesson ek aise bug se shuru hota hai jo saadhi JavaScript mein chupchap ship ho jata hai, aur seedha dikhata hai TypeScript use chalne se pehle kaise pakadta hai.',
    icon: '🛡️',
    color: '#3178C6',
    level: 'intermediate' as const,
    totalXpReward: 4500,
    estimatedHours: 100,
    maxDifficulty: 'HARD' as const,
    order: 1,
    isPublished: true,
  };

  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    create: courseData,
    update: courseData,
  });

  const modules = [
    {
      slug: 'ts-module-1-basics',
      name: 'Module 1: Why TypeScript & The Basics',
      nameHi: 'Module 1: TypeScript Kyun & Bunyaad',
      description:
        'What TypeScript actually is, primitive types, inference, and the difference between a compile-time check and a runtime crash.',
      descriptionHi:
        'TypeScript asal mein hai kya, primitive types, inference, aur compile-time check aur runtime crash ka fark.',
      order: 1,
    },
    {
      slug: 'ts-module-2-objects',
      name: 'Module 2: Objects & Interfaces',
      nameHi: 'Module 2: Objects & Interfaces',
      description:
        'Naming a shape instead of copy-pasting it, and structural typing — the single most surprising thing about TypeScript for anyone coming from Java or C#.',
      descriptionHi:
        'Shape ko copy-paste karne ke bajaye naam dena, aur structural typing — TypeScript ke baare mein sabse chaunkaane wali baat un logon ke liye jo Java ya C# se aaye hain.',
      order: 2,
    },
    {
      slug: 'ts-module-3-unions',
      name: 'Module 3: Unions, Narrowing & Enums',
      nameHi: 'Module 3: Unions, Narrowing & Enums',
      description:
        'Naming the exact, finite set of valid values instead of accepting any string — literal types, discriminated unions, and enums.',
      descriptionHi:
        'Koi bhi string qubool karne ke bajaye valid values ka exact, khatam hone wala set naam dena — literal types, discriminated unions, aur enums.',
      order: 3,
    },
    {
      slug: 'ts-module-4-generics',
      name: 'Module 4: Generics',
      nameHi: 'Module 4: Generics',
      description:
        'Writing one function that works for any type while still remembering exactly which type it was given — the difference between "any" and a true generic.',
      descriptionHi:
        'Ek aisa function likhna jo kisi bhi type ke liye chale, phir bhi bilkul yaad rakhte hue use kaunsa type diya gaya tha — "any" aur asli generic ke beech ka fark.',
      order: 4,
    },
    {
      slug: 'ts-module-5-utility-types',
      name: 'Module 5: Utility Types & Real-World TS',
      nameHi: 'Module 5: Utility Types & Real-World TS',
      description:
        'Deriving a related shape from an existing type instead of hand-copying it — Partial, Pick, Omit, Record, and typing real applications.',
      descriptionHi:
        'Haath se copy karne ke bajaye maujood type se ek jude shape nikaalna — Partial, Pick, Omit, Record, aur asli applications ko type karna.',
      order: 5,
    },
    {
      slug: 'ts-module-6-pro',
      name: 'Module 6: Pro',
      nameHi: 'Module 6: Pro',
      description:
        'The mechanism behind every utility type, and the tools for typing libraries and code TypeScript did not write itself.',
      descriptionHi:
        'Har utility type ke peeche ka mechanism, aur libraries aur aise code ko type karne ke auzaar jo TypeScript ne khud nahi likha.',
      order: 6,
    },
  ];

  const createdModules = [];
  for (const moduleData of modules) {
    createdModules.push(
      await prisma.courseModule.upsert({
        where: { courseId_slug: { courseId: course.id, slug: moduleData.slug } },
        create: { courseId: course.id, ...moduleData },
        update: moduleData,
      }),
    );
  }

  const topics = [
    ...[
      ...TS_MODULE_1,
      ...TS_MODULE_1_PART2,
      ...TS_MODULE_1_PART3,
      ...TS_MODULE_1_PART4,
    ].map((lesson) => ({ ...lesson, moduleIndex: 0 })),
    ...[...TS_MODULE_2, ...TS_MODULE_2_PART2, ...TS_MODULE_2_PART3].map((lesson) => ({
      ...lesson,
      moduleIndex: 1,
    })),
    ...[
      ...TS_MODULE_3,
      ...TS_MODULE_3_PART2,
      ...TS_MODULE_3_PART3,
      ...TS_MODULE_3_PART4,
    ].map((lesson) => ({ ...lesson, moduleIndex: 2 })),
    ...[...TS_MODULE_4, ...TS_MODULE_4_PART2].map((lesson) => ({ ...lesson, moduleIndex: 3 })),
    ...[...TS_MODULE_5, ...TS_MODULE_5_PART2, ...TS_MODULE_5_PART3].map((lesson) => ({
      ...lesson,
      moduleIndex: 4,
    })),
    ...[...TS_MODULE_6, ...TS_MODULE_6_PART2].map((lesson) => ({ ...lesson, moduleIndex: 5 })),
  ];

  const json = (v: unknown) => v as Prisma.InputJsonValue;
  const createdTopics = [];

  for (const lesson of topics) {
    const fields = {
      title: lesson.title,
      titleHi: lesson.titleHi,
      description: lesson.description,
      descriptionHi: lesson.descriptionHi,
      simple: lesson.simple,
      simpleHi: lesson.simpleHi,
      content: lesson.content,
      contentHi: lesson.contentHi,
      analogy: json(lesson.analogy ?? {}),
      examples: json(lesson.examples ?? []),
      mistakes: json(lesson.mistakes ?? []),
      realWorld: json(lesson.realWorld ?? []),
      interviewQA: json(lesson.interviewQA ?? []),
      exercises: json(lesson.exercises ?? []),
      keyTakeaways: lesson.keyTakeaways ?? [],
      keyTakeawaysHi: lesson.keyTakeawaysHi ?? [],
      difficulty: lesson.difficulty,
      duration: lesson.duration ?? 25,
      order: lesson.order,
    };

    const parentModule = createdModules[lesson.moduleIndex];
    if (!parentModule) throw new Error(`No module at index ${lesson.moduleIndex}`);

    createdTopics.push(
      await prisma.courseTopic.upsert({
        where: { courseId_slug: { courseId: course.id, slug: lesson.slug } },
        create: { courseId: course.id, moduleId: parentModule.id, slug: lesson.slug, ...fields },
        update: fields,
      }),
    );
  }

  // Same declarative prune as the other courses.
  await prisma.courseTopic.deleteMany({
    where: { courseId: course.id, slug: { notIn: topics.map((t) => t.slug) } },
  });
  await prisma.courseModule.deleteMany({
    where: { courseId: course.id, slug: { notIn: modules.map((m) => m.slug) } },
  });

  return { modules: createdModules.length, topics: createdTopics.length };
}

async function seedReactCourse(): Promise<{ modules: number; topics: number }> {
  const courseData = {
    slug: 'react-complete',
    name: 'React Complete Course',
    nameHi: 'React Complete Course - JS aur TS Dono Saath',
    description:
      'Every concept shown twice, back to back — plain JavaScript, then TypeScript — so you see exactly what changes and what stays the same, from your first component to production patterns.',
    descriptionHi:
      'Har concept do baar dikhaya gaya, ek ke baad ek — pehle saadhi JavaScript, phir TypeScript — taaki aap bilkul dekh sako kya badalta hai aur kya wahi rehta hai, apne pehle component se production patterns tak.',
    icon: '⚛️',
    color: '#61DAFB',
    level: 'intermediate' as const,
    totalXpReward: 5000,
    estimatedHours: 120,
    maxDifficulty: 'HARD' as const,
    order: 1,
    isPublished: true,
  };

  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    create: courseData,
    update: courseData,
  });

  const modules = [
    {
      slug: 'react-module-1-fundamentals',
      name: 'Module 1: React Fundamentals',
      nameHi: 'Module 1: React Ki Buniyaad',
      description:
        'JSX, components, and props — shown in JavaScript and TypeScript side by side with one toggle, so the delta between them is always visible.',
      descriptionHi:
        'JSX, components, aur props — JavaScript aur TypeScript dono mein ek toggle ke saath saath-saath dikhaaye gaye, taaki dono ka fark hamesha dikhta rahe.',
      order: 1,
    },
    {
      slug: 'react-module-2-state-events',
      name: 'Module 2: State & Events',
      nameHi: 'Module 2: State Aur Events',
      description:
        'useState in depth — immutable updates and functional updates — plus event handling and controlled forms, all shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'useState gehrai se — immutable updates aur functional updates — aur event handling aur controlled forms, sab JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 2,
    },
    {
      slug: 'react-module-3-effects',
      name: 'Module 3: Effects',
      nameHi: 'Module 3: Effects',
      description:
        'useEffect\'s mount/update/cleanup model, data fetching with loading and error states, and useRef — shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'useEffect ka mount/update/cleanup model, loading aur error states ke saath data fetching, aur useRef — JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 3,
    },
    {
      slug: 'react-module-4-hooks-performance',
      name: 'Module 4: Hooks & Performance',
      nameHi: 'Module 4: Hooks Aur Performance',
      description:
        'useMemo and useCallback — when they genuinely matter and when they are pointless overhead — plus custom hooks, useReducer, React 18\'s concurrent-rendering hooks useTransition and useDeferredValue, useSyncExternalStore/useId, and React 19\'s useOptimistic, shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'useMemo aur useCallback — kab sach mein matter karte hain aur kab bekaar overhead hain — aur custom hooks, useReducer, React 18 ke concurrent-rendering hooks useTransition aur useDeferredValue, useSyncExternalStore/useId, aur React 19 ka useOptimistic, JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 4,
    },
    {
      slug: 'react-module-5-patterns-architecture',
      name: 'Module 5: Patterns & Architecture',
      nameHi: 'Module 5: Patterns Aur Architecture',
      description:
        'The Context API, composition patterns, forms at scale, error boundaries, React Hook Form with Zod validation, multi-step wizard forms with dynamic field arrays, feature-based folder structure at scale, and CSS Modules/Tailwind/CSS-in-JS trade-offs — the architecture patterns real apps are built from, shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'Context API, composition patterns, badi scale ke forms, error boundaries, Zod validation ke saath React Hook Form, dynamic field arrays ke saath multi-step wizard forms, scale par feature-based folder structure, aur CSS Modules/Tailwind/CSS-in-JS trade-offs — wo architecture patterns jinse asli apps bante hain, JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 5,
    },
    {
      slug: 'react-module-6-pro',
      name: 'Module 6: Pro',
      nameHi: 'Module 6: Pro',
      description:
        'React Router, performance optimization, testing, Redux Toolkit, advanced TypeScript+React patterns, XSS/dangerouslySetInnerHTML security, auth token storage, CSRF protection, client env var exposure, list virtualization for long lists, and server-side rendering/hydration/Server Components — the final stretch from working developer to production-ready professional, shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'React Router, performance optimization, testing, Redux Toolkit, advanced TypeScript+React patterns, XSS/dangerouslySetInnerHTML security, auth token storage, CSRF protection, client env var exposure, long lists ke liye list virtualization, aur server-side rendering/hydration/Server Components — chalte developer se production-ready professional tak ka aakhri hissa, JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 6,
    },
  ];

  const createdModules = [];
  for (const moduleData of modules) {
    createdModules.push(
      await prisma.courseModule.upsert({
        where: { courseId_slug: { courseId: course.id, slug: moduleData.slug } },
        create: { courseId: course.id, ...moduleData },
        update: moduleData,
      }),
    );
  }

  const topics = [
    ...[...REACT_MODULE_1, ...REACT_MODULE_1_PART2, ...REACT_MODULE_1_PART3].map((lesson) => ({
      ...lesson,
      moduleIndex: 0,
    })),
    ...[...REACT_MODULE_2, ...REACT_MODULE_2_PART2, ...REACT_MODULE_2_PART3].map((lesson) => ({
      ...lesson,
      moduleIndex: 1,
    })),
    ...[...REACT_MODULE_3, ...REACT_MODULE_3_PART2, ...REACT_MODULE_3_PART3].map((lesson) => ({
      ...lesson,
      moduleIndex: 2,
    })),
    ...[...REACT_MODULE_4, ...REACT_MODULE_4_PART2, ...REACT_MODULE_4_PART3, ...REACT_MODULE_4_PART4, ...REACT_MODULE_4_PART5, ...REACT_MODULE_4_PART6].map((lesson) => ({
      ...lesson,
      moduleIndex: 3,
    })),
    ...[...REACT_MODULE_5, ...REACT_MODULE_5_PART2, ...REACT_MODULE_5_PART3, ...REACT_MODULE_5_PART4, ...REACT_MODULE_5_PART5, ...REACT_MODULE_5_PART6, ...REACT_MODULE_5_PART7, ...REACT_MODULE_5_PART8].map((lesson) => ({
      ...lesson,
      moduleIndex: 4,
    })),
    ...[...REACT_MODULE_6, ...REACT_MODULE_6_PART2, ...REACT_MODULE_6_PART3, ...REACT_MODULE_6_PART4, ...REACT_MODULE_6_PART5, ...REACT_MODULE_6_PART6, ...REACT_MODULE_6_PART7, ...REACT_MODULE_6_PART8, ...REACT_MODULE_6_PART9, ...REACT_MODULE_6_PART10, ...REACT_MODULE_6_PART11, ...REACT_MODULE_6_PART12, ...REACT_MODULE_6_PART13, ...REACT_MODULE_6_PART14].map((lesson) => ({
      ...lesson,
      moduleIndex: 5,
    })),
  ];

  const json = (v: unknown) => v as Prisma.InputJsonValue;
  const createdTopics = [];

  for (const lesson of topics) {
    const fields = {
      title: lesson.title,
      titleHi: lesson.titleHi,
      description: lesson.description,
      descriptionHi: lesson.descriptionHi,
      simple: lesson.simple,
      simpleHi: lesson.simpleHi,
      content: lesson.content,
      contentHi: lesson.contentHi,
      analogy: json(lesson.analogy ?? {}),
      examples: json(lesson.examples ?? []),
      mistakes: json(lesson.mistakes ?? []),
      realWorld: json(lesson.realWorld ?? []),
      interviewQA: json(lesson.interviewQA ?? []),
      exercises: json(lesson.exercises ?? []),
      keyTakeaways: lesson.keyTakeaways ?? [],
      keyTakeawaysHi: lesson.keyTakeawaysHi ?? [],
      difficulty: lesson.difficulty,
      duration: lesson.duration ?? 25,
      order: lesson.order,
    };

    const parentModule = createdModules[lesson.moduleIndex];
    if (!parentModule) throw new Error(`No module at index ${lesson.moduleIndex}`);

    createdTopics.push(
      await prisma.courseTopic.upsert({
        where: { courseId_slug: { courseId: course.id, slug: lesson.slug } },
        create: { courseId: course.id, moduleId: parentModule.id, slug: lesson.slug, ...fields },
        update: fields,
      }),
    );
  }

  // Same declarative prune as the other courses.
  await prisma.courseTopic.deleteMany({
    where: { courseId: course.id, slug: { notIn: topics.map((t) => t.slug) } },
  });
  await prisma.courseModule.deleteMany({
    where: { courseId: course.id, slug: { notIn: modules.map((m) => m.slug) } },
  });

  return { modules: createdModules.length, topics: createdTopics.length };
}

async function seedDsaCourse(): Promise<{ modules: number; topics: number }> {
  const courseData = {
    slug: 'dsa-complete',
    name: 'DSA Complete Course',
    nameHi: 'DSA Complete Course - Noob Se Pro Tak',
    description:
      'Data structures and algorithms taught as reusable patterns, not memorized solutions — every lesson starts with a broken, naive approach, shows exactly why it breaks down at real scale, and builds up to the pattern that fixes it, from your first Big-O analysis to graph algorithms and dynamic programming.',
    descriptionHi:
      'Data structures aur algorithms reusable patterns ki tarah sikhaaye gaye, yaad kiye gaye solutions ki tarah nahi — har lesson ek toote, naive approach se shuru hota hai, bilkul darsata hai ki ye asli scale par kyun tootta hai, aur us pattern tak banata hai jo ise theek karta hai, tumhaare pehle Big-O vishleshan se lekar graph algorithms aur dynamic programming tak.',
    icon: '🧩',
    color: '#F59E0B',
    level: 'beginner' as const,
    totalXpReward: 7000,
    estimatedHours: 160,
    maxDifficulty: 'HARD' as const,
    order: 6,
    isPublished: true,
  };

  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    create: courseData,
    update: courseData,
  });

  const modules = [
    {
      slug: 'dsa-module-1-foundations',
      name: 'Module 1: Foundations',
      nameHi: 'Module 1: Buniyaad',
      description:
        'Why data structures and algorithms matter, a repeatable framework for tackling any new problem, Big-O notation, analyzing loops and recursion, and the memory-level mechanics of arrays and strings.',
      descriptionHi:
        'Data structures aur algorithms kyun maayne rakhte hain, kisi bhi nayi problem se nipatne ke liye ek dohraaye-jaane-yogya framework, Big-O notation, loops aur recursion ka vishleshan, aur arrays aur strings ki memory-star ki mechanics.',
      order: 1,
    },
    {
      slug: 'dsa-module-2-arrays-strings-patterns',
      name: 'Module 2: Arrays & Strings Patterns',
      nameHi: 'Module 2: Arrays Aur Strings Patterns',
      description:
        'The reusable patterns that solve most array and string problems: two pointers, sliding window, prefix sums, and in-place manipulation.',
      descriptionHi:
        'Reusable patterns jo adhikaansh array aur string problems sulajhaate hain: two pointers, sliding window, prefix sums, aur in-place manipulation.',
      order: 2,
    },
    {
      slug: 'dsa-module-3-hashing',
      name: 'Module 3: Hashing',
      nameHi: 'Module 3: Hashing',
      description:
        'How hash tables actually work internally, collision resolution, HashSet vs HashMap, and when hashing beats sorting and searching outright.',
      descriptionHi:
        'Hash tables asal mein internally kaise kaam karte hain, collision resolution, HashSet vs HashMap, aur hashing kab sorting aur searching se poori tarah behtar hai.',
      order: 3,
    },
    {
      slug: 'dsa-module-4-linked-lists',
      name: 'Module 4: Linked Lists',
      nameHi: 'Module 4: Linked Lists',
      description:
        'Singly and doubly linked lists, fast-and-slow pointers for cycle detection, reversing a list, and merging sorted lists.',
      descriptionHi:
        'Singly aur doubly linked lists, cycle detection ke liye fast-and-slow pointers, ek list ko reverse karna, aur sorted lists ko merge karna.',
      order: 4,
    },
    {
      slug: 'dsa-module-5-stacks-queues',
      name: 'Module 5: Stacks & Queues',
      nameHi: 'Module 5: Stacks Aur Queues',
      description:
        'LIFO and FIFO fundamentals, circular queues and deques, the monotonic stack pattern, and implementing a queue with two stacks.',
      descriptionHi:
        'LIFO aur FIFO buniyaad, circular queues aur deques, monotonic stack pattern, aur do stacks se ek queue lagu karna.',
      order: 5,
    },
    {
      slug: 'dsa-module-6-recursion-backtracking',
      name: 'Module 6: Recursion & Backtracking',
      nameHi: 'Module 6: Recursion Aur Backtracking',
      description:
        'The call stack and base cases, common recursion pitfalls, backtracking for subsets and permutations, and bridging recursion into memoization.',
      descriptionHi:
        'Call stack aur base cases, aam recursion pitfalls, subsets aur permutations ke liye backtracking, aur recursion ko memoization mein jodna.',
      order: 6,
    },
    {
      slug: 'dsa-module-7-trees',
      name: 'Module 7: Trees',
      nameHi: 'Module 7: Trees',
      description:
        'Binary trees and traversals, BFS versus DFS, binary search trees, balanced-tree rotations conceptually, and tries.',
      descriptionHi:
        'Binary trees aur traversals, BFS versus DFS, binary search trees, balanced-tree rotations conceptually, aur tries.',
      order: 7,
    },
    {
      slug: 'dsa-module-8-heaps',
      name: 'Module 8: Heaps & Priority Queues',
      nameHi: 'Module 8: Heaps Aur Priority Queues',
      description:
        'Min-heaps and max-heaps, heapify/insert/extract, and priority-queue use cases like finding the kth largest element.',
      descriptionHi:
        'Min-heaps aur max-heaps, heapify/insert/extract, aur priority-queue use cases jaisa kth largest element dhoondhna.',
      order: 8,
    },
    {
      slug: 'dsa-module-9-graphs',
      name: 'Module 9: Graphs',
      nameHi: 'Module 9: Graphs',
      description:
        'Graph representations, BFS and DFS, topological sort, union-find, Dijkstra\'s shortest path, and cycle detection.',
      descriptionHi:
        'Graph representations, BFS aur DFS, topological sort, union-find, Dijkstra ka shortest path, aur cycle detection.',
      order: 9,
    },
    {
      slug: 'dsa-module-10-sorting-searching',
      name: 'Module 10: Sorting & Searching',
      nameHi: 'Module 10: Sorting Aur Searching',
      description:
        'Comparison sorts, merge sort and quicksort as divide-and-conquer, binary search and its variants, and non-comparison sorting.',
      descriptionHi:
        'Comparison sorts, divide-and-conquer ki tarah merge sort aur quicksort, binary search aur iske variants, aur non-comparison sorting.',
      order: 10,
    },
    {
      slug: 'dsa-module-11-dynamic-programming',
      name: 'Module 11: Dynamic Programming',
      nameHi: 'Module 11: Dynamic Programming',
      description:
        'Overlapping subproblems and optimal substructure, memoization versus tabulation, and the 1D, 2D, knapsack, and string-subsequence DP patterns.',
      descriptionHi:
        'Overlapping subproblems aur optimal substructure, memoization versus tabulation, aur 1D, 2D, knapsack, aur string-subsequence DP patterns.',
      order: 11,
    },
    {
      slug: 'dsa-module-12-greedy',
      name: 'Module 12: Greedy Algorithms',
      nameHi: 'Module 12: Greedy Algorithms',
      description:
        'When a greedy, locally-optimal choice actually produces a globally optimal answer, interval scheduling, and telling greedy problems apart from DP ones.',
      descriptionHi:
        'Ek greedy, locally-optimal chunaav asal mein kab ek globally optimal jawaab banaata hai, interval scheduling, aur greedy problems ko DP wali se alag pehchaanna.',
      order: 12,
    },
    {
      slug: 'dsa-module-13-bit-manipulation',
      name: 'Module 13: Bit Manipulation',
      nameHi: 'Module 13: Bit Manipulation',
      description:
        'Binary representation, bitwise operators, and the common bit tricks (checking, setting, clearing, counting bits) that show up across many other patterns.',
      descriptionHi:
        'Binary representation, bitwise operators, aur aam bit tricks (bits check karna, set karna, clear karna, ganna) jo kayi doosre patterns mein dikhte hain.',
      order: 13,
    },
    {
      slug: 'dsa-module-14-pro-interview-strategy',
      name: 'Module 14: Pro-Level Patterns & Interview Strategy',
      nameHi: 'Module 14: Pro-Level Patterns Aur Interview Strategy',
      description:
        'Recognizing which pattern a new, unfamiliar problem actually calls for, reasoning about time/space trade-offs at real scale, and a practical framework for a live technical interview.',
      descriptionHi:
        'Ye pehchaanna ki ek nayi, anjaan problem asal mein kaunsa pattern maangti hai, asli scale par time/space trade-offs ke baare mein tark karna, aur ek live technical interview ke liye ek vyaavahaarik framework.',
      order: 14,
    },
  ];

  const createdModules = [];
  for (const moduleData of modules) {
    createdModules.push(
      await prisma.courseModule.upsert({
        where: { courseId_slug: { courseId: course.id, slug: moduleData.slug } },
        create: { courseId: course.id, ...moduleData },
        update: moduleData,
      }),
    );
  }

  const topics = [
    ...[...DSA_MODULE_1, ...DSA_MODULE_1_PART2, ...DSA_MODULE_1_PART3, ...DSA_MODULE_1_PART4, ...DSA_MODULE_1_PART5, ...DSA_MODULE_1_PART6].map((lesson) => ({
      ...lesson,
      moduleIndex: 0,
    })),
    ...[...DSA_MODULE_2, ...DSA_MODULE_2_PART2, ...DSA_MODULE_2_PART3, ...DSA_MODULE_2_PART4].map((lesson) => ({
      ...lesson,
      moduleIndex: 1,
    })),
    ...[...DSA_MODULE_3, ...DSA_MODULE_3_PART2, ...DSA_MODULE_3_PART3, ...DSA_MODULE_3_PART4].map((lesson) => ({
      ...lesson,
      moduleIndex: 2,
    })),
    ...[...DSA_MODULE_4, ...DSA_MODULE_4_PART2, ...DSA_MODULE_4_PART3, ...DSA_MODULE_4_PART4, ...DSA_MODULE_4_PART5].map((lesson) => ({
      ...lesson,
      moduleIndex: 3,
    })),
    ...[...DSA_MODULE_5, ...DSA_MODULE_5_PART2, ...DSA_MODULE_5_PART3, ...DSA_MODULE_5_PART4].map((lesson) => ({
      ...lesson,
      moduleIndex: 4,
    })),
    ...[...DSA_MODULE_6, ...DSA_MODULE_6_PART2, ...DSA_MODULE_6_PART3, ...DSA_MODULE_6_PART4].map((lesson) => ({
      ...lesson,
      moduleIndex: 5,
    })),
    ...[...DSA_MODULE_7, ...DSA_MODULE_7_PART2, ...DSA_MODULE_7_PART3, ...DSA_MODULE_7_PART4, ...DSA_MODULE_7_PART5].map((lesson) => ({
      ...lesson,
      moduleIndex: 6,
    })),
    ...[...DSA_MODULE_8, ...DSA_MODULE_8_PART2, ...DSA_MODULE_8_PART3, ...DSA_MODULE_8_PART4].map((lesson) => ({
      ...lesson,
      moduleIndex: 7,
    })),
    ...[...DSA_MODULE_9, ...DSA_MODULE_9_PART2, ...DSA_MODULE_9_PART3, ...DSA_MODULE_9_PART4, ...DSA_MODULE_9_PART5, ...DSA_MODULE_9_PART6].map((lesson) => ({
      ...lesson,
      moduleIndex: 8,
    })),
  ];

  const json = (v: unknown) => v as Prisma.InputJsonValue;
  const createdTopics = [];

  for (const lesson of topics) {
    const fields = {
      title: lesson.title,
      titleHi: lesson.titleHi,
      description: lesson.description,
      descriptionHi: lesson.descriptionHi,
      simple: lesson.simple,
      simpleHi: lesson.simpleHi,
      content: lesson.content,
      contentHi: lesson.contentHi,
      analogy: json(lesson.analogy ?? {}),
      examples: json(lesson.examples ?? []),
      mistakes: json(lesson.mistakes ?? []),
      realWorld: json(lesson.realWorld ?? []),
      interviewQA: json(lesson.interviewQA ?? []),
      exercises: json(lesson.exercises ?? []),
      keyTakeaways: lesson.keyTakeaways ?? [],
      keyTakeawaysHi: lesson.keyTakeawaysHi ?? [],
      difficulty: lesson.difficulty,
      duration: lesson.duration ?? 25,
      order: lesson.order,
    };

    const parentModule = createdModules[lesson.moduleIndex];
    if (!parentModule) throw new Error(`No module at index ${lesson.moduleIndex}`);

    createdTopics.push(
      await prisma.courseTopic.upsert({
        where: { courseId_slug: { courseId: course.id, slug: lesson.slug } },
        create: { courseId: course.id, moduleId: parentModule.id, slug: lesson.slug, ...fields },
        update: fields,
      }),
    );
  }

  // Same declarative prune as the other courses.
  await prisma.courseTopic.deleteMany({
    where: { courseId: course.id, slug: { notIn: topics.map((t) => t.slug) } },
  });
  await prisma.courseModule.deleteMany({
    where: { courseId: course.id, slug: { notIn: modules.map((m) => m.slug) } },
  });

  return { modules: createdModules.length, topics: createdTopics.length };
}

async function seedNodeCourse(): Promise<{ modules: number; topics: number }> {
  const courseData = {
    slug: 'node-complete',
    name: 'Node.js Complete Course',
    nameHi: 'Node.js Complete Course - Backend Noob Se Pro Tak',
    description:
      'Backend development from your first server to production patterns — the event loop, Express, databases, auth, and everything real-world Node.js backends actually need, shown in JavaScript and TypeScript side by side.',
    descriptionHi:
      'Backend development apne pehle server se production patterns tak — event loop, Express, databases, auth, aur wo sab jo asli-duniya Node.js backends ko asal mein chahiye, JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
    icon: '🟢',
    color: '#68A063',
    level: 'beginner' as const,
    totalXpReward: 5000,
    estimatedHours: 130,
    maxDifficulty: 'HARD' as const,
    order: 2,
    isPublished: true,
  };

  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    create: courseData,
    update: courseData,
  });

  const modules = [
    {
      slug: 'node-module-1-fundamentals',
      name: 'Module 1: Node.js Fundamentals',
      nameHi: 'Module 1: Node.js Ki Buniyaad',
      description:
        'The event loop, non-blocking I/O, modules, npm, streams and buffers, and npm audit and dependency vulnerability scanning — the machinery every Node.js backend runs on, shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'Event loop, non-blocking I/O, modules, npm, streams aur buffers, aur npm audit aur dependency vulnerability scanning — wo machinery jispar har Node.js backend chalta hai, JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 1,
    },
    {
      slug: 'node-module-2-express-apis',
      name: 'Module 2: Building APIs with Express',
      nameHi: 'Module 2: Express Se APIs Banaana',
      description:
        'Routing, middleware, error handling, structuring a real Express application, API versioning and deprecation policy, API documentation with OpenAPI, and choosing the right HTTP status code for every response — shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'Routing, middleware, error handling, ek asli Express application ko structure karna, API versioning aur deprecation policy, OpenAPI ke saath API documentation, aur har response ke liye sahi HTTP status code chunna — JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 2,
    },
    {
      slug: 'node-module-3-data-persistence',
      name: 'Module 3: Data & Persistence',
      nameHi: 'Module 3: Data Aur Persistence',
      description:
        'Connection pooling, CRUD, SQL injection prevention, transactions, and the N+1 query problem — shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'Connection pooling, CRUD, SQL injection se bachaav, transactions, aur N+1 query problem — JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 3,
    },
    {
      slug: 'node-module-4-auth-security',
      name: 'Module 4: Authentication & Security',
      nameHi: 'Module 4: Authentication Aur Security',
      description:
        'Password hashing with bcrypt, JWT authentication, sessions vs. tokens, CORS, rate limiting, authorization and RBAC, token blacklisting, CSRF protection, and mass assignment vulnerabilities — shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'bcrypt se password hashing, JWT authentication, sessions vs. tokens, CORS, rate limiting, authorization aur RBAC, token blacklisting, CSRF protection, aur mass assignment vulnerabilities — JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 4,
    },
    {
      slug: 'node-module-5-real-world-patterns',
      name: 'Module 5: Real-World Patterns & Architecture',
      nameHi: 'Module 5: Real-World Patterns Aur Architecture',
      description:
        'Pagination, file uploads, structured logging, testing with Jest and Supertest, and pre-signed URLs and object storage — shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'Pagination, file uploads, structured logging, Jest aur Supertest se testing, aur pre-signed URLs aur object storage — JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 5,
    },
    {
      slug: 'node-module-6-pro',
      name: 'Module 6: Pro',
      nameHi: 'Module 6: Pro',
      description:
        'Worker Threads, clustering and PM2, WebSockets, WebRTC, background jobs and queues, Docker basics, performance profiling and memory leaks, and dead-letter queues and scheduled jobs — shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'Worker Threads, clustering aur PM2, WebSockets, WebRTC, background jobs aur queues, Docker basics, performance profiling aur memory leaks, aur dead-letter queues aur scheduled jobs — JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 6,
    },
    {
      slug: 'node-module-7-scaling-production',
      name: 'Module 7: Scaling & Production Operations',
      nameHi: 'Module 7: Scaling Aur Production Operations',
      description:
        'Database indexing, caching with Redis, safe production migrations, load balancing with health checks and graceful shutdown, idempotency with retries and circuit breakers, payment webhooks, secrets management, Server-Sent Events, metrics/observability, concurrency limiting and load shedding, cache stampede protection, request timeouts, crash safety with uncaughtException/unhandledRejection, production-ready project structure with VS Code setup, module boundaries and lightweight domain-driven design, monorepo and large-team CI hygiene, feature flags and progressive rollout, blue-green and canary deployment strategies, multi-tenancy patterns, distributed tracing across service and job boundaries, and dependency injection for large codebases — shown in JavaScript and TypeScript side by side.',
      descriptionHi:
        'Database indexing, Redis se caching, surakshit production migrations, health checks aur graceful shutdown ke saath load balancing, retries aur circuit breakers ke saath idempotency, payment webhooks, secrets management, Server-Sent Events, metrics/observability, concurrency limiting aur load shedding, cache stampede protection, request timeouts, uncaughtException/unhandledRejection ke saath crash safety, VS Code setup ke saath production-ready project structure, module boundaries aur lightweight domain-driven design, monorepo aur large-team CI hygiene, feature flags aur progressive rollout, blue-green aur canary deployment strategies, multi-tenancy patterns, service aur job boundaries ke aar-paar distributed tracing, aur bade codebases ke liye dependency injection — JavaScript aur TypeScript dono mein saath-saath dikhaaye gaye.',
      order: 7,
    },
  ];

  const createdModules = [];
  for (const moduleData of modules) {
    createdModules.push(
      await prisma.courseModule.upsert({
        where: { courseId_slug: { courseId: course.id, slug: moduleData.slug } },
        create: { courseId: course.id, ...moduleData },
        update: moduleData,
      }),
    );
  }

  const topics = [
    ...[...NODE_MODULE_1, ...NODE_MODULE_1_PART2, ...NODE_MODULE_1_PART3, ...NODE_MODULE_1_PART4, ...NODE_MODULE_1_PART5, ...NODE_MODULE_1_PART6].map((lesson) => ({
      ...lesson,
      moduleIndex: 0,
    })),
    ...[...NODE_MODULE_2, ...NODE_MODULE_2_PART2, ...NODE_MODULE_2_PART3, ...NODE_MODULE_2_PART4, ...NODE_MODULE_2_PART5, ...NODE_MODULE_2_PART6, ...NODE_MODULE_2_PART7, ...NODE_MODULE_2_PART8].map((lesson) => ({
      ...lesson,
      moduleIndex: 1,
    })),
    ...[...NODE_MODULE_3, ...NODE_MODULE_3_PART2, ...NODE_MODULE_3_PART3, ...NODE_MODULE_3_PART4].map((lesson) => ({
      ...lesson,
      moduleIndex: 2,
    })),
    ...[...NODE_MODULE_4, ...NODE_MODULE_4_PART2, ...NODE_MODULE_4_PART3, ...NODE_MODULE_4_PART4, ...NODE_MODULE_4_PART5, ...NODE_MODULE_4_PART6, ...NODE_MODULE_4_PART7, ...NODE_MODULE_4_PART8, ...NODE_MODULE_4_PART9].map((lesson) => ({
      ...lesson,
      moduleIndex: 3,
    })),
    ...[...NODE_MODULE_5, ...NODE_MODULE_5_PART2, ...NODE_MODULE_5_PART3, ...NODE_MODULE_5_PART4, ...NODE_MODULE_5_PART5].map((lesson) => ({
      ...lesson,
      moduleIndex: 4,
    })),
    ...[...NODE_MODULE_6, ...NODE_MODULE_6_PART2, ...NODE_MODULE_6_PART3, ...NODE_MODULE_6_PART4, ...NODE_MODULE_6_PART5, ...NODE_MODULE_6_PART6, ...NODE_MODULE_6_PART7, ...NODE_MODULE_6_PART8].map((lesson) => ({
      ...lesson,
      moduleIndex: 5,
    })),
    ...[...NODE_MODULE_7, ...NODE_MODULE_7_PART2, ...NODE_MODULE_7_PART3, ...NODE_MODULE_7_PART4, ...NODE_MODULE_7_PART5, ...NODE_MODULE_7_PART6, ...NODE_MODULE_7_PART7, ...NODE_MODULE_7_PART8, ...NODE_MODULE_7_PART9, ...NODE_MODULE_7_PART10, ...NODE_MODULE_7_PART11, ...NODE_MODULE_7_PART12, ...NODE_MODULE_7_PART13, ...NODE_MODULE_7_PART14, ...NODE_MODULE_7_PART15, ...NODE_MODULE_7_PART16, ...NODE_MODULE_7_PART17, ...NODE_MODULE_7_PART18, ...NODE_MODULE_7_PART19, ...NODE_MODULE_7_PART20, ...NODE_MODULE_7_PART21].map((lesson) => ({
      ...lesson,
      moduleIndex: 6,
    })),
  ];

  const json = (v: unknown) => v as Prisma.InputJsonValue;
  const createdTopics = [];

  for (const lesson of topics) {
    const fields = {
      title: lesson.title,
      titleHi: lesson.titleHi,
      description: lesson.description,
      descriptionHi: lesson.descriptionHi,
      simple: lesson.simple,
      simpleHi: lesson.simpleHi,
      content: lesson.content,
      contentHi: lesson.contentHi,
      analogy: json(lesson.analogy ?? {}),
      examples: json(lesson.examples ?? []),
      mistakes: json(lesson.mistakes ?? []),
      realWorld: json(lesson.realWorld ?? []),
      interviewQA: json(lesson.interviewQA ?? []),
      exercises: json(lesson.exercises ?? []),
      keyTakeaways: lesson.keyTakeaways ?? [],
      keyTakeawaysHi: lesson.keyTakeawaysHi ?? [],
      difficulty: lesson.difficulty,
      duration: lesson.duration ?? 25,
      order: lesson.order,
    };

    const parentModule = createdModules[lesson.moduleIndex];
    if (!parentModule) throw new Error(`No module at index ${lesson.moduleIndex}`);

    createdTopics.push(
      await prisma.courseTopic.upsert({
        where: { courseId_slug: { courseId: course.id, slug: lesson.slug } },
        create: { courseId: course.id, moduleId: parentModule.id, slug: lesson.slug, ...fields },
        update: fields,
      }),
    );
  }

  // Same declarative prune as the other courses.
  await prisma.courseTopic.deleteMany({
    where: { courseId: course.id, slug: { notIn: topics.map((t) => t.slug) } },
  });
  await prisma.courseModule.deleteMany({
    where: { courseId: course.id, slug: { notIn: modules.map((m) => m.slug) } },
  });

  return { modules: createdModules.length, topics: createdTopics.length };
}

async function main(): Promise<void> {
  console.log('Seeding DevPrep content…\n');

  const topics = await seedTopics();
  const withSimple = await prisma.topic.count({ where: { simple: { not: null } } });
  const withTricks = await prisma.topic.count({ where: { tricks: { not: null } } });
  console.log(
    `  ${categories.length} topic categories, ${topics} topics ` +
      `(${withSimple} with a beginner explanation, ${withTricks} with memory tricks)`,
  );

  const questions = await seedQuestions();
  console.log(`  ${questions} interview questions`);

  const problems = await seedDsa();
  const testCases = await prisma.testCase.count();
  console.log(`  ${problems} DSA problems, ${testCases} test cases`);

  // Seed JavaScript Course
  console.log('\nSeeding JavaScript Course…');
  const courseStats = await seedJavaScriptCourse();
  console.log(
    `  ${courseStats.courses} course, ${courseStats.modules} modules, ` +
      `${courseStats.topics} topics, ${courseStats.problems} problems`,
  );

  console.log('\nSeeding CSS & HTML Course…');
  const cssStats = await seedCssCourse();
  console.log(`  1 course, ${cssStats.modules} modules, ${cssStats.topics} lessons`);

  console.log('\nSeeding TypeScript Course…');
  const tsStats = await seedTypeScriptCourse();
  console.log(`  1 course, ${tsStats.modules} modules, ${tsStats.topics} lessons`);

  console.log('\nSeeding React Course…');
  const reactStats = await seedReactCourse();
  console.log(`  1 course, ${reactStats.modules} modules, ${reactStats.topics} lessons`);

  console.log('\nSeeding DSA Course…');
  const dsaCourseStats = await seedDsaCourse();
  console.log(`  1 course, ${dsaCourseStats.modules} modules, ${dsaCourseStats.topics} lessons`);

  console.log('\nSeeding Node.js Course…');
  const nodeStats = await seedNodeCourse();
  console.log(`  1 course, ${nodeStats.modules} modules, ${nodeStats.topics} lessons`);

  console.log('\nDone. Sign up in the app to start tracking progress.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
