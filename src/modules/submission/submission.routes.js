import express from "express";
import {
  runCodeController,
  submitCodeController,
} from "../submission/submission.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/run",authenticate, runCodeController);
router.post("/submit",authenticate, submitCodeController);

export default router;
