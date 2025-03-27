# Recipe Creator AI - MERN Stack Project

## Description

**Recipe Creator AI** is a full-stack MERN application that leverages artificial intelligence to generate recipes based on the ingredients provided by the user. This project uses a combination of modern technologies to deliver an interactive and feature-rich user experience.

Key features include:

- **AI-Generated Recipes**: Create recipes based on provided ingredients, with options for choosing cuisine, language, and serving size (number of members).
- **User Authentication**: Users can create an account, log in, log out, and delete their account.
- **Favorites**: Users can add recipes to their favorites, view saved recipes, and permanently delete recipes.
- **Responsive Design**: Tailwind CSS ensures that the UI is responsive and optimized for different screen sizes.
- **Material Icons**: The project uses Material UI icons for a polished and user-friendly interface.

This project is built using the MERN stack, which includes:

- **MongoDB**: A NoSQL database used for storing user data, recipes, and favorites.
- **Express.js**: The backend framework used to handle API requests.
- **React.js**: The frontend framework used to create dynamic user interfaces.
- **Node.js**: The runtime environment used for building and running the backend.

## Features

- **Create Recipes**: Input ingredients and get a recipe generated with AI.
- **Choose Cuisine**: Select from various cuisines like Indian, Chinese, Italian, etc.
- **Language Option**: Recipes can be generated in different languages.
- **Member Option**: Specify the number of servings (members) for the recipe.
- **Favorite Recipes**: Add recipes to your favorites and view them anytime.
- **Delete Recipe**: Permanently delete recipes from your account.
- **User Account Management**: Create an account, log in, log out, and delete your account.

## Technologies Used

- **Frontend**:
  - React.js
  - Tailwind CSS
  - Material UI Icons
  - React Toastify for notifications
  - SweetAlert for alert
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose for schema management)
  - Google Gemini AI for generating recipes
  - JWT for user authentication

## Instructions to Run

### 1. Clone the GitHub Repository

```bash
git clone https://github.com/honeypathkar/Recipe-Creator.git
```

### 2. Setup Backend

- Install the required dependencies :

  ```bash
  cd backend
  npm install
  ```

- Add your Gemini API Key in the .env file (create it if it doesn't exist) And also Add JWT_SECRET key and CLIENT_URL:
  ```bash
  GEMINI_API_KEY=your-api-key
  JWT_SECRET=your-key
  CLIENT_URL=your-client-url
  EMAIL_USER=your-email
  APP_PASS=your-app-pass-for-email
  ```
- Start the backend server:
  ```bash
  nodemon app.js
  ```

### 3. Setup Frontend

- install the required dependencies:
  ```bash
  cd frontend
  npm install
  ```
- Start the frontend development server:
  ```bash
  npm run dev
  ```

## Access the application

- Once both the frontend and backend are running, you can access the application by opening your browser and navigating to:
  ```bash
    http://localhost:5173
  ```
