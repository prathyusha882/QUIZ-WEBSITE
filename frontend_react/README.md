# Quiz_Website_Project - Frontend (React)

This is the frontend for a B.Tech exam and hackathon portal. It's a single-page application (SPA) built with React.js that communicates with a Django backend via a REST API.

## Features

- **User Authentication**: Secure sign-up and login forms.
- **Protected Routes**: Ensures that only logged-in users can access the dashboard and quizzes.
- **Dynamic Quiz Interface**: Renders different question types (MCQ, fill-in-the-blanks, coding problems).
- **Integrated Code Editor**: A full-featured code editor for students to write and test their code.
- **Global State Management**: Uses React Context API for managing user authentication state.
- **Professional Styling**: Utilizes modern CSS and a component-based approach for a clean and impressive UI.

## Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **API Client**: Axios
- **Code Editor**: Monaco Editor

## Getting Started

### Prerequisites

- **Node.js**: The Node.js runtime and npm (Node Package Manager) are required. You can download them from the official website.

### Setup

1.  **Install Dependencies**: Navigate to the `frontend_react` directory and install all the required packages.

    ```bash
    npm install
    ```

2.  **Configure Tailwind CSS**: You need to set up Tailwind to work with your project.

    ```bash
    # This creates a tailwind.config.js and postcss.config.js file
    npx tailwindcss init -p
    ```

    Then, open `tailwind.config.js` and update the `content` array to include all your component files:

    ```javascript
    // tailwind.config.js
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

3.  **Run the Development Server**: Start the application in development mode.

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`. It will automatically reload if you make any changes to the code.

### Connecting to the Backend

The application is configured to communicate with the Django backend running at `http://localhost:8000`. Ensure your backend is running using Docker before starting the frontend. The API calls are managed through the `src/services/api.js` file, which automatically handles token authentication for protected requests.