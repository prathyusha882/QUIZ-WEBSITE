from rest_framework import serializers
from .models import Quiz, Question, StudentQuizAttempt, Answer, QuizFeedback


# OptionSerializer includes 'id' for unique identification and mapping
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer.question.field.related_model.choices.rel.related_model
        fields = ['id', 'choice_text', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    # options uses ModelSerializer for Choices
    options = OptionSerializer(source='choices', many=True, required=False)
    test_cases = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'text', 'question_type', 'points', 'options',
            'problem_statement', 'sample_input', 'sample_output', 'test_cases', 'order',
        ]

    def get_test_cases(self, obj):
        return [
            {
                'input_data': tc.input_data,
                'expected_output': tc.expected_output,
                'is_hidden': tc.is_hidden
            }
            for tc in obj.test_cases.all()
        ]


class QuizSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'duration_minutes', 'total_marks', 'active',
            'start_time', 'end_time', 'max_attempts', 'random_order', 'questions'
        ]

    def get_questions(self, obj):
        qs = obj.questions.all()
        if obj.random_order:
            return QuestionSerializer(qs.order_by('?'), many=True).data
        return QuestionSerializer(qs, many=True).data


class AnswerDetailSerializer(serializers.ModelSerializer):
    # Here we include the full question detail for frontend rendering
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = Answer
        fields = ['question', 'selected_option', 'answer_text', 'code_submitted', 'graded_score']


class StudentQuizAttemptSerializer(serializers.ModelSerializer):
    answers = AnswerDetailSerializer(many=True)
    quiz = QuizSerializer(read_only=True)

    class Meta:
        model = StudentQuizAttempt
        fields = [
            'id', 'quiz', 'start_time', 'submitted', 'submission_time', 'total_score',
            'total_possible_points', 'answers'
        ]


class SubmitAnswerSerializer(serializers.Serializer):
    question = serializers.IntegerField()
    selected_option = serializers.JSONField(required=False)
    answer_text = serializers.CharField(required=False, allow_blank=True)
    code_submitted = serializers.CharField(required=False, allow_blank=True)


class QuizSubmitSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)


class LeaderboardEntrySerializer(serializers.Serializer):
    user = serializers.CharField(source='user.username')
    quiz = serializers.CharField(source='quiz.title')  # added quiz title to leaderboard serializer
    total_score = serializers.FloatField()
    submission_time = serializers.DateTimeField()


class QuizFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizFeedback
        fields = ['id', 'attempt', 'user', 'quiz', 'feedback_text', 'submitted_at']
        read_only_fields = ['id', 'user', 'submitted_at']
