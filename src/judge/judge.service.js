import axios from "axios";

const JUDGE0_URL = "https://ce.judge0.com";

export const submitToJudge = async (
  source_code,
  language_id,
  stdin 
) => {
  
  const response = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, 
    {
    source_code,
    language_id,
    stdin: stdin || "" ,
    },{ 
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 5000, // 5 seconds timeout
  },);
  // console.log("Response from Judge0:", response.data);

  return response.data.token;
};

export const getSubmissionResult = async (token) => {
  const response = await axios.get(
    `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`
  );

  return response.data;
};
