const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    // Read secure key from Netlify environment (not exposed to React frontend)
    // We check GEMINI_SECRET_KEY first so it doesn't leak into the JS bundle
    const apiKey = process.env.GEMINI_SECRET_KEY || process.env.REACT_APP_GEMINI_AI_KEY || process.env.REACT_APP_GEMINI_KEY;
    
    if (!apiKey) {
      throw new Error("Missing Gemini API Key in Netlify environment variables");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: result.response.text() }),
    };
  } catch (error) {
    console.error("Gemini Backend Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate content" }),
    };
  }
};
