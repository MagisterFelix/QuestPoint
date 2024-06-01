from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models.category import Category
from ..models.quest import Quest

User = get_user_model()


class QuestModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123",
            balance=100
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

    def test_create_quest(self):
        quest = Quest.objects.create(
            title="Another Test Quest",
            description="This is another test description.",
            creator=self.user,
            category=self.category,
            reward=15,
            latitude=34.0522,
            longitude=-118.2437
        )
        self.assertEqual(quest.title, "Another Test Quest")
        self.assertEqual(quest.reward, 15)

    def test_str_method(self):
        self.assertEqual(str(self.quest), "Test Quest")

    def test_clean_validations(self):
        # Test reward validation
        with self.assertRaises(ValidationError) as context:
            self.quest.reward = 0
            self.quest.clean()
        self.assertIn("Reward cannot be zero.", context.exception)

        with self.assertRaises(ValidationError) as context:
            self.quest.reward = 3
            self.quest.clean()
        self.assertIn("Reward cannot be lower than 5 coins.", context.exception)

        with self.assertRaises(ValidationError) as context:
            self.quest.reward = 7
            self.quest.clean()
        self.assertIn("Reward must be divisible 5.", context.exception)

        # Test creator's balance validation
        with self.assertRaises(ValidationError) as context:
            self.quest.reward = 200
            self.quest.clean()
        self.assertIn("Reward cannot be greater than creator's balance.", context.exception)

        # Test latitude and longitude validation
        with self.assertRaises(ValidationError) as context:
            self.quest.creator.balance = 10
            self.quest.reward = 5
            self.quest.latitude = 100
            self.quest.clean()
        self.assertIn("Invalid coords.", context.exception)

        with self.assertRaises(ValidationError) as context:
            self.quest.creator.balance = 10
            self.quest.reward = 5
            self.quest.longitude = 200
            self.quest.clean()
        self.assertIn("Invalid coords.", context.exception)

    def test_save_and_delete_balance_adjustment(self):
        # Test balance adjustment on save
        self.quest.save()
        self.user.refresh_from_db()
        self.assertEqual(self.user.balance, 88)  # 100 - (10 * 1.2)

        # Test balance adjustment on delete
        self.quest.delete()
        self.user.refresh_from_db()
        self.assertEqual(self.user.balance, 100)  # 88 + (10 * 1.2)
