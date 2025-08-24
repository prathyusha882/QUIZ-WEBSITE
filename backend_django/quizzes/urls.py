from django.urls import path
from .views import (
    QuizListView,
    QuizDetailView,
    QuizStartView,
    StudentQuizAttemptDetailView,
    StudentQuizAttemptListView,  # new import for list view
    QuizSubmitView,
    LeaderboardView,
    QuizFeedbackCreateView,      # import for feedback view
)

urlpatterns = [
    path('', QuizListView.as_view(), name='quiz-list'),
    path('<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('<int:pk>/start/', QuizStartView.as_view(), name='quiz-start'),
    path('student-quizzes/', StudentQuizAttemptListView.as_view(), name='student-quiz-attempt-list'),
    path('student-quizzes/<int:attempt_id>/', StudentQuizAttemptDetailView.as_view(), name='student-quiz-attempt'),
    path('student-quizzes/<int:attempt_id>/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
    path('leaderboard/', LeaderboardView.as_view(), name='quiz-leaderboard'),
    path('feedback/', QuizFeedbackCreateView.as_view(), name='quiz-feedback-create'),  # <-- correct feedback endpoint
]
