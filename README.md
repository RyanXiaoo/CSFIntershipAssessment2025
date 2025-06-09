# Recipe Helper Application

This is a full-stack web application that allows users to search for recipes based on various criteria and save their favorite ones for later. It features a React-based frontend, a Node.js/Express backend, and a local SQLite database.

## Features

-   **Advanced Recipe Search**: Search for recipes with detailed filters, including:
    -   Dietary restrictions (e.g., Vegan, Gluten-Free).
    -   Cuisine type (e.g., Italian, Mexican).
    -   Nutritional ranges (min/max calories, protein, fat, carbs).
-   **Save & View Recipes**: Save interesting recipes to a local database and view them on a dedicated "Saved Recipes" page.
-   **Secure Backend**: A Node.js backend acts as a proxy to protect API keys and handle database operations securely.
-   **Modern UI**: A clean, single-page interface for a smooth user experience.

## Technologies Used

-   **Frontend**: React, Vite, TypeScript, shadcn/ui, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: SQLite
-   **API**: Spoonacular API for recipe data

## Local Development Setup

To run this project locally, you will need to set up both the frontend and the backend.

### Prerequisites

-   [Node.js and npm](https://nodejs.org/en/download/)
-   A Spoonacular API Key (get one for free [here](https://spoonacular.com/food-api))

### Backend Setup

1.  Navigate to the `backend` directory:
    `cd backend`
2.  Install dependencies:
    `npm install`
3.  Create a `.env` file in the `backend` directory and add your Spoonacular API key:
    `SPOONACULAR_API_KEY=YOUR_API_KEY_HERE`
4.  Start the backend server:
    `npm start`
    The server will run on `http://localhost:5001`.

### Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    `cd frontend`
2.  Install dependencies:
    `npm install`
3.  Start the frontend development server:
    `npm run dev`
    The application will be available at `http://localhost:5173`.

---

## Future Improvements & Extensions

Here are some ways the application and its API could be extended and improved:

### 1. Custom Recipe Data via Web Scraping

A significant limitation of relying on third-party APIs like Spoonacular is the finite and sometimes inconsistent nature of the data. A powerful improvement would be to build a custom, comprehensive recipe database.

-   **Process**: Develop a web scraping service (using libraries like Puppeteer or Cheerio) to gather recipe data from popular cooking websites.
-   **Storage**: Store this scraped data in a more robust database, such as PostgreSQL or MongoDB.
-   **API Extension**: The backend API would then be updated to query this new database instead of proxying requests to Spoonacular. This would provide more control over the data, eliminate API rate limits, and allow for truly unique feature sets.

### 2. User Authentication & Personalized Accounts

-   **Implementation**: Add a complete user authentication system (e.g., using JWT or OAuth).
-   **Benefit**: This would allow users to have personalized accounts. Saved recipes would be tied to a user's account, allowing them to log in from any device and access their collection.

### 3. Advanced Filtering & Sorting

-   **More Filters**: Add filters for cooking time, allergens, or specific ingredients to exclude.
-   **Sorting Options**: Allow users to sort search results by nutritional values, cooking time, or popularity.

## Deployment Strategy

To deploy this full-stack application, both the frontend and backend need to be hosted.

### Backend Deployment

-   **Platform**: Services like Heroku, Render, or AWS Elastic Beanstalk are excellent choices for hosting a Node.js server.
-   **Process**:
    1.  Push the code to a GitHub repository.
    2.  Connect the repository to the hosting service.
    3.  Configure environment variables (like `SPOONACULAR_API_KEY` and `DATABASE_URL`) in the hosting platform's dashboard.
    4.  The service will build and deploy the `backend` application. The SQLite database is not suitable for most production hosting environments (except for very small-scale apps), so migrating to a managed database like PostgreSQL (offered by Heroku or Render) would be necessary.

### Frontend Deployment

-   **Platform**: Static site hosting services like Vercel, Netlify, or AWS S3 are ideal for a React application.
-   **Process**:
    1.  Connect the same GitHub repository to the hosting service.
    2.  Specify the `frontend` directory as the root.
    3.  Set the build command to `npm run build`.
    4.  Configure an environment variable to point to the live backend URL (e.g., `VITE_API_BASE_URL=https://your-backend-url.com`).
    5.  The service will build the static files and deploy them globally.

## Intuitive Design and User Interface

The application is designed with a modern, user-centric approach, focusing on simplicity and efficiency.

-   **Single-Page Experience**: The core functionality (search form and results) resides on a single page. This avoids unnecessary navigation and provides a fluid user experience. When a user performs a search, the form is replaced by the results, keeping the context clear and the interface uncluttered.
-   **Clean and Clear Layout**: Using `shadcn/ui` and Tailwind CSS, the interface is clean, with ample whitespace and a clear visual hierarchy. This helps users easily identify filters, understand recipe details, and take actions like saving or removing a recipe.
-   **Responsive Design**: The application is fully responsive, providing a seamless experience on both desktop and mobile devices.
