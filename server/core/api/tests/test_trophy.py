from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from core.api.models.trophy import Trophy


class TrophyModelTest(TestCase):

    def setUp(self):
        self.image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'this is a test image content',
            content_type='image/jpeg'
        )
        self.trophy = Trophy.objects.create(
            title="Test Trophy",
            description="This is a test trophy description.",
            image=self.image,
            activation="Some activation criteria"
        )

    @patch('core.api.utils.ImageUtils.upload_image_to')
    def test_upload_image_to(self, mock_upload_image_to):
        mock_upload_image_to.return_value = 'path/to/uploaded/image.jpg'
        upload_path = self.trophy.upload_image_to(self.image.name)
        self.assertEqual(upload_path, 'path/to/uploaded/image.jpg')

    @patch('core.api.utils.ImageUtils.remove_image_from')
    def test_remove_image(self, mock_remove_image_from):
        self.trophy.remove_image()
        mock_remove_image_from.assert_called_once()

    @patch('core.api.utils.ImageUtils.remove_image_from')
    def test_delete_trophy(self, mock_remove_image_from):
        self.trophy.delete()
        self.assertEqual(Trophy.objects.count(), 0)
        mock_remove_image_from.assert_called_once()

    def test_str_method(self):
        self.assertEqual(str(self.trophy), "Test Trophy")
