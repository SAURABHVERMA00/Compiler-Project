import { prisma } from "../../config/prisma.js";

export const createProblem = async (data) => {
  const { testCases, ...problemData } = data;
  const problem = await prisma.problem.create({
    data: {
      ...problemData,   
      testCases: {
        create: testCases,
      },
    },
    include: {
      testCases: true,
    },
  });

  return problem;
};


export const getAllProblems = async () => {
  return await prisma.problem.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      createdAt: true
    }
  });
};

export const getProblemById = async (id) => {
  return await prisma.problem.findUnique({
    where: { id: Number(id) },
    include: {
      testCases: {
        where: { isHidden: false }
      }
    }
  });
};


export const deleteProblem = async (id) => {
  return await prisma.problem.delete({
    where: { id: Number(id) }
  });
};