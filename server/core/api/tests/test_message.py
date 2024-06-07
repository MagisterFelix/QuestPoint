from django.contrib.auth import get_user_model
from django.test import TestCase

from core.api.models.category import Category
from core.api.models.message import Message
from core.api.models.quest import Quest

User = get_user_model()


class MessageModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123",
            balance=50,
        )
        self.category = Category.objects.create(
            title="Test Category"
        )
        self.quest = Quest.objects.create(
            title="Test Quest",
            description="This is a test quest description.",
            creator=self.user,
            category=self.category,
            reward=10,
            latitude=40.7128,
            longitude=-74.0060
        )

    def test_create_text_message(self):
        message = Message.objects.create(
            quest=self.quest,
            author=self.user,
            content="This is a test text message.",
            content_type=Message.ContentType.TEXT
        )
        self.assertEqual(message.content, "This is a test text message.")
        self.assertEqual(message.content_type, Message.ContentType.TEXT)

    def test_create_image_message(self):
        message = Message.objects.create(
            quest=self.quest,
            author=self.user,
            content="path/to/image.jpg",
            content_type=Message.ContentType.IMAGE
        )
        self.assertEqual(message.content, "path/to/image.jpg")
        self.assertEqual(message.content_type, Message.ContentType.IMAGE)

    def test_str_method(self):
        text_message = Message.objects.create(
            quest=self.quest,
            author=self.user,
            content="This is a test text message.",
            content_type=Message.ContentType.TEXT
        )
        image_message = Message.objects.create(
            quest=self.quest,
            author=self.user,
            content="path/to/image.jpg",
            content_type=Message.ContentType.IMAGE
        )
        self.assertEqual(str(text_message), "Text")
        self.assertEqual(str(image_message), "Image")

    def test_message_ordering(self):
        older_message = Message.objects.create(
            quest=self.quest,
            author=self.user,
            content="Older message",
            content_type=Message.ContentType.TEXT
        )
        newer_message = Message.objects.create(
            quest=self.quest,
            author=self.user,
            content="Newer message",
            content_type=Message.ContentType.TEXT
        )
        messages = Message.objects.all()
        self.assertEqual(messages[0], older_message)
        self.assertEqual(messages[1], newer_message)
