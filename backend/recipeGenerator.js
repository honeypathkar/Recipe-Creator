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
    Format the recipe with a title, in ingredients always give item name and quintity,  cooking instructions with step count and description of instrunction, and serving suggestions in json format.
  `;

  try {
    const result = await model.generateContent(prompt);
    console.log("Full AI Response:", result); // Log the entire response object

    // Remove any markdown formatting from the response
    let jsonData = result.response.text().trim();
    jsonData = jsonData.replace(/```json|```/g, ""); // Remove triple backticks

    // Parse the cleaned JSON data
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate recipe");
  }
};

module.exports = { generateRecipe };
