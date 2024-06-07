from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from core.api.models.category import Category
from core.api.models.quest import Quest
from core.api.models.record import Record

User = get_user_model()


class RecordModelTest(TestCase):

    def setUp(self):
        self.creator = User.objects.create_user(
            username="creator",
            email="creator@example.com",
            password="testpassword123",
            balance=50
        )
        self.worker = User.objects.create_user(
            username="worker",
            email="worker@example.com",
            password="testpassword123"
        )
        self.category = Category.objects.create(
            title="Test Category"
        )
        self.quest = Quest.objects.create(
            title="Test Quest",
            description="This is a test quest description.",
            creator=self.creator,
            category=self.category,
            reward=10,
            latitude=40.7128,
            longitude=-74.0060
        )

    def test_create_record(self):
        record = Record.objects.create(
            quest=self.quest,
            worker=self.worker
        )
        self.assertEqual(record.quest, self.quest)
        self.assertEqual(record.worker, self.worker)
        self.assertEqual(record.status, Record.Status.HAS_OFFER)

    def test_create_record_invalid_worker(self):
        with self.assertRaises(ValidationError):
            record = Record(
                quest=self.quest,
                worker=self.creator
            )
            record.full_clean()

    def test_create_record_already_taken(self):
        Record.objects.create(
            quest=self.quest,
            worker=self.worker
        )
        new_worker = User.objects.create_user(
            username="newworker",
            email="newworker@example.com",
            password="testpassword123"
        )
        with self.assertRaises(ValidationError):
            record = Record(
                quest=self.quest,
                worker=new_worker
            )
            record.full_clean()

    def test_create_record_with_notification(self):
        record = Record.objects.create(
            quest=self.quest,
            worker=self.worker,
            with_notification=self.creator
        )
        self.assertEqual(record.with_notification, self.creator)

    def test_create_record_invalid_notification(self):
        another_user = User.objects.create_user(
            username="anotheruser",
            email="anotheruser@example.com",
            password="testpassword123"
        )
        with self.assertRaises(ValidationError):
            record = Record(
                quest=self.quest,
                worker=self.worker,
                with_notification=another_user
            )
            record.full_clean()

    def test_str_method(self):
        record = Record.objects.create(
            quest=self.quest,
            worker=self.worker
        )
        self.assertEqual(str(record), self.quest.title)
