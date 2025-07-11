const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateRecipe = async ({ ingredients, members, cuisine, language }) => {
  const prompt = `
    Create a recipe with the following details:
    Cuisine: ${cuisine}
    Ingredients: ${JSON.stringify(ingredients)}
    Serves: ${members} people.
    Give response in this language ${language}
    Format the recipe with a title, in ingredients always give item name and quantity, cooking instructions with step count and description of instructions, and serving suggestions in JSON format.
  `;

  try {
    const result = await model.generateContent(prompt);

    let raw = result.response.text().trim();
    raw = raw.replace(/```json|```/g, "");

    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.slice(firstBrace, lastBrace + 1);
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error("Error parsing Gemini response:", error.message);
    throw new Error("Failed to generate recipe due to invalid JSON format.");
  }
};


module.exports = { generateRecipe };
