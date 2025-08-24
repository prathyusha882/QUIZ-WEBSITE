import subprocess
import os
import tempfile
from celery import shared_task
from django.db.models import Sum
from .models import Submission, Choice, TestCase, StudentQuiz


@shared_task
def grade_submission(submission_id):
    """
    Celery task to grade a single submission.
    Handles MCQ, text, True/False, fill in the blank, and coding questions.
    Updates Submission and StudentQuiz total_score.
    """
    try:
        submission = Submission.objects.select_related('question', 'quiz', 'user').get(id=submission_id)
        question = submission.question
        answer_text = (submission.answer_text or "").strip()
        qtype = (question.question_type or "").lower()

        is_correct = False
        score_awarded = 0

        if qtype == 'mcq':
            # For MCQs, check if submitted choice ID or text matches a correct choice
            correct_choices = Choice.objects.filter(question=question, is_correct=True).values_list('id', flat=True)
            try:
                submitted_choice_id = int(answer_text)
                is_correct = submitted_choice_id in list(correct_choices)
            except (ValueError, TypeError):
                # Fall back to matching text if answer_text is not an int
                correct_texts = Choice.objects.filter(question=question, is_correct=True).values_list('choice_text', flat=True)
                is_correct = answer_text in [c.strip() for c in correct_texts]

            score_awarded = question.points if is_correct else 0

        elif qtype in ('text', 'tf', 'fill'):
            # For text/true-false/fill, compare submitted answer text ignoring case/whitespace
            correct_answers = Choice.objects.filter(question=question, is_correct=True).values_list('choice_text', flat=True)
            is_correct = any(answer_text.lower() == ca.strip().lower() for ca in correct_answers)
            score_awarded = question.points if is_correct else 0

        elif qtype == 'code':
            # For coding questions, run each test case and check outputs
            test_cases = TestCase.objects.filter(question=question)
            all_passed = True
            for tc in test_cases:
                output = execute_code_in_sandbox(answer_text, tc.input_data)
                if output.strip() != (tc.expected_output or '').strip():
                    all_passed = False
                    break
            is_correct = all_passed
            score_awarded = question.points if is_correct else 0

        # Update the submission record
        submission.is_correct = is_correct
        submission.score_awarded = score_awarded
        submission.save()

        # Update total score in StudentQuiz
        student_quiz = StudentQuiz.objects.filter(
            student=submission.user, quiz=submission.quiz, completed_at__isnull=True
        ).order_by('-started_at').first()

        if student_quiz:
            total = Submission.objects.filter(user=submission.user, quiz=submission.quiz).aggregate(
                total_score=Sum('score_awarded')
            )['total_score'] or 0
            student_quiz.total_score = total
            student_quiz.save()

        return f"Submission {submission_id} graded successfully."

    except Submission.DoesNotExist:
        return f"Submission with id {submission_id} not found."
    except Exception as e:
        return f"Error grading submission {submission_id}: {str(e)}"


def execute_code_in_sandbox(code, input_data):
    """
    Executes given Python code safely in a temporary file with input_data fed to stdin.
    Returns stdout output or error messages.
    Has a 5-second timeout to avoid hanging processes.
    """
    filename = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
            f.write(code)
            filename = f.name

        process = subprocess.run(
            ['python', filename],
            input=input_data or '',
            capture_output=True,
            text=True,
            timeout=5
        )
        # Return stderr if there is an error; else stdout
        if process.returncode != 0:
            return process.stderr.strip() or process.stdout.strip()
        return process.stdout.strip() or ''

    except subprocess.TimeoutExpired:
        return "Execution timed out."
    except Exception as e:
        return f"Execution error: {str(e)}"
    finally:
        # Clean up temp file safely
        if filename and os.path.exists(filename):
            try:
                os.remove(filename)
            except Exception:
                pass
