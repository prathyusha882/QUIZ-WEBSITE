Quiz_Website_Project - Backend (Django)
A full-featured internship- and production-grade quiz platform backend built with Django, Django Rest Framework, PostgreSQL, Celery, and Redis. Supports both company-style coding exams and general quiz management for students and admins.

🚀 Key Features
📝 User/Student
User Registration & Authentication: Secure sign-up, login/logout, JWT sessions, password reset, and email verification.

Quiz Dashboard: Discover, start, resume, and review quizzes; see leaderboard and past results.

Quiz Attempts:

Single question per page UX.

Supports MCQ, True/False, text, fill-in-the-blanks, and coding questions.

Draft save, navigation, and auto-submit on timer expiry.

Review answers before final submission.

Detailed Result Feedback: Instant score, correctness, explanation, past history, printable report.

✍️ Admin/Instructor
Quiz Creation & Editing:

Add/edit/delete quizzes and questions.

Set quiz title, description, duration, marks, start/end date, allowed attempts.

Add MCQ, True/False, text, and coding questions, including code problem statements, samples, and test cases.

Set question order/randomization.

Activate/deactivate quizzes.

Preview quiz as student.

Student Management:

View/grading of all attempts.

Override/adjust scores (manual grading of coding/text).

Block users, assign specific quizzes.

Analytics & Reporting:

View average scores, top performers, per-question stats.

Export results/analytics to CSV/Excel.

Leaderboard management and reset.

⚡ Async & Real-time (Advanced)
Code Evaluation: Coding questions auto-graded via async Celery workers.

WebSocket Ready: Channels integration for real-time quiz progress or live result updates.

Secure API: RESTful endpoints with permissions, validation, and limits.

🛠️ Tech Stack
Backend: Python, Django 4.2+, Django Rest Framework

Database: PostgreSQL

Task Queue: Celery + Redis

Real-time: Django Channels

Containers: Docker, Docker Compose

📦 Setup & Deployment
Prerequisites
Docker & Docker Compose

(Optional) Python & Postgres locally for dev without Docker

Initial Setup
Clone:

bash
git clone https://github.com/your-username/Quiz_Website_Project.git
cd Quiz_Website_Project/backend_django
Environment:

Copy .env.example to .env and fill out with your credentials.

See provided .env section in this README for required keys.

Build & Launch:

bash
docker-compose up --build
Database Setup:

bash
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
Access:

Django admin: http://localhost:8000/admin/

API: http://localhost:8000/

🔗 Main API Endpoints
User:

/api/users/register/ — Register new user (POST)

/api/users/login/ — Login and get JWT tokens (POST)

/api/users/password/reset/ — Password reset request (POST)

/api/users/email/verify/ — Email verification (POST)

/api/users/profile/ — View/change profile

Quiz:

/api/quizzes/ — List active quizzes (GET)

/api/quizzes/<id>/ — Quiz details (GET)

/api/quizzes/<id>/start/ — Start new attempt (POST)

/api/student-quizzes/<attempt_id>/ — View attempt details (GET)

/api/student-quizzes/<attempt_id>/submit/ — Submit answers (POST)

/api/leaderboard/ — Top scores global/quiz (GET)

Admin/Instructor:

Admin panel for quiz/question CRUD

API endpoints for analytics, grading, and exports as provided in your code

📊 Environment Variables Example
text
SECRET_KEY=super-secret-key
DEBUG=True
DB_NAME=quizdb
DB_USER=quizuser
DB_PASSWORD=quizpass
DB_HOST=db
DB_PORT=5432
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=django-db
ALLOWED_HOSTS=localhost,127.0.0.1
DEFAULT_FROM_EMAIL=no-reply@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_LIFETIME_MINUTES=15
REFRESH_TOKEN_LIFETIME_DAYS=7