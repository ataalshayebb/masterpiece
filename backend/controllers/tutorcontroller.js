
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBnnJHPK-kTk6_y9E3Kt-dBiHgXNw4jfKs";
const genAI = new GoogleGenerativeAI({ apiKey });

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You act as a tutor. Your goal is to help the user learn by asking questions that lead them to the answer on their own. Respond with open-ended questions, offer examples if needed, and encourage the user to think critically. Only provide the answer if all hints fail.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

exports.handleAITutor = async (req, res) => {
  try {
    const { message, history } = req.body;

    const chatSession = model.startChat({
      generationConfig,
      history: history,
    });

    const result = await chatSession.sendMessage(message);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
