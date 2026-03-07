import { prisma } from "../../config/prisma.js";
import {
  submitToJudge,
  getSubmissionResult,
} from "../../judge/judge.service.js";
import { languageMap } from "../../utils/languageMapper.js";
import { SubmissionStatus } from "../../generated/prisma/index.js";
import e from "express";


export const runCodeService = async (problemId, sourceCode, language) => {
  const languageId = languageMap[language];

  if (!languageId) {
    throw new Error("Invalid language");
  }
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      testCases: {
        where: { isHidden: false },
      },
    },
  });

  if (!problem) throw new Error("Problem not found");

  const results = [];

  for (const testCase of problem.testCases) {
    const token = await submitToJudge(sourceCode, languageId, testCase.input);

    const judgeResult = await getSubmissionResult(token);

    const expected = testCase.output.trim();
    const actual = (judgeResult.stdout || "").trim();

    const passed =
      judgeResult.status?.id === 3 && // Accepted
      expected === actual;

    results.push({
      input: testCase.input,
      expected,
      actual,

      passed,

      // 🔥 Full Judge Details
      status: judgeResult.status?.description,
      statusId: judgeResult.status?.id,
      stderr: judgeResult.stderr,
      compile_output: judgeResult.compile_output,
      message: judgeResult.message,
      time: judgeResult.time,
      memory: judgeResult.memory,
    });
  }

  return results;
};

export const submitCodeService = async (
  userId,
  problemId,
  language,
  sourceCode,
) => {
  const languageId = languageMap[language];
  if (!languageId) {
    throw new Error("Invalid language");
  }
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: { testCases: true },
  });

  if (!problem) throw new Error("Problem not found");

  const submission = await prisma.submission.create({
    data: {
      userId,
      problemId,
      language: language,
      status: SubmissionStatus.PENDING,
    },
  });
  // console.log("Created submission:", submission);
  let maxRuntime = 0;
  let maxMemory = 0;
  let totalCorrect = 0;
  let statusCode = 10; // Assume Accepted
  let statusMsg = SubmissionStatus.ACCEPTED;
  let compileError = null;
  let runtimeError = null;
  let judgeStatus = "Accepted";
  let errorMessage = null;


  for (let i = 0; i < problem.testCases.length; i++) {
    const testCase = problem.testCases[i];

    const token = await submitToJudge(sourceCode, languageId, testCase.input);

    const result = await getSubmissionResult(token);

    judgeStatus = result.status?.description;

    // 🔴 Compile Error
    if (result.status.id === 6) {
      statusCode = 20;
      statusMsg = SubmissionStatus.COMPILATION_ERROR;
      compileError = result.compile_output;
      errorMessage = result.message;
      break;
    }

    // 🔴 Runtime Error
    if (result.status.id !== 3) {
      if (result.status.id === 5) {
        statusMsg = SubmissionStatus.TIME_LIMIT_EXCEEDED;
      } else {
        statusMsg = SubmissionStatus.RUNTIME_ERROR;
      }

      statusCode = 15;
      runtimeError = result.stderr;
      errorMessage = result.message;
      break;
    }

    const expected = testCase.output.trim();
    const actual = (result.stdout || "").trim();
   
    if (expected !== actual) {
      statusCode = 11;
      statusMsg = SubmissionStatus.WRONG_ANSWER;
      errorMessage = `Test case ${i + 1} failed. Expected: "${expected}", Got: "${actual}"`;
      judgeStatus = "Wrong Answer";
      break;
    }

    totalCorrect++;

    maxRuntime = Math.max(maxRuntime, parseFloat(result.time));
    maxMemory = Math.max(maxMemory, result.memory);
  }

  const totalTestcases = problem.testCases.length;
  const runSuccess = statusCode === 10;

  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      status: statusMsg,
      runtime: maxRuntime,
      memory: maxMemory,
    },
  });

  if (statusMsg === SubmissionStatus.ACCEPTED) {
    await prisma.userStats.update({
      where: { userId },
      data: {
        problemsSolved: {
          increment: 1,
        },
        totalSubmissions: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.userStats.update({
      where: { userId },
      data: {
        totalSubmissions: {
          increment: 1,
        },
      },
    });
  }

  return {
    status_code: statusCode,
    run_success: runSuccess,
    status_runtime: runSuccess ? `${maxRuntime} ms` : null,
    memory: maxMemory,
    total_correct:  totalCorrect ,
    total_testcases: totalTestcases,
    runtime_percentile: null, // you can calculate later
    memory_percentile: null, // you can calculate later
    status_msg: statusMsg,
    submission_id: submission.id,
    judgeStatus: judgeStatus,
    compile_error: compileError,
    runtime_error: runtimeError,
    error_message: errorMessage,
    pretty_lang: language,
    state: "SUCCESS",
  };
};
