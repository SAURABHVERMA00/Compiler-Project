import { ca } from "zod/v4/locales";
import * as problemService from "./problem.service.js";
import { createProblemSchema } from "./problem.validation.js";

export const createProblem = async (req, res) => {
  try {
    const validatedData = createProblemSchema.parse(req.body);
    const problem = await problemService.createProblem(validatedData);

    res.status(201).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await problemService.getAllProblems();

    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await problemService.getProblemById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve problem",
    });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Problem deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete problem",
    });
  }
};
