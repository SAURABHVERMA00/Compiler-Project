import {
  
  runCodeService,
  submitCodeService
} from "../submission/submission.service.js";


import { languageMap } from "../../utils/languageMapper.js";
export const runCodeController = async (req, res) => {
  try {
    const { problemId, sourceCode, language } = req.body;
    // console.log("Received run request:", { problemId, languageId });
   

    const result = await runCodeService(problemId, sourceCode, language);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const submitCodeController = async (req, res) => {
  
  try {
    const {  problemId, language, sourceCode } = req.body;
    const userId = req.user.id;
   
    const result = await submitCodeService(
      userId,
      problemId,
      language,
      sourceCode
    );

    return res.json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


