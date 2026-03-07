import { z } from "zod";

export const createSubmissionSchema = z.object({
  problemId: z.number().int().positive(),
  language: z.enum(["CPP", "PYTHON", "JAVA"]),
  code: z.string().min(10, "Code must be at least 10 characters"),
});
