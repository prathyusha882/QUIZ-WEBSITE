from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError


class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=60)
    total_marks = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    max_attempts = models.PositiveIntegerField(default=1)
    random_order = models.BooleanField(default=False)
    # further fields for quiz settings as needed

    def clean(self):
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError('Quiz start_time must be before end_time.')

    def __str__(self):
        return self.title


class Question(models.Model):
    QUESTION_TYPES = (
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
        ('text', 'Text'),
        ('code', 'Coding'),
    )
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    points = models.PositiveIntegerField(default=1)
    # For coding questions
    problem_statement = models.TextField(blank=True, null=True)
    sample_input = models.TextField(blank=True, null=True)
    sample_output = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    
    # Added field for exact text answer checking
    correct_text_answer = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Q {self.order}: {self.text[:50]}"

    def is_correct_answer(self, answer):
        if self.question_type == 'mcq':
            correct_choices = self.choices.filter(is_correct=True)
            correct_ids = list(correct_choices.values_list('id', flat=True))
            # Wrap int answer in a list to support single-choice answers
            if isinstance(answer, int):
                answer = [answer]
            # Normalize answer to list of ints
            if isinstance(answer, list):
                answer = [int(a) for a in answer]
            return sorted(answer) == sorted(correct_ids)
        elif self.question_type == 'tf':
            correct_choice = self.choices.filter(is_correct=True).first()
            if correct_choice is None:
                return False
            # Convert answer to boolean
            parsed_answer = None
            if isinstance(answer, bool):
                parsed_answer = answer
            elif isinstance(answer, str):
                parsed_answer = answer.lower() == 'true'
            else:
                # for numbers: 1 = True, 0 = False
                parsed_answer = bool(answer)
            return parsed_answer == (correct_choice.choice_text.lower() == 'true')
        elif self.question_type == 'text':
            # Exact match with correct_text_answer
            return answer == self.correct_text_answer
        elif self.question_type == 'code':
            # Asynchronous grading
            return False
        return False


class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text


class StudentQuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now)
    submitted = models.BooleanField(default=False)
    submission_time = models.DateTimeField(null=True, blank=True)
    total_score = models.FloatField(default=0)
    total_possible_points = models.FloatField(default=0)

    @staticmethod
    def attempts_count(user, quiz):
        return StudentQuizAttempt.objects.filter(user=user, quiz=quiz).count()

    def time_taken(self):
        if self.submitted and self.submission_time:
            return (self.submission_time - self.start_time).total_seconds()
        elif not self.submitted:
            return (timezone.now() - self.start_time).total_seconds()
        return 0

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} Attempt #{self.pk}"


class Answer(models.Model):
    attempt = models.ForeignKey(StudentQuizAttempt, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.JSONField(blank=True, null=True)  # list of selected Choice IDs for MCQ or boolean for TF
    answer_text = models.TextField(blank=True, null=True)
    code_submitted = models.TextField(blank=True, null=True)
    graded_score = models.FloatField(default=0)

    class Meta:
        unique_together = ['attempt', 'question']  # Prevent duplicate answers per question per attempt

    def __str__(self):
        return f"Answer Q{self.question.order} for attempt {self.attempt.pk}"


class TestCase(models.Model):
    question = models.ForeignKey(Question, related_name='test_cases', on_delete=models.CASCADE)
    input_data = models.TextField()
    expected_output = models.TextField()
    is_hidden = models.BooleanField(default=False)

    def __str__(self):
        return f"TestCase for Q{self.question.id} (hidden: {self.is_hidden})"


class Submission(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(default=0)

    def __str__(self):
        return f"Submission by {self.student.username} for {self.quiz.title}"


class StudentQuiz(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    total_score = models.FloatField(default=0)

    def __str__(self):
        return f"{self.student.username} - {self.quiz.title}"


class StudentQuizQuestions(models.Model):
    student_quiz = models.ForeignKey(StudentQuiz, related_name='questions', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    selected_choices = models.ManyToManyField(Choice, blank=True)

    def __str__(self):
        return f"Question {self.question.id} of quiz {self.student_quiz.id}"


# Feedback model for quiz results feedback form

class QuizFeedback(models.Model):
    attempt = models.ForeignKey(StudentQuizAttempt, on_delete=models.CASCADE, related_name='feedback')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    feedback_text = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback by {self.user.username} for {self.quiz.title}"
