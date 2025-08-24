from django.contrib import admin
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from .models import (
    Quiz,
    Question,
    Choice,
    TestCase,
    Submission,
    StudentQuiz,
    StudentQuizQuestions,
    StudentQuizAttempt,
    QuizFeedback,  # Added Feedback model import
)


# ---------- Inlines ----------
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2
    fields = ('choice_text', 'is_correct')
    show_change_link = True


class TestCaseInline(admin.TabularInline):
    model = TestCase
    extra = 1
    fields = ('input_data', 'expected_output', 'is_hidden')


class StudentQuizQuestionsInline(admin.TabularInline):
    model = StudentQuizQuestions
    extra = 0
    fields = ('question', 'display_score', 'display_selected_choices')
    readonly_fields = ('question', 'display_score', 'display_selected_choices')

    def display_score(self, obj):
        return getattr(obj, 'score', '—')
    display_score.short_description = "Score"

    def display_selected_choices(self, obj):
        return ", ".join(c.choice_text for c in obj.selected_choices.all())
    display_selected_choices.short_description = "Selected Choices"


# ---------- Admin Classes ----------
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'text', 'question_type', 'points', 'get_correct_answers')
    list_filter = ('quiz', 'question_type')
    search_fields = ('text',)
    fields = (
        'quiz',
        'text',
        'question_type',
        'points',
        'problem_statement',
        'sample_input',
        'sample_output',
        'order',
        'correct_text_answer',  # Show this field for one-word text answers
    )

    def get_inline_instances(self, request, obj=None):
        if obj:
            if obj.question_type == 'code':
                return [TestCaseInline(self.model, self.admin_site)]
            elif obj.question_type in ['mcq', 'tf']:
                return [ChoiceInline(self.model, self.admin_site)]
            else:
                return []
        return [ChoiceInline(self.model, self.admin_site), TestCaseInline(self.model, self.admin_site)]

    def get_correct_answers(self, obj):
        if obj.question_type in ['mcq', 'tf']:
            correct_choices = obj.choices.filter(is_correct=True)
            return ", ".join(c.choice_text for c in correct_choices) or "-"
        elif obj.question_type in ['text', 'fill']:
            return getattr(obj, 'correct_text_answer', '-') or "-"
        return "-"
    get_correct_answers.short_description = "Correct Answer(s)"


class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_time', 'end_time', 'active')
    list_filter = ('active',)
    search_fields = ('title',)


class StudentQuizAdmin(admin.ModelAdmin):
    list_display = ('student', 'quiz', 'started_at', 'completed_at', 'total_score')
    list_filter = ('quiz', 'student', 'completed_at')
    search_fields = ('student__username', 'quiz__title')
    inlines = [StudentQuizQuestionsInline]


@admin.register(StudentQuizAttempt)
class StudentQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'submitted', 'submission_time', 'total_score')
    list_filter = ('submitted', 'quiz', 'user')
    search_fields = ('user__username', 'quiz__title')


@admin.register(QuizFeedback)
class QuizFeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'attempt', 'submitted_at')
    list_filter = ('quiz', 'submitted_at')
    search_fields = ('user__username', 'quiz__title', 'feedback_text')
    readonly_fields = ('submitted_at',)


# ---------- JWT Token Admin Fix ----------
class OutstandingTokenAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'jti', 'created_at', 'expires_at')
    search_fields = ('user__username',)


class BlacklistedTokenAdmin(admin.ModelAdmin):
    list_display = ('id', 'token_jti', 'blacklisted_at', 'user')
    search_fields = ('token__user__username',)

    def token_jti(self, obj):
        return obj.token.jti

    def user(self, obj):
        return obj.token.user
    user.admin_order_field = 'token__user'


# ---------- Register Models ----------
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Submission)
admin.site.register(StudentQuiz, StudentQuizAdmin)
admin.site.register(StudentQuizQuestions)


# Register JWT token blacklist models with custom admins
admin.site.unregister(OutstandingToken)
admin.site.unregister(BlacklistedToken)
admin.site.register(OutstandingToken, OutstandingTokenAdmin)
admin.site.register(BlacklistedToken, BlacklistedTokenAdmin)
