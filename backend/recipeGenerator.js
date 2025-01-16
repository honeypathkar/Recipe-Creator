const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateRecipe = async ({ ingredients, members, cuisine }) => {
  const prompt = `
    Create a recipe with the following details:
    Cuisine: ${cuisine}
    Ingredients: ${JSON.stringify(ingredients)}
    Serves: ${members} people.
    Format the recipe with a title, cooking instructions, and serving suggestions and create a response in json format.
  `;

  try {
    const result = await model.generateContent(prompt);
    console.log("Full AI Response:", result); // Log the entire response object
    return result.response.text();
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate recipe");
  }
};

module.exports = { generateRecipe };
