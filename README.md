Quiz Website - Frontend (React)
This is the frontend React application for the Quiz Website platform, designed to provide a modern, responsive, and user-friendly interface for students and admins to interact with quizzes, view results, and manage accounts.

🚀 Features
Authentication: User signup, login, logout, password reset, and email verification.

Quiz Taking: Single question per page, MCQ, True/False, text, and coding questions support.

Timer: Countdown timer for quizzes with auto-submit on time expiry.

Answer Drafts: Auto-save answers as drafts during quiz attempts.

Quizzes Dashboard: Discover, start, and resume quizzes.

Results & Leaderboard: View past quiz results and leaderboard rankings.

Admin Capabilities: Admin users can manage quizzes and questions via backend.

Responsive Design: Fully responsive UI built with Tailwind CSS.

Error Handling: Clear messaging using React-Toastify; graceful error boundaries.

State Management: React Context API manages authentication state.

API Integration: Communicates securely with backend REST API using JWT tokens.

🛠️ Getting Started
Prerequisites
Node.js (v18+ recommended)

npm (v9+)

Backend API running (see backend README for setup)

Installation
Clone the repo and navigate to the frontend directory:

bash
git clone https://github.com/your-username/Quiz_Website_Project.git
cd Quiz_Website_Project/frontend_react
Install dependencies:

bash
npm install
Set environment variables:

Copy .env.development or .env.docker and adjust REACT_APP_API_URL if necessary.

For local development, ensure backend is running at the URL specified in REACT_APP_API_URL.

Run the development server:

bash
npm start
App will be served at http://localhost:3000.

Build for Production
bash
npm run build
This creates an optimized build output in the build/ folder ready to be served by an HTTP server.

🧩 Project Structure
text
src/
 ├─ assets/         # Images, stylesheets
 ├─ components/     # Reusable UI components
 │   ├─ auth/       # Login, Signup, Password Reset forms
 │   ├─ common/     # Loader, ErrorMessage, etc.
 │   ├─ quiz/       # Question, Timer, CodeEditor components
 │   └─ shared/     # Header, Footer, ErrorBoundary
 ├─ contexts/       # Auth Context
 ├─ hooks/          # Custom hooks like useApi
 ├─ pages/          # Route components like Dashboard, QuizPage
 ├─ services/       # API wrapper with axios
 ├─ App.js
 ├─ index.js
 └─ index.css
🧑💻 Usage
Authentication: Users can create accounts, login, and manage passwords.

Quiz Workflow: Users browse quizzes in Dashboard, start attempts, answer questions one by one, and submit when done.

Instant Feedback: Upon submission, users view scores and detailed results.

Leaderboards: See top scorers and compare your ranking.

Admin: Manage data via backend admin panel (React frontend is user-focused).

⚙️ Configuration
All API requests use the URL specified in REACT_APP_API_URL environment variable.

Environment variable examples:

.env.development — for local dev

.env.docker — for Docker deployment with backend service name

📦 Dependencies
React 18

React Router 6

axios (for HTTP requests)

react-toastify (for notifications)

Tailwind CSS (for styling)

🚀 Deployment
The frontend can be deployed standalone (e.g., Netlify, Vercel) provided API URL is accessible.

Dockerfile included for containerized deployment.

For Docker deployment with backend, update .env.docker and use Docker Compose with backend.

🤝 Contributing
Feel free to fork and open pull requests. Issues and feature requests are welcome.

📄 License
MIT License