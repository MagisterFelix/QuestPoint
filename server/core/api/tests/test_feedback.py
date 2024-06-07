from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models.feedback import Feedback

User = get_user_model()


class FeedbackModelTest(TestCase):

    def setUp(self):
        self.author = User.objects.create_user(
            username="author",
            email="author@example.com",
            password="testpassword123",
            balance=50
        )
        self.recipient = User.objects.create_user(
            username="recipient",
            email="recipient@example.com",
            password="testpassword123"
        )

    def test_create_feedback(self):
        feedback = Feedback.objects.create(
            author=self.author,
            recipient=self.recipient,
            text="This is a test feedback.",
            rating=4
        )
        self.assertEqual(feedback.author, self.author)
        self.assertEqual(feedback.recipient, self.recipient)
        self.assertEqual(feedback.text, "This is a test feedback.")
        self.assertEqual(feedback.rating, 4)

    def test_feedback_with_no_text(self):
        feedback = Feedback.objects.create(
            author=self.author,
            recipient=self.recipient,
            rating=5
        )
        self.assertEqual(feedback.text, "")

    def test_feedback_rating_validation(self):
        with self.assertRaises(ValidationError):
            Feedback.objects.create(
                author=self.author,
                recipient=self.recipient,
                text="Invalid rating feedback.",
                rating=6
            ).full_clean()

        with self.assertRaises(ValidationError):
            Feedback.objects.create(
                author=self.author,
                recipient=self.recipient,
                text="Invalid rating feedback.",
                rating=0
            ).full_clean()

    def test_feedback_author_recipient_validation(self):
        with self.assertRaises(ValidationError):
            feedback = Feedback(
                author=self.author,
                recipient=self.author,
                text="Self feedback.",
                rating=3
            )
            feedback.full_clean()

    def test_str_method(self):
        feedback = Feedback.objects.create(
            author=self.author,
            recipient=self.recipient,
            text="This is a test feedback.",
            rating=4
        )
        self.assertEqual(str(feedback), self.recipient.username)

    def test_feedback_ordering(self):
        feedback1 = Feedback.objects.create(
            author=self.author,
            recipient=self.recipient,
            text="First feedback.",
            rating=4
        )
        feedback2 = Feedback.objects.create(
            author=self.author,
            recipient=self.recipient,
            text="Second feedback.",
            rating=5
        )
        feedbacks = Feedback.objects.all()
        self.assertEqual(feedbacks[0], feedback2)
        self.assertEqual(feedbacks[1], feedback1)
