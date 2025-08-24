from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
from .models import Quiz, Question, StudentQuizAttempt, Answer, QuizFeedback
from .serializers import (
    QuizSerializer,
    StudentQuizAttemptSerializer,
    QuizSubmitSerializer,
    LeaderboardEntrySerializer,
    QuizFeedbackSerializer,  # added serializer import
)
from rest_framework.exceptions import ValidationError


class QuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Quiz.objects.filter(active=True)
        now = timezone.now()
        return qs.filter(
            (Q(start_time__lte=now) | Q(start_time__isnull=True)) &
            (Q(end_time__gte=now) | Q(end_time__isnull=True))
        )


class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Quiz.objects.all()


class QuizStartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk, active=True)

        # Check max attempts
        attempts_count = StudentQuizAttempt.objects.filter(user=request.user, quiz=quiz).count()
        if quiz.max_attempts and attempts_count >= quiz.max_attempts:
            return Response({'detail': 'Max attempts reached'}, status=status.HTTP_403_FORBIDDEN)

        # Check quiz active window
        now = timezone.now()
        if quiz.start_time and now < quiz.start_time:
            return Response({'detail': 'Quiz not started yet'}, status=status.HTTP_403_FORBIDDEN)
        if quiz.end_time and now > quiz.end_time:
            return Response({'detail': 'Quiz is over'}, status=status.HTTP_403_FORBIDDEN)

        attempt = StudentQuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            start_time=now,
            submitted=False,
        )
        return Response({'attempt_id': attempt.id})


class StudentQuizAttemptListView(generics.ListAPIView):
    serializer_class = StudentQuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentQuizAttempt.objects.filter(user=self.request.user)


class StudentQuizAttemptDetailView(generics.RetrieveAPIView):
    serializer_class = StudentQuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'attempt_id'

    def get_queryset(self):
        return StudentQuizAttempt.objects.filter(user=self.request.user)


class QuizSubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, attempt_id):
        attempt = get_object_or_404(StudentQuizAttempt, id=attempt_id, user=request.user)

        if attempt.submitted:
            return Response({'detail': 'Quiz already submitted'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers_data = serializer.validated_data['answers']

        # Remove old answers for re-submission support
        attempt.answers.all().delete()

        total_points = 0
        score = 0

        for ans_data in answers_data:
            question = get_object_or_404(Question, pk=ans_data['question'], quiz=attempt.quiz)
            total_points += question.points

            answer = Answer.objects.create(
                attempt=attempt,
                question=question,
                selected_option=ans_data.get('selected_option'),
                answer_text=ans_data.get('answer_text', ''),
                code_submitted=ans_data.get('code_submitted', ''),
            )

            # Grade if not coding question
            if question.question_type != 'code':
                answer_value = answer.selected_option or answer.answer_text
                # Wrap int in list for MCQ grading to avoid TypeError
                if question.question_type == 'mcq' and isinstance(answer_value, int):
                    answer_value = [answer_value]
                if question.is_correct_answer(answer_value):
                    score += question.points
            else:
                # Coding questions graded async; here set 0, update later.
                pass

        attempt.submitted = True
        attempt.submission_time = timezone.now()
        attempt.total_possible_points = total_points
        attempt.total_score = score
        attempt.save()

        return Response(StudentQuizAttemptSerializer(attempt).data)


class LeaderboardView(generics.ListAPIView):
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentQuizAttempt.objects.filter(submitted=True).order_by('-total_score', 'submission_time')[:50]


class QuizFeedbackCreateView(generics.CreateAPIView):
    queryset = QuizFeedback.objects.all()
    serializer_class = QuizFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
