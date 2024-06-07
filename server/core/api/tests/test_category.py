from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from core.api.models.category import Category


class CategoryModelTest(TestCase):

    def setUp(self):
        self.image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'this is a test image content',
            content_type='image/jpeg'
        )

    @patch('core.api.utils.ImageUtils.upload_image_to')
    def test_create_category(self, mock_upload_image_to):
        mock_upload_image_to.return_value = 'path/to/uploaded/image.jpg'
        category = Category.objects.create(
            title="Test Category",
            image=self.image
        )
        self.assertEqual(category.title, "Test Category")
        self.assertTrue(category.image)

    @patch('core.api.utils.ImageUtils.upload_image_to')
    def test_upload_image_to(self, mock_upload_image_to):
        mock_upload_image_to.return_value = 'path/to/uploaded/image.jpg'
        category = Category.objects.create(
            title="Test Category",
            image=self.image
        )
        upload_path = category.upload_image_to(self.image.name)
        self.assertEqual(upload_path, 'path/to/uploaded/image.jpg')

    @patch('core.api.utils.ImageUtils.remove_image_from')
    def test_remove_image(self, mock_remove_image_from):
        category = Category.objects.create(
            title="Test Category",
            image=self.image
        )
        category.remove_image()
        mock_remove_image_from.assert_called_once()

    @patch('core.api.utils.ImageUtils.remove_image_from')
    def test_delete_category(self, mock_remove_image_from):
        category = Category.objects.create(
            title="Test Category",
            image=self.image
        )
        category.delete()
        self.assertEqual(Category.objects.count(), 0)
        mock_remove_image_from.assert_called_once()

    def test_str_method(self):
        category = Category.objects.create(
            title="Test Category",
            image=self.image
        )
        self.assertEqual(str(category), "Test Category")
