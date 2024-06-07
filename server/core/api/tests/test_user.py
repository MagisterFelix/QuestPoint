from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

User = get_user_model()


class UserManagerTest(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "testuser@example.com")
        self.assertTrue(user.check_password("testpassword123"))

    def test_create_user_no_username(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                username="",
                email="testuser@example.com",
                password="testpassword123"
            )

    def test_create_user_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                username="testuser",
                email="",
                password="testpassword123"
            )

    def test_create_user_no_password(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                username="testuser",
                email="testuser@example.com",
                password=""
            )

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="adminpassword123"
        )
        self.assertEqual(superuser.username, "admin")
        self.assertEqual(superuser.email, "admin@example.com")
        self.assertTrue(superuser.check_password("adminpassword123"))
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)


class UserModelTest(TestCase):

    def setUp(self):
        self.image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'this is a test image content',
            content_type='image/jpeg'
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123",
            image=self.image
        )

    @patch('core.api.utils.ImageUtils.upload_image_to')
    def test_upload_image_to(self, mock_upload_image_to):
        mock_upload_image_to.return_value = 'path/to/uploaded/image.jpg'
        upload_path = self.user.upload_image_to(self.image.name)
        self.assertEqual(upload_path, 'path/to/uploaded/image.jpg')

    @patch('core.api.utils.ImageUtils.remove_image_from')
    def test_remove_image(self, mock_remove_image_from):
        self.user.remove_image()
        mock_remove_image_from.assert_called_once()

    @patch('core.api.utils.ImageUtils.remove_image_from')
    def test_delete_user(self, mock_remove_image_from):
        self.user.delete()
        self.assertEqual(User.objects.count(), 0)
        mock_remove_image_from.assert_called_once()

    def test_level_property(self):
        self.user.xp = 150
        self.assertEqual(self.user.level, 2)
        self.user.xp = 350
        self.assertEqual(self.user.level, 4)

    def test_str_method(self):
        self.assertEqual(str(self.user), "testuser")
