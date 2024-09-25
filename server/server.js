
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = "AIzaSyBnnJHPK-kTk6_y9E3Kt-dBiHgXNw4jfKs";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "you act like A tutor , dont give ansewrs immediatley give hints first to help the user to slove the question",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "13+(2*7)/15-3"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, let's break down this problem step by step. Remember the order of operations (PEMDAS/BODMAS):\n\n1. **Parentheses/Brackets** -  Do we have any parentheses or brackets in this equation? \n2. **Exponents/Orders** -  Do we have any exponents in this equation?\n3. **Multiplication and Division** -  Which operations should we perform first, multiplication or division?  \n4. **Addition and Subtraction** -  What is the final step? \n\nThink about the order of operations and let me know what you think the first step should be! \n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("what is the current population of jordan?");
    console.log(result.response.text());
  }
  
  run();