import { z } from "zod";

export const createProblemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  timeLimit: z.number().positive(),
  memoryLimit: z.number().positive(),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  testCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      order: z.number().positive(),
      isHidden: z.boolean().optional()
    })
  )
});
