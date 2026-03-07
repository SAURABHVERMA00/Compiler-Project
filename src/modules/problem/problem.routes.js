import express from "express";
import * as problemController from "./problem.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", problemController.getAllProblems);
router.get("/:id", problemController.getProblemById);

// Admin only (add auth middleware later)
router.post("/create",authenticate, authorize("ADMIN"), problemController.createProblem);
router.delete("/:id", authenticate, authorize("ADMIN"), problemController.deleteProblem);

export default router;
